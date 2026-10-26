// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL PÚBLICA do site. Necessária para gerar o sitemap e as URLs canônicas.
// Precisa ser a URL real onde o site é servido — o Sitemap: no robots.txt
// e as tags <link rel="canonical"> dependem disto estar correto.
const SITE = 'https://www.tickethubh.com.br';

// Data do build. O site é 100% estático e regenerado a cada deploy, então
// "última geração" ≈ data do build. Vai no <lastmod> do sitemap para o Google
// priorizar o recrawl. (Se um dia houver datas por página — ex.: eventos/posts
// têm dataISO — dá para refinar por rota no serialize abaixo.)
const LASTMOD = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Inlina o CSS no <head> em vez de servir <link> render-blocking. Troca 2
  // requisicoes bloqueantes por alguns KiB de HTML (melhora o first paint/LCP).
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = LASTMOD;
        return item;
      },
    }),
  ],
});
