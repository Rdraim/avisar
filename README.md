<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# avisar

<!-- public-badges:start -->
[![license](assets/support/badge-license.svg)](LICENSE) [![CI](assets/support/badge-ci.svg)](https://github.com/Rdraim/avisar/actions) [![release](assets/support/badge-release.svg)](https://github.com/Rdraim/avisar/releases) [![Git](assets/support/badge-git.svg)](https://github.com/Rdraim/avisar/commits/main)
<!-- public-badges:end -->

## Segurança e compatibilidade

Modal nativo, fila, nomes acessíveis, temas e minimizar/restaurar sem perder campos.

Opções: `titulo`, `texto`, `valor`, `confirmar`, `cancelar`, `perigo`, `tema` (auto/claro/escuro), `minimizar`, `rotuloCampo`, `nonce`, `injetarCSS`. Navegador moderno com dialog.showModal; importação em SSR permitida, interação sem DOM rejeita. Diálogos ficam em fila. Escape/X cancelam, Enter envia o formulário, Tab fica no modal nativo. Minimizar preserva campos e libera a página até restaurar; a Promise continua pendente. Textos usam textContent. Para CSP estrita, forneça nonce ou CSS externo com `injetarCSS: false` (a constante CSS é exportada). Labels podem ser personalizados para inglês. Veja `examples/index.html`.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.2.1) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Substituto acessível de `alert()` / `confirm()` / `prompt()` — em **vanilla JS**,
sem dependência, framework-agnóstico. Retorna **Promise**, prende o foco no
diálogo, fecha no `Esc` e no clique fora, e devolve o foco a quem o abriu.
Tema claro/escuro automático.

## Instalação

```bash
git clone https://github.com/Rdraim/avisar.git
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

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md)


## Uso prático — 1.2.0

As funções aceitam `signal: AbortSignal`. Cancelamento retorna `null` em perguntar, `false` em confirmar e `undefined` em avisar; funciona aberto, minimizado e na fila. Use AbortController na desmontagem de uma página.

---

<p align="center">
  <img src="assets/support/banner-pt-br.svg" width="960" alt="Código aberto. Um café faz diferença. Apoie o trabalho de Rodrigo Rodrigues.">
</p>

## ☕ Me pague um café

Este projeto te ajudou a resolver um problema, aprender algo novo ou dar os primeiros passos no desenvolvimento? Se você sentir vontade de apoiar meu trabalho, um café é uma forma carinhosa de agradecer.

Sou **Rodrigo Rodrigues**, criador do **Nexus** e destes projetos de código aberto. Seu apoio me ajuda a dedicar tempo para melhorar o código, escrever exemplos mais claros e continuar compartilhando o que aprendo.

**Contribua com o valor que fizer sentido para você. O apoio é totalmente voluntário — o projeto continua gratuito sob a licença MIT.**

<p>
  <a href="#apoie-com-pix"><img src="assets/support/pix-pt-br.svg" width="190" height="44" alt="Apoiar com Pix"></a>
  <a href="https://github.com/Rdraim/avisar/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou"><img src="assets/support/comment-pt-br.svg" width="210" height="44" alt="Deixar um comentário"></a>
</p>

### Apoie com Pix

No aplicativo do seu banco, escaneie o QR Code ou copie a chave Pix abaixo. Escolha o valor e confira os dados do destinatário antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Code Pix original fornecido por Rodrigo Rodrigues; a chave em texto abaixo é uma alternativa.">
</p>

**Chave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Você também pode apoiar compartilhando o projeto, relatando um problema, melhorando a documentação ou deixando um comentário.

### Seu comentário também faz diferença

[Conte como o projeto te ajudou](https://github.com/Rdraim/avisar/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou). Vou gostar de saber o que você criou, o que aprendeu e o que poderia ficar mais claro para quem está começando.

O comentário é bem-vindo com ou sem doação. Preserve sua privacidade: não publique comprovantes, dados pessoais, credenciais ou informações de usuários nas Issues.

---

**Obrigado por apoiar meu trabalho e me ajudar a continuar criando e compartilhando. ❤️**
