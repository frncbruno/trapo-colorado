# Trapo Colorado 🔴⚪

Gerador de "trapos" no estilo das faixas de torcida organizada do Inter — escreva a frase, escolha as cores e a fonte, e gere a imagem pronta pra virar figurinha ou meme.

🔗 **Demo:** [trapo-colorado.vercel.app](https://trapo-colorado.vercel.app/)

## O que dá pra fazer

- Escolher entre 1 e 3 linhas de texto
- Escolher o formato do trapo: quadrado ou retangular
- Escolher a fonte de cada linha (Anton, Bebas Neue, Archivo Black, Permanent Marker, Manrope)
- Escolher a cor de fundo e a cor do texto de cada linha (padrão vermelho/branco)
- Preview ao vivo
- Baixar o resultado em PNG

## Tecnologia

Site estático, sem build e sem backend:

- HTML, CSS e JavaScript puro
- [html2canvas](https://html2canvas.hertzen.com/) (via CDN) para exportar o preview como PNG

## Rodando localmente

```bash
git clone https://github.com/SEU_USUARIO/trapo-colorado.git
cd trapo-colorado
```

Só abrir o `index.html` no navegador já funciona. Se preferir live-reload:

```bash
npx serve
```

## Estrutura

```
trapo-colorado/
├── index.html
├── style.css
├── script.js
└── assets/
    └── escudo-internacional.png   (não incluso no repo — adicione o seu)
```

> O escudo do Internacional não está incluso no repositório por ser marca registrada do clube. Para o brasão aparecer no cabeçalho, adicione seu próprio arquivo de imagem em `assets/escudo-internacional.png`.

## Deploy

Publicado no [Vercel](https://vercel.com) como site estático (Framework Preset: **Other**, sem build command). Qualquer push na branch `main` atualiza o deploy automaticamente.
