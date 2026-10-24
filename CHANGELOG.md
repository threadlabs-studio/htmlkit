# Changelog

## 0.1.0

- Move HTMLKit from the HTML Next monorepo to Threadlabs as `@threadlabs/htmlkit`, preserving the package's Git history and MIT notice.
- Consume the published HTML Next runtime rather than workspace source files.
- Add standalone package checks and a product website retaining the HTMLKit logo.

This release starts from `@nextwebwg/htmlkit@1.0.0-alpha.69`. Existing applications should replace package imports and component resource links with `@threadlabs/htmlkit`; the `htmlkit` commands and `hk:*` markup stay the same.
