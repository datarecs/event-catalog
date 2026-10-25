import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, relative, resolve } from 'node:path';

// Keep the runtime dependency-free: the previous global static-server package
// reintroduced high-severity production findings after the application lock was fixed.
const root = await realpath(resolve(process.env.STATIC_ROOT ?? 'dist'));
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const mimeTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
    ['.webp', 'image/webp'],
]);

/**
 * Returns whether a resolved filesystem path remains under the configured static root.
 * @param {string} path - Absolute path after normalization or symlink resolution.
 * @returns {boolean} False for all paths that escape the static root.
 */
function isWithinRoot(path) {
    const pathFromRoot = relative(root, path);
    return (pathFromRoot === '' || !pathFromRoot.startsWith('..')) && !pathFromRoot.includes('../');
}

/**
 * Rejects direct and recursively encoded parent-directory segments before routing.
 * @param {string} path - Raw URL pathname, without its query string.
 * @returns {boolean} True when the request must not be resolved on disk.
 */
function hasTraversalSegment(path) {
    let decodedPath = path;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        if (/(^|[\\/])\.\.([\\/]|$)/.test(decodedPath)) {
            return true;
        }
        try {
            const nextPath = decodeURIComponent(decodedPath);
            if (nextPath === decodedPath) {
                return false;
            }
            decodedPath = nextPath;
        } catch {
            return true;
        }
    }
    return false;
}

/**
 * Resolves a request to a regular static file without allowing symlinks to escape root.
 * @param {string} requestPath - Decoded absolute URL pathname.
 * @returns {Promise<string | null | false>} A safe file path, null for a missing route,
 * or false when a path attempts to escape the static root.
 */
async function responseFile(requestPath) {
    const target = resolve(root, `.${requestPath}`);
    if (!isWithinRoot(target)) {
        return false;
    }

    try {
        const candidate = (await stat(target)).isDirectory() ? resolve(target, 'index.html') : target;
        const resolvedCandidate = await realpath(candidate);
        return isWithinRoot(resolvedCandidate) ? resolvedCandidate : false;
    } catch {
        return null;
    }
}

const server = createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method ?? '')) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
    }

    const rawPath = (request.url ?? '/').split('?')[0];
    if (hasTraversalSegment(rawPath)) {
        response.writeHead(404).end();
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    } catch {
        response.writeHead(400).end();
        return;
    }

    if (!isWithinRoot(resolve(root, `.${pathname}`))) {
        response.writeHead(404).end();
        return;
    }

    const requestedFile = await responseFile(pathname);
    const file = requestedFile === null ? await responseFile('/index.html') : requestedFile;
    if (!file) {
        response.writeHead(404).end();
        return;
    }

    const headers = {
        'Content-Type': mimeTypes.get(extname(file)) ?? 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
    };
    if (request.method === 'HEAD') {
        response.writeHead(200, headers).end();
        return;
    }

    const stream = createReadStream(file);
    stream.once('error', () => {
        if (response.headersSent) {
            response.destroy();
            return;
        }
        response.writeHead(404).end();
    });
    stream.once('open', () => {
        response.writeHead(200, headers);
        stream.pipe(response);
    });
});

server.listen(port, '0.0.0.0');
