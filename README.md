# Madeireira Lima — Landing page

Página única, estática (HTML + CSS + JS puro), sem build e sem dependências.

## Como rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Onde alterar os dados da loja

Tudo fica em **`assets/js/config.js`**:

| Campo | O que é |
|---|---|
| `WHATSAPP_NUMBER` | Número só com dígitos: 55 + DDD + número (ex.: `5573991234567`) |
| `WHATSAPP_MESSAGE` | Mensagem que já vem escrita na conversa |
| `whatsapp.display` | Como o número aparece na página |
| `address` | Rua, bairro, cidade, UF, CEP |
| `map.lat` / `map.lng` | Coordenadas da loja (sem elas, o mapa mostra o centro da cidade) |
| `hours` | Horários (também controlam o selo "Aberto agora / Fechado agora") |
| `social.instagram` | Link (ou usuário) do Instagram — aparece no topo, no contato, no convite final e no rodapé. Deixe `""` para esconder |
| `social.facebook` | Link do Facebook — aparece como ícone no rodapé quando preenchido |

Os itens marcados com `⚠️ PLACEHOLDER` ainda são provisórios. Enquanto houver dados
provisórios, o console do navegador mostra um aviso listando o que falta.

Textos fixos de SEO (`<title>`, `meta description`, Open Graph) ficam no `<head>` do
`index.html`. Quando o site tiver domínio, troque `og:image` por uma URL absoluta.

## Estrutura

```
index.html
assets/
  css/styles.css    estilos (cores em variáveis no topo)
  js/config.js      DADOS DA LOJA
  js/main.js        preenche a página e cuida das animações
  img/              imagens otimizadas (WebP), favicon, imagem de compartilhamento
```

## Logo

- `assets/img/logo.webp` — usada no cabeçalho e no rodapé (sobre uma plaquinha clara).
- `assets/img/logo-original.png` — logo com fundo transparente, tamanho completo.
- `assets/img/favicon.png` e `apple-touch-icon.png` — ícones da aba e do atalho no celular.

A logo atual foi recortada de uma captura de tela. Quando tiver o arquivo original
(PNG com fundo transparente ou SVG), substitua esses arquivos mantendo os nomes.

## Trocar as fotos

Substitua `assets/img/hero-*.webp` (topo) e `assets/img/cta-*.webp` (faixa final),
mantendo os nomes, em duas larguras: 800px e 1600px. Fotos atuais: Unsplash (licença
gratuita), provisórias até haver fotos reais da loja.
