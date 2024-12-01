---
"@rdfjs/types": major
---

In some cases, loaders would report an error similar to `Could not resolve "./data-model"`. This is fixed by using `export type *` but requires [TypeScript 5+](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#support-for-export-type-)
