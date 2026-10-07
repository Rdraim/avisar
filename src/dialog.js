/** Async dialogs with native modal isolation, queued to preserve focus. */
export const CSS = `
.avisar-caixa{box-sizing:border-box;background:var(--avisar-fundo,#fff);color:var(--avisar-texto,#111827);width:min(420px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;border:0;border-radius:12px;padding:20px;font:15px/1.5 system-ui,sans-serif;box-shadow:0 10px 40px #0004}
.avisar-caixa::backdrop{background:#0007}.avisar-caixa h2{font-size:17px;margin:0 64px 8px 0;overflow-wrap:anywhere}.avisar-caixa p{white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0 14px}
.avisar-caixa input{box-sizing:border-box;width:100%;padding:9px 10px;font:inherit;background:inherit;color:inherit;border:1px solid #94a3b8;border-radius:6px;margin:6px 0 14px}
.avisar-acoes{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.avisar-btn{font:inherit;background:transparent;color:inherit;border:1px solid #94a3b8;border-radius:6px;padding:8px 12px;cursor:pointer}.avisar-btn.ok{background:#1d4ed8;color:white;border:0}.avisar-btn.perigo{background:#b91c1c;color:white;border:0}
.avisar-controles{position:absolute;top:12px;right:12px;display:flex;gap:4px}.avisar-icone{border:0;background:transparent;color:inherit;font:20px system-ui;width:28px;height:28px;cursor:pointer}.avisar-icone.fechar{color:#b91c1c}
.avisar-restaurar{position:fixed;bottom:12px;right:12px;z-index:9999;background:#1d4ed8;color:white;border:0;border-radius:6px;padding:10px 14px;font:14px system-ui;max-width:calc(100vw - 24px);overflow-wrap:anywhere;cursor:pointer}
.avisar-caixa :focus-visible,.avisar-restaurar:focus-visible{outline:3px solid #d97706;outline-offset:3px}
.avisar-caixa[data-tema=escuro]{--avisar-fundo:#1e293b;--avisar-texto:#f1f5f9;color-scheme:dark}.avisar-caixa[data-tema=escuro] .fechar{color:#fca5a5}.avisar-caixa[data-tema=claro]{--avisar-fundo:#fff;--avisar-texto:#111827;color-scheme:light}
@media(prefers-color-scheme:dark){.avisar-caixa:not([data-tema=claro]){--avisar-fundo:#1e293b;--avisar-texto:#f1f5f9;color-scheme:dark}.avisar-caixa:not([data-tema=claro]) .fechar{color:#fca5a5}}
`;
let fila = Promise.resolve();
let proximoId = 0;
function elemento(tag, texto, classe) {
  const el = document.createElement(tag);
  if (texto != null) el.textContent = String(texto);
  if (classe) el.className = classe;
  return el;
}
function botao(texto, classe, acao) {
  const el = elemento('button', texto, classe);
  el.type = 'button'; el.addEventListener('click', acao);
  return el;
}
function abrir(o) {
  if (typeof document === 'undefined') return Promise.reject(new Error('avisar precisa de um navegador com DOM'));
  const resultado = fila.then(() => executar(o));
  fila = resultado.catch(() => {});
  return resultado;
}
function executar({ titulo = 'Aviso / Notice', texto = '', campo = false, confirmar = 'OK', cancelar = null, perigo = false, valor = '', tema = 'auto', nonce, injetarCSS = true, minimizar = true, rotuloCampo = texto || titulo }) {
  if (injetarCSS && !document.querySelector('style[data-avisar]')) {
    const estilo = elemento('style', CSS); estilo.dataset.avisar = '';
    if (nonce) estilo.nonce = nonce;
    document.head.append(estilo);
  }
  const anterior = document.activeElement;
  const dialogo = elemento('dialog', null, 'avisar-caixa');
  if (typeof dialogo.showModal !== 'function') throw new Error('navegador sem suporte a dialog.showModal');
  if (tema !== 'auto') {
    if (!['claro', 'escuro'].includes(tema)) throw new TypeError('tema inválido');
    dialogo.dataset.tema = tema;
  }
  const id = `avisar-${++proximoId}`;
  const tituloEl = elemento('h2', titulo); tituloEl.id = `${id}-titulo`;
  const mensagem = elemento('p', texto); mensagem.id = `${id}-texto`;
  dialogo.setAttribute('aria-labelledby', tituloEl.id);
  dialogo.setAttribute('aria-describedby', mensagem.id);
  dialogo.setAttribute('aria-modal', 'true');
  const form = elemento('form'); form.append(tituloEl, mensagem);
  let input;
  if (campo) {
    input = elemento('input'); input.type = 'text'; input.value = String(valor);
    input.setAttribute('aria-label', String(rotuloCampo)); form.append(input);
  }
  const acoes = elemento('div', null, 'avisar-acoes');
  const controles = elemento('div', null, 'avisar-controles');
  let restaurar, resolvido = false;
  return new Promise((resolve) => {
    const fechar = (resultado) => {
      if (resolvido) return;
      resolvido = true; dialogo.close(); dialogo.remove(); restaurar?.remove();
      if (anterior?.isConnected && typeof anterior.focus === 'function') anterior.focus();
      resolve(resultado);
    };
    const fecharBtn = botao('×', 'avisar-icone fechar', () => fechar(null));
    fecharBtn.title = 'Fechar / Close'; fecharBtn.setAttribute('aria-label', fecharBtn.title);
    if (minimizar) {
      const min = botao('_', 'avisar-icone', () => {
        dialogo.close();
        restaurar = botao(`Restaurar / Restore: ${titulo}`, 'avisar-restaurar', () => {
          restaurar.remove(); dialogo.showModal(); (input || ok).focus();
        });
        document.body.append(restaurar); restaurar.focus();
      });
      min.title = 'Minimizar / Minimize'; min.setAttribute('aria-label', min.title); controles.append(min);
    }
    controles.append(fecharBtn);
    if (cancelar) acoes.append(botao(cancelar, 'avisar-btn', () => fechar(null)));
    const ok = elemento('button', confirmar, `avisar-btn ${perigo ? 'perigo' : 'ok'}`); ok.type = 'submit';
    acoes.append(ok); form.append(acoes); dialogo.append(controles, form);
    form.addEventListener('submit', (ev) => { ev.preventDefault(); fechar(input ? input.value : true); });
    dialogo.addEventListener('cancel', (ev) => { ev.preventDefault(); fechar(null); });
    dialogo.addEventListener('click', (ev) => {
      const r = dialogo.getBoundingClientRect();
      if (cancelar && ev.target === dialogo && (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom)) fechar(null);
    });
    document.body.append(dialogo); dialogo.showModal(); (input || ok).focus();
  });
}
export function avisar(texto, opcoes = {}) { return abrir({ ...opcoes, texto, campo: false, cancelar: null }).then(() => undefined); }
export function confirmar(opcoes = {}) {
  const o = typeof opcoes === 'string' ? { texto: opcoes } : opcoes;
  return abrir({ ...o, campo: false, cancelar: o.cancelar || 'Cancelar', confirmar: o.confirmar || 'Confirmar' }).then((r) => r === true);
}
export function perguntar(opcoes = {}) {
  const o = typeof opcoes === 'string' ? { texto: opcoes } : opcoes;
  return abrir({ ...o, campo: true, cancelar: o.cancelar || 'Cancelar', confirmar: o.confirmar || 'OK' });
}
export default avisar;
