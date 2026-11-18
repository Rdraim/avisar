import { test } from 'node:test';
import assert from 'node:assert/strict';

// DOM mínimo e sintético: só o que o diálogo usa (sem dependências).
class Elemento {
  constructor(tag) {
    this.tagName = tag.toUpperCase(); this.filhos = []; this.pai = null; this.ouvintes = {};
    this.dataset = {}; this.atributos = {}; this.textContent = ''; this.className = ''; this.open = false;
  }
  append(...filhos) { for (const f of filhos) { f.remove(); f.pai = this; this.filhos.push(f); } }
  remove() { if (this.pai) { this.pai.filhos = this.pai.filhos.filter((f) => f !== this); this.pai = null; } }
  get isConnected() { let p = this; while (p.pai) p = p.pai; return p === raiz; }
  setAttribute(k, v) { this.atributos[k] = String(v); }
  addEventListener(tipo, fn) { (this.ouvintes[tipo] ||= []).push(fn); }
  removeEventListener(tipo, fn) { this.ouvintes[tipo] = (this.ouvintes[tipo] || []).filter((f) => f !== fn); }
  disparar(tipo, extra = {}) {
    const ev = { type: tipo, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extra };
    for (const fn of [...(this.ouvintes[tipo] || [])]) fn(ev);
    return ev;
  }
  focus() { globalThis.document.activeElement = this; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  getBoundingClientRect() { return { left: 100, right: 500, top: 100, bottom: 400 }; }
  *descendentes() { for (const f of this.filhos) { yield f; yield* f.descendentes(); } }
}
const raiz = new Elemento('html');
const head = new Elemento('head');
const body = new Elemento('body');
raiz.append(head, body);
globalThis.document = {
  head, body, activeElement: body,
  createElement: (tag) => new Elemento(tag),
  querySelector: (sel) => (sel === 'style[data-avisar]' ? head.filhos.find((f) => f.tagName === 'STYLE' && 'avisar' in f.dataset) || null : null),
};

const { confirmar, perguntar } = await import('../src/index.js');

async function dialogoAberto() {
  for (let i = 0; i < 50; i++) {
    const d = body.filhos.find((f) => f.tagName === 'DIALOG' && f.open);
    if (d) return d;
    await new Promise((r) => setImmediate(r));
  }
  throw new Error('diálogo não abriu');
}
const achar = (d, pred) => [...d.descendentes()].find(pred);
const caminhos = {
  cancelar: (d) => achar(d, (e) => e.tagName === 'BUTTON' && e.className === 'avisar-btn').disparar('click'),
  esc: (d) => d.disparar('cancel'),
  x: (d) => achar(d, (e) => e.className === 'avisar-icone fechar').disparar('click'),
  fora: (d) => d.disparar('click', { clientX: 10, clientY: 10 }),
  confirmar: (d) => achar(d, (e) => e.tagName === 'FORM').disparar('submit'),
};
async function responder(opcoes, caminho) {
  const p = confirmar(opcoes);
  const d = await dialogoAberto();
  caminhos[caminho](d);
  const r = await p;
  assert.equal(body.filhos.includes(d), false, 'diálogo removido ao fechar');
  return r;
}

test('padrão compatível: Cancelar, Esc, X e clique fora devolvem false; confirmar devolve true', async () => {
  for (const caminho of ['cancelar', 'esc', 'x', 'fora']) assert.equal(await responder({ texto: 'fixture' }, caminho), false, caminho);
  assert.equal(await responder('fixture', 'esc'), false, 'forma string');
  assert.equal(await responder({ texto: 'fixture' }, 'confirmar'), true);
  assert.equal(await responder({ texto: 'fixture', aoFechar: undefined }, 'x'), false, 'undefined usa o padrão');
});

test('aoFechar: null distingue dispensar (Esc, X, fora) da resposta Cancelar', async () => {
  for (const caminho of ['esc', 'x', 'fora']) assert.equal(await responder({ texto: 'fixture', aoFechar: null }, caminho), null, caminho);
  assert.equal(await responder({ texto: 'fixture', aoFechar: null }, 'cancelar'), false);
  assert.equal(await responder({ texto: 'fixture', aoFechar: null }, 'confirmar'), true);
});

test('clique dentro da caixa não fecha', async () => {
  const p = confirmar({ texto: 'fixture', aoFechar: null });
  const d = await dialogoAberto();
  d.disparar('click', { clientX: 200, clientY: 200 });
  assert.equal(d.open, true);
  caminhos.cancelar(d);
  assert.equal(await p, false);
});

test('AbortSignal resolve com aoFechar (padrão false): já cancelado, aberto, minimizado e na fila', async () => {
  assert.equal(await confirmar({ signal: AbortSignal.abort() }), false);
  assert.equal(await confirmar({ signal: AbortSignal.abort(), aoFechar: null }), null);

  for (const [opcoes, esperado] of [[{}, false], [{ aoFechar: null }, null]]) {
    const aberto = new AbortController();
    const p = confirmar({ texto: 'fixture', signal: aberto.signal, ...opcoes });
    const d = await dialogoAberto();
    aberto.abort();
    assert.equal(await p, esperado, 'aberto');
    assert.equal(body.filhos.includes(d), false);
  }

  const minimizado = new AbortController();
  const pm = confirmar({ texto: 'fixture', signal: minimizado.signal, aoFechar: null });
  const dm = await dialogoAberto();
  achar(dm, (e) => e.className === 'avisar-icone' && e.textContent === '_').disparar('click');
  assert.equal(dm.open, false);
  minimizado.abort();
  assert.equal(await pm, null, 'minimizado');
  assert.equal(body.filhos.some((f) => f.className === 'avisar-restaurar'), false);

  const naFila = new AbortController();
  const primeiro = confirmar({ texto: 'primeiro' });
  const segundo = confirmar({ texto: 'segundo', signal: naFila.signal, aoFechar: null });
  const d1 = await dialogoAberto();
  naFila.abort();
  assert.equal(await segundo, null, 'na fila');
  caminhos.confirmar(d1);
  assert.equal(await primeiro, true);
});

test('perguntar não muda: Cancelar, Esc e X devolvem null mesmo com aoFechar', async () => {
  for (const caminho of ['cancelar', 'esc', 'x']) {
    const p = perguntar({ texto: 'fixture', aoFechar: false });
    const d = await dialogoAberto();
    caminhos[caminho](d);
    assert.equal(await p, null, caminho);
  }
});
