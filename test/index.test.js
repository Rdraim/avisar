import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avisar, confirmar, perguntar } from '../src/index.js';
test('importação SSR é permitida; interação exige DOM e rejeita claramente', async () => {
  for (const fn of [avisar, confirmar, perguntar]) await assert.rejects(fn('fixture'), /navegador com DOM/);
});
test('AbortSignal já cancelado não abre DOM nem deixa chamada pendente', async () => {
  const signal = AbortSignal.abort();
  assert.equal(await confirmar({ signal }), false);
  assert.equal(await perguntar({ signal }), null);
  assert.equal(await avisar('demo', { signal }), undefined);
});
