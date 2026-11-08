// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL PÚBLICA do site. Necessária para gerar o sitemap e as URLs canônicas.
// Precisa ser a URL real onde o site é servido — o Sitemap: no robots.txt
// e as tags <link rel="canonical"> dependem disto estar correto.
//
// Domínio canônico DEFINITIVO: SEM www. O www redireciona para cá (config da
// Vercel/DNS). Se isto voltar para www, o sitemap e todas as canonical passam
// a apontar para um host que só redireciona — foi o que quebrou a indexação.
const SITE = 'https://tickethubh.com.br';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Inlina o CSS no <head> em vez de servir <link> render-blocking. Troca 2
  // requisicoes bloqueantes por alguns KiB de HTML (melhora o first paint/LCP).
  build: { inlineStylesheets: 'always' },
  integrations: [
    // Sem `serialize` com lastmod: não há fonte confiável de "data de alteração"
    // por página (eventos/produtoras não têm; posts só têm data de publicação).
    // Carimbar a data do build em tudo a cada deploy era sinal falso para o Google
    // ("tudo mudou hoje"). Melhor não declarar lastmod do que declarar errado.
    sitemap(),
  ],
});
