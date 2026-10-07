/* ============================================================================
   avisar — substituto de alert()/confirm()/prompt() em diálogo acessível.

   Vanilla JS, sem dependência, framework-agnóstico. Retorna Promise, prende o
   foco no diálogo (Tab/Shift+Tab não escapam), fecha no Esc e no clique fora,
   e devolve o foco ao elemento que estava ativo. Injeta o CSS uma vez.

   avisar(msg)        -> Promise<void>
   confirmar(opcoes)  -> Promise<boolean>
   perguntar(opcoes)  -> Promise<string|null>
   ============================================================================ */

const CSS = `
.avisar-fundo{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px}
.avisar-caixa{background:#fff;color:#111;max-width:420px;width:100%;border-radius:12px;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:15px/1.5 system-ui,sans-serif}
.avisar-caixa h2{margin:0 0 8px;font-size:17px}
.avisar-caixa p{margin:0 0 14px;white-space:pre-wrap;overflow-wrap:anywhere}
.avisar-caixa input{width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;margin-bottom:14px;font:inherit}
.avisar-acoes{display:flex;gap:8px;justify-content:flex-end}
.avisar-btn{padding:9px 16px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;cursor:pointer;font:inherit}
.avisar-btn.ok{background:#2563eb;border-color:#2563eb;color:#fff}
.avisar-btn.perigo{background:#dc2626;border-color:#dc2626;color:#fff}
@media (prefers-color-scheme:dark){.avisar-caixa{background:#1e293b;color:#e2e8f0}.avisar-caixa input{background:#0f172a;border-color:#334155;color:inherit}.avisar-btn{background:#334155;border-color:#475569;color:#e2e8f0}}`;

let cssPronto = false;
function garantirCSS() {
  if (cssPronto || typeof document === 'undefined') return;
  const st = document.createElement('style');
  st.setAttribute('data-avisar', '');
  st.textContent = CSS;
  document.head.appendChild(st);
  cssPronto = true;
}

function abrir({ titulo, texto, campo, confirmar: rotuloOk = 'OK', cancelar = null, perigo = false, valor = '' }) {
  garantirCSS();
  const anterior = document.activeElement;
  const fundo = document.createElement('div');
  fundo.className = 'avisar-fundo';
  fundo.setAttribute('role', 'dialog');
  fundo.setAttribute('aria-modal', 'true');

  const caixa = document.createElement('div');
  caixa.className = 'avisar-caixa';
  caixa.innerHTML =
    (titulo ? `<h2></h2>` : '') +
    `<p></p>` +
    (campo ? `<input type="text">` : '') +
    `<div class="avisar-acoes">${cancelar ? `<button class="avisar-btn" data-ac="cancelar"></button>` : ''}<button class="avisar-btn ${perigo ? 'perigo' : 'ok'}" data-ac="ok"></button></div>`;
  fundo.appendChild(caixa);

  if (titulo) caixa.querySelector('h2').textContent = titulo;
  caixa.querySelector('p').textContent = texto ?? '';
  const input = campo ? caixa.querySelector('input') : null;
  if (input) input.value = valor;
  const btnOk = caixa.querySelector('[data-ac="ok"]'); btnOk.textContent = rotuloOk;
  const btnCancelar = caixa.querySelector('[data-ac="cancelar"]');
  if (btnCancelar) btnCancelar.textContent = cancelar;

  document.body.appendChild(fundo);
  (input || btnOk).focus();

  return new Promise((resolve) => {
    const fechar = (res) => {
      document.removeEventListener('keydown', aoTeclar, true);
      fundo.remove();
      if (anterior && anterior.focus) anterior.focus();
      resolve(res);
    };
    const focaveis = () => [...caixa.querySelectorAll('button, input, [tabindex]')].filter((e) => !e.disabled);
    const aoTeclar = (ev) => {
      if (ev.key === 'Escape' && btnCancelar) { ev.preventDefault(); fechar(null); }
      else if (ev.key === 'Enter' && (!input || document.activeElement !== btnCancelar)) { ev.preventDefault(); fechar(input ? input.value : true); }
      else if (ev.key === 'Tab') {
        const f = focaveis(); if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        let j = ev.shiftKey ? i - 1 : i + 1;
        if (j < 0) j = f.length - 1; if (j >= f.length) j = 0;
        ev.preventDefault(); f[j].focus();
      }
    };
    document.addEventListener('keydown', aoTeclar, true);
    fundo.addEventListener('mousedown', (ev) => { if (ev.target === fundo && btnCancelar) fechar(null); });
    btnOk.addEventListener('click', () => fechar(input ? input.value : true));
    if (btnCancelar) btnCancelar.addEventListener('click', () => fechar(null));
  });
}

/** Aviso simples (um botão). Resolve quando fecha. */
export function avisar(texto, opcoes = {}) {
  return abrir({ texto, titulo: opcoes.titulo, confirmar: opcoes.confirmar || 'OK' }).then(() => undefined);
}

/** Confirmação (OK/Cancelar). Resolve true/false. */
export function confirmar(opcoes = {}) {
  const o = typeof opcoes === 'string' ? { texto: opcoes } : opcoes;
  return abrir({ ...o, cancelar: o.cancelar || 'Cancelar', confirmar: o.confirmar || 'Confirmar' }).then((r) => r === true);
}

/** Pergunta com campo de texto. Resolve a string ou null (cancelado). */
export function perguntar(opcoes = {}) {
  const o = typeof opcoes === 'string' ? { texto: opcoes } : opcoes;
  return abrir({ ...o, campo: true, cancelar: o.cancelar || 'Cancelar', confirmar: o.confirmar || 'OK' });
}

export default avisar;
