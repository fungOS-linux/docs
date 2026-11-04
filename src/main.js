import { mountDocs } from "@ajmwagar/docs-kit";
import bundle from "virtual:docs-kit";

mountDocs(bundle, {
  brand: {
    name: "fungOS",
    mark: "f",
    badge: "Docs",
    homeLabel: "fungOS documentation home",
  },
  repo: __DOCS_INTERNAL__
    ? {
        url: "https://github.com/fungOS-linux",
        blobBase: "https://github.com/fungOS-linux",
        rawBase: "https://raw.githubusercontent.com/fungOS-linux",
      }
    : {},
  defaultSlug: "introduction",
  storageKey: "fungos-docs",
  audience: {
    labels: { public: "Public", internal: "Internal" },
    scopes: {
      public: "Public fungOS and Soil documentation",
      internal: "Internal engineering notes",
    },
  },
});
