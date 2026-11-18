<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

New `aoFechar` option for `confirmar()`: the value returned when the person closes the dialog without answering (`Esc`, X or a click outside). The Cancel button still returns `false` as an explicit answer. Cancellation through `AbortSignal` (already aborted, open, minimized or queued) also returns `aoFechar`. The `false` default preserves the previous behavior; use `aoFechar: null` to tell "dismissed" apart from "no". `perguntar()` and `avisar()` are unchanged. Tests with a minimal synthetic DOM cover both cases.

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Rdraim identity, visual presentation, compatibility review and more efficient history guard. Runtime API preserved.

Functions accept `signal: AbortSignal`. Cancellation returns `null` for perguntar, `false` for confirmar and `undefined` for avisar; it works when open, minimized or queued. Use AbortController when a page unmounts.

# 1.1.0 — 2026-10-07

Native modal, queue, accessible names, themes and input-preserving minimize/restore.

PT-BR/EN-US documentation, optional support with no payment channel, and publication checks.
