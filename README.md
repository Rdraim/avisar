# avisar

Substituto acessível de `alert()` / `confirm()` / `prompt()` — em **vanilla JS**,
sem dependência, framework-agnóstico. Retorna **Promise**, prende o foco no
diálogo, fecha no `Esc` e no clique fora, e devolve o foco a quem o abriu.
Tema claro/escuro automático.

## Instalação

```bash
npm install avisar
```

## Uso

```js
import { avisar, confirmar, perguntar } from 'avisar';

await avisar('Documento salvo.');

if (await confirmar({ titulo: 'Excluir?', texto: 'Esta ação não pode ser desfeita.', confirmar: 'Excluir', perigo: true })) {
  // ...
}

const nome = await perguntar({ titulo: 'Novo projeto', texto: 'Nome:' });
if (nome !== null) criar(nome);
```

Também aceita string direta:

```js
if (await confirmar('Tem certeza?')) salvar();
```

## API

| função | retorno | opções |
|---|---|---|
| `avisar(texto, o?)` | `Promise<void>` | `titulo`, `confirmar` |
| `confirmar(texto\|o)` | `Promise<boolean>` | `titulo`, `texto`, `confirmar`, `cancelar`, `perigo` |
| `perguntar(texto\|o)` | `Promise<string\|null>` | `titulo`, `texto`, `valor`, `confirmar`, `cancelar` |

## Acessibilidade

- `role="dialog"` + `aria-modal="true"`.
- Foco vai para o campo/botão ao abrir; **foco preso** (Tab/Shift+Tab circulam).
- `Esc` cancela, `Enter` confirma, clique no fundo cancela.
- Foco restaurado ao elemento anterior ao fechar.

## Por quê

`alert/confirm/prompt` nativos travam a thread, não dá para estilizar e somem no
modo "não mostrar mais diálogos" do navegador. `avisar` resolve isso com uma API
assíncrona e um diálogo que você controla — sem trazer um framework de UI junto.

## Licença

MIT © Rodrigo Rodrigues
