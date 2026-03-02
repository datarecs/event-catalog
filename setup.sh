#!/usr/bin/env bash

set -euo pipefail

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }

log "🏗️  Building and deploying event-catalog service..."

# Generate unique tag using timestamp and git commit (if available)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "nogit")
IMAGE_TAG="${TIMESTAMP}-${GIT_COMMIT}"

log "📦 Building multi-architecture Docker image with tag: ${IMAGE_TAG}"

# Build and push with unique tag
docker buildx build --platform linux/amd64,linux/arm64 -t localhost:5001/event-catalog:${IMAGE_TAG} -f Dockerfile --push .

# Also tag with the cluster-internal name
docker tag localhost:5001/event-catalog:${IMAGE_TAG} k3d-registry.datarecs.local:5000/event-catalog:${IMAGE_TAG}

log "📦 Creating namespace if it doesn't exist..."
kubectl create namespace datarecs --context k3d-datarecs --dry-run=client -o yaml | kubectl apply --context k3d-datarecs -f -

log "🔄 Updating Kubernetes deployment manifest with new image tag..."
# Create a temporary manifest with the new image tag
TEMP_MANIFEST=$(mktemp)
cp k8s/deployment.yaml "${TEMP_MANIFEST}"

# Update image reference in the manifest
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS sed
  sed -i '' "s|image: .*event-catalog:.*|image: k3d-registry.datarecs.local:5000/event-catalog:${IMAGE_TAG}|g" "${TEMP_MANIFEST}"
else
  # Linux sed
  sed -i "s|image: .*event-catalog:.*|image: k3d-registry.datarecs.local:5000/event-catalog:${IMAGE_TAG}|g" "${TEMP_MANIFEST}"
fi

log "🚀 Deploying to Kubernetes with new image: k3d-registry.datarecs.local:5000/event-catalog:${IMAGE_TAG}"
kubectl apply --context k3d-datarecs -f "${TEMP_MANIFEST}"

# Clean up temporary file
rm -f "${TEMP_MANIFEST}"

log "🚀 Deploying Service..."
kubectl apply --context k3d-datarecs -f k8s/service.yaml

log "🚀 Deploying VirtualService (Ingress)..."
kubectl apply --context k3d-datarecs -f k8s/ingress.yaml

log "⏳ Waiting for deployment to be ready..."
# Wait for the deployment to be ready (up to 60 seconds)
kubectl wait --context k3d-datarecs --for=condition=Available deployment/event-catalog -n datarecs --timeout=60s || {
  log "⚠️  Deployment did not become ready within 60 seconds, but continuing..."
}

# Check deployment status
log "📋 Deployment Information:"
kubectl get --context k3d-datarecs deployment event-catalog -n datarecs
echo ""
log "📋 Recent Pods:"
kubectl get --context k3d-datarecs pods -n datarecs -l app=event-catalog | grep event-catalog || echo "  (No pods yet)"

log "✅ event-catalog service deployed successfully with image tag: ${IMAGE_TAG}!"
echo ""
log "💡 Image deployed: k3d-registry.datarecs.local:5000/event-catalog:${IMAGE_TAG}"
log "🌐 Access at: http://events.datarecs.local"
