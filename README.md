# HTMLKit

Build with HTML again.

The HTML, CSS, and JavaScript you know, with components, routing, and server rendering powered by
the next generation of HTML. HTMLKit also provides shared layouts and typed data for your application.

HTMLKit is a Threadlabs product, built on [HTML Next](https://github.com/nextwebwg/html-next),
the implementation of the Next Web Working Group's declarative components proposal.
[Markupress](https://github.com/threadlabs-studio/markupress) builds documentation on HTMLKit;
HTMLKit owns the application platform and Markupress owns the documentation experience.

HTMLKit (`@threadlabs/htmlkit`) builds applications with HTML Next components. It provides routes,
layouts, server loaders, endpoints, middleware, browser delivery, and development tools. A build
prerenders pages for any static host and writes a request server for pages that render on each
request, which `htmlkit start` runs on Node and Deno and Bun run through its `fetch`.
[The server-rendering design](./docs/server-rendering.md) records how requests are answered.

Use Node `>=22.22.2 <23 || >=24.15 <25`. Install `@threadlabs/htmlkit` and add its commands to your
`package.json` scripts:

```json
{
  "scripts": {
    "dev": "htmlkit dev",
    "build": "htmlkit build",
    "preview": "htmlkit preview",
    "start": "htmlkit start"
  }
}
```

Then run `pnpm dev`, `pnpm build`, `pnpm preview`, or `pnpm start` (`npm run dev` and the others work too).

**Guide:** [HTMLKit](https://threadlabs-studio.github.io/htmlkit/) covers pages and routing,
loading data, endpoints and middleware, navigation, moving between pages, deployment, and
configuration. Its source is
[`website/docs`](./website/docs/) in this repository, built with Markupress.
[The client-navigation design](./docs/client-navigation.md) records how pages swap in place.

## Proof applications

From this repository, after building:

```sh
node dist/cli.js build examples/basic
node dist/cli.js preview examples/basic
pnpm build:docs-proof
node dist/cli.js preview .context/htmlkit-docs-proof
```

The basic application exercises routes, loaders, state, and component modules without documentation
features. The docs proof converts this repository's Markdown guides and generates a component
reference, code display, heading anchors, search navigation, a theme, and an interactive example.
Its Markdown dependency and theme live in the consumer, outside the platform runtime and published
package. Its input is trusted, checked-in author content; it does not sanitize arbitrary Markdown.

HTMLKit is MIT-licensed.
