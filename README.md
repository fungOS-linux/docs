# fungOS and Soil documentation

The public documentation site for fungOS and the Soil runtime.

```sh
npm install
npm run dev      # http://localhost:4322
npm run build    # public static build -> dist/
npm run preview
```

The site uses [`@ajmwagar/docs-kit`](https://github.com/ajmwagar/docs-kit) for
the Mintlify-style shell, navigation, search, theme, and audience filtering.

Content lives in `content/`. `docs.json` is the navigation manifest. The
platform pages describe the node, identity, transport, presentation, content,
and security boundaries; the Soil section covers the WASM runtime, capability
contracts, and the file-browser contracts.

Build output is static and uses hash routing, so `dist/` can be served from any
static host.
