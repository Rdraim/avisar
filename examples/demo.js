import { avisar, confirmar, perguntar } from '../src/index.js';
const tema = document.querySelector('#tema');
const resultado = document.querySelector('#resultado');
const o = () => ({ tema: tema.value, titulo: 'Exemplo / Example' });
tema.onchange = () => { document.body.className = tema.value; };
document.querySelector('#aviso').onclick = async () => { await avisar('Operação de exemplo concluída.\nExample operation complete.', o()); resultado.textContent = 'Aviso fechado / Alert closed'; };
document.querySelector('#confirma').onclick = async () => { resultado.textContent = String(await confirmar({ ...o(), texto: 'Continuar / Continue?', confirmar: 'Continuar / Continue', cancelar: 'Cancelar / Cancel' })); };
document.querySelector('#pergunta').onclick = async () => { resultado.textContent = String(await perguntar({ ...o(), texto: 'Nome de exemplo / Example name', valor: 'exemplo', rotuloCampo: 'Nome / Name' })); };
document.querySelector('#fila').onclick = async () => {
  const a = avisar('Primeiro / First', o()); const b = avisar('Segundo / Second', o());
  await Promise.all([a, b]); resultado.textContent = 'Fila concluída / Queue completed';
};
document.querySelector('#testes').onclick = async () => {
  const reports = [];
  const check = (ok, msg) => { if (!ok) throw new Error(msg); reports.push('PASS ' + msg); };
  const render = () => new Promise((resolve) => setTimeout(resolve, 0));
  try {
    const opener = document.querySelector('#testes'); opener.focus();
    const p = perguntar({ ...o(), texto: '<img src=x onerror=alert(1)>', valor: 'synthetic' });
    await render();
    const d = document.querySelector('dialog');
    check(d.open && !d.querySelector('img'), 'Modal aberto e texto sem HTML / Safe text');
    const input = d.querySelector('input'); input.value = 'preserved';
    d.querySelector('[aria-label="Minimizar / Minimize"]').click();
    check(!d.open && input.value === 'preserved', 'Minimizar preserva campo / Minimize preserves input');
    document.querySelector('.avisar-restaurar').click();
    check(d.open && input.value === 'preserved', 'Restaurar preserva campo / Restore preserves input');
    d.querySelector('form').requestSubmit();
    check(await p === 'preserved' && document.activeElement === opener, 'Valor e foco restaurados / Value and focus restored');
    const a = confirmar('first'); const b = confirmar('second'); await render();
    check(document.querySelectorAll('dialog[open]').length === 1, 'Fila com um modal / Single modal queue');
    document.querySelector('dialog .fechar').click(); check(await a === false, 'X cancela / Close cancels');
    await render(); document.querySelector('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));
    check(await b === false, 'Cancelamento nativo / Native cancel');
    check(!document.querySelector('dialog'), 'Sem modal restante / Cleanup');
    const ativo = new AbortController();
    const cancelavel = perguntar({ ...o(), signal: ativo.signal, valor: 'preserved' }); await render();
    document.querySelector('dialog [aria-label="Minimizar / Minimize"]').click();
    ativo.abort();
    check(await cancelavel === null && !document.querySelector('.avisar-restaurar') && !document.querySelector('dialog'), 'Abort minimizado limpa DOM / Abort minimized cleans DOM');
    const primeiro = confirmar('keep open'); await render();
    const emFila = new AbortController();
    const segundo = perguntar({ signal: emFila.signal }); emFila.abort();
    check(await segundo === null && document.querySelector('dialog').open, 'Abort na fila é imediato / Queued abort is immediate');
    document.querySelector('dialog .fechar').click(); await primeiro; await render();
    check(!document.querySelector('dialog'), 'Fila cancelada não abre depois / Aborted queue does not reopen');
    resultado.textContent = reports.join('\n');
  } catch (e) { resultado.textContent = reports.join('\n') + '\nFAIL ' + e.message; }
};
// The chart sibling is optional: this demo still works if avisar is cloned alone.
try {
  const { rosca } = await import('../../graficos-svg/src/index.js');
  document.querySelector('#grafico').innerHTML = rosca([{ rotulo: 'Example A', valor: 10 }, { rotulo: 'Example B', valor: 20 }], { titulo: 'Distribuição / Distribution', descricao: 'Example A: 10; Example B: 20' });
} catch { document.querySelector('#grafico').textContent = 'Clone graficos-svg beside avisar to display the optional chart.'; }
