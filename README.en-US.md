# avisar

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.md)

Queued Promise-based alert, confirm and prompt dialogs using native HTML dialog behavior.

## Start here

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/avisar.git
cd avisar
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { avisar, confirmar, perguntar } from './src/index.js';
await avisar('Saved.', { titulo: 'Notice', tema: 'claro' });
const accepted = await confirmar({ texto: 'Continue?', cancelar: 'Cancel', confirmar: 'Continue' });
const name = await perguntar({ titulo: 'Name', texto: 'Enter a name', valor: '', cancelar: 'Cancel' });
```

## API

`avisar(texto, opcoes)` → Promise<void>; `confirmar(texto | opcoes)` → Promise<boolean>; `perguntar(texto | opcoes)` → Promise<string | null>; `CSS`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

Options: `titulo`, `texto`, `valor`, `confirmar`, `cancelar`, `perigo`, `tema` (auto/claro/escuro), `minimizar`, `rotuloCampo`, `nonce`, `injetarCSS`. Requires a modern browser with dialog.showModal. SSR imports work, but interaction without a DOM rejects. Dialogs are queued. Escape/X cancel, Enter submits the form, and native modal behavior traps Tab focus. Minimizing preserves input and releases the page until restored; the Promise stays pending. Text uses textContent. For strict CSP, provide a nonce or external CSS with `injetarCSS: false` (CSS is exported). Customize labels for English. See `examples/index.html`.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Version 1.1.0

Native modal, queue, accessible names, themes and input-preserving minimize/restore.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.md)

MIT © Rodrigo Rodrigues


## Practical use — 1.2.0

Functions accept `signal: AbortSignal`. Cancellation returns `null` for perguntar, `false` for confirmar and `undefined` for avisar; it works when open, minimized or queued. Use AbortController when a page unmounts.
