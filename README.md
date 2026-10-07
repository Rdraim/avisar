# avisar

[English (United States)](README.en-US.md) · [Apoio voluntário](SUPPORT.md)

## Revisão 1.1.0

Modal nativo, fila, nomes acessíveis, temas e minimizar/restaurar sem perder campos.

Opções: `titulo`, `texto`, `valor`, `confirmar`, `cancelar`, `perigo`, `tema` (auto/claro/escuro), `minimizar`, `rotuloCampo`, `nonce`, `injetarCSS`. Navegador moderno com dialog.showModal; importação em SSR permitida, interação sem DOM rejeita. Diálogos ficam em fila. Escape/X cancelam, Enter envia o formulário, Tab fica no modal nativo. Minimizar preserva campos e libera a página até restaurar; a Promise continua pendente. Textos usam textContent. Para CSP estrita, forneça nonce ou CSS externo com `injetarCSS: false` (a constante CSS é exportada). Labels podem ser personalizados para inglês. Veja `examples/index.html`.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.1.0) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Substituto acessível de `alert()` / `confirm()` / `prompt()` — em **vanilla JS**,
sem dependência, framework-agnóstico. Retorna **Promise**, prende o foco no
diálogo, fecha no `Esc` e no clique fora, e devolve o foco a quem o abriu.
Tema claro/escuro automático.

## Instalação

```bash
git clone https://github.com/techrodrigo21-ux/avisar.git
cd avisar
npm test
```

## Uso

```js
import { avisar, confirmar, perguntar } from './src/index.js';

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

## Manutenção e apoio

Código independente inspirado em problemas resolvidos no Nexus, projeto de Rodrigo Rodrigues. Não inclui banco, configuração privada, logs, dados de usuários ou credenciais. Evolução coordenada significa revisar mudanças relacionadas no mesmo ciclo; não há cópia automática de arquivos privados.

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md) · [Apoio voluntário](SUPPORT.md)
