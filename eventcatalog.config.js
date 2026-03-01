import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type {import('@eventcatalog/core/bin/eventcatalog.config').Config} */
export default {
  cId: '21258810-4c0d-47a9-8270-d9258e844495',
  title: "DataRecs Event Catalog",
  tagline: "Discover, explore, and understand our events and services",
  organizationName: "DataRecs",
  homepageLink: "https://datarecs.com",
  editUrl: "https://github.com/datarecs/event-catalog/edit/main",
  trailingSlash: false,
  base: "/",
  logo: {
    alt: "DataRecs Logo",
    src: "/logo.png",
  },
  docs: {
    sidebar: {
      showPageHeadings: true,
    },
  },
};
