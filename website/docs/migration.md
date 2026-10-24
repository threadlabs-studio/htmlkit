---
title: Moving to Threadlabs
description: Update an existing HTMLKit project to the Threadlabs package.
---

# Move your HTMLKit project to Threadlabs

HTMLKit is now a Threadlabs product. Its package is `@threadlabs/htmlkit` and its source lives in [threadlabs-studio/htmlkit](https://github.com/threadlabs-studio/htmlkit). HTML Next remains a Next Web Working Group project and HTMLKit's component runtime.

## Update the package

```sh
npm uninstall @nextwebwg/htmlkit
npm install @threadlabs/htmlkit
```

The first Threadlabs release starts from `@nextwebwg/htmlkit@1.0.0-alpha.69`. Projects on an earlier alpha should review the intervening HTMLKit changes as well as the package rename.

## Update imports and component links

Replace `@nextwebwg/htmlkit` with `@threadlabs/htmlkit` in configuration, server modules, application imports, and component resource links:

```ts
import { defineConfig } from '@threadlabs/htmlkit';
import type { LoadContext } from '@threadlabs/htmlkit';
```

```html
<link rel="component" href="@threadlabs/htmlkit/components/nav.html">
```

The `htmlkit` commands, `htmlkit.config.ts`, `hk:*` metadata, routes, and layouts keep their names. Imports from `@nextwebwg/html-next` stay as they are. Rebuild the application after changing packages so generated server imports use the new name.
