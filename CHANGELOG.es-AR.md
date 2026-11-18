<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

Nueva opción `aoFechar` en `confirmar()`: el valor que se devuelve cuando la persona cierra el diálogo sin responder (`Esc`, X o clic afuera). El botón Cancelar sigue devolviendo `false` como respuesta explícita. La cancelación por `AbortSignal` (ya abortado, abierto, minimizado o en cola) también devuelve `aoFechar`. El valor por defecto `false` conserva el comportamiento anterior; usá `aoFechar: null` para distinguir "lo descartó" de "no". `perguntar()` y `avisar()` no cambian. Pruebas con un DOM mínimo sintético cubren los dos casos.

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Identidad Rdraim, presentación gráfica, revisión de compatibilidad y control de historial más eficiente. API de ejecución conservada.

Las funciones aceptan `signal: AbortSignal`. Cancelar devuelve `null` en `perguntar`, `false` en `confirmar` y `undefined` en `avisar`, incluso en diálogos minimizados o en cola. Usá AbortController cuando se desmonte una página.

# 1.1.0 — 2026-10-07

Modal nativo, cola, nombres accesibles, temas y minimizar/restaurar conservando los campos.

Documentación en portugués brasileño e inglés de Estados Unidos, apoyo voluntario todavía sin canal de pago en esa versión y verificaciones de publicación.
