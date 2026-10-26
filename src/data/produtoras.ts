// ─────────────────────────────────────────────────────────────────────────────
// PRODUTORAS (páginas /produtoras/[slug]).
//
// Duas camadas (ver auditoria-seo/02-planos-de-acao/estrategia-produtoras.md):
//   • Camada A — PERFIL evergreen: escrito 1 vez (perfil, bairros, @ oficial).
//   • Camada B — EVENTOS: montados sozinhos a partir de `eventos.ts` (os que
//     têm `produtora === nome`), já expirando sozinhos. Zero manutenção.
//
// TRAVA ANTI-CONTEÚDO-FINO: uma produtora só vai ao ar quando `publicar: true`
// E tiver `instagram` real E `perfil` substancial (ver `produtorasPublicadas`).
// Enquanto faltar o @ real, NÃO publica — é a regra do plano ("nada inventado").
//
// Só está transcrito aqui o que foi VERIFICADO em fonte pública (out/2026).
// O que depende de você está vazio de propósito: estilo, @ Instagram, bairros.
// ─────────────────────────────────────────────────────────────────────────────

import { eventosFuturos, type Evento } from './eventos';

export interface Produtora {
  slug: string;
  nome: string; // deve bater com `evento.produtora` para a Camada B se auto-listar
  cidade: string; // base de atuação (quase sempre "Belo Horizonte")
  resumo: string; // meta description (~150 car.)
  perfil: string[]; // parágrafos verificados do perfil (Camada A)
  estilo?: string; // estilo/gênero musical — PREENCHER (você)
  bairros: string[]; // bairros reais de atuação (sinal local; nunca inventar)
  instagram?: string; // URL do Instagram oficial — PREENCHER (obrigatório p/ publicar)
  sympla?: string; // URL do perfil na Sympla (se houver)
  site?: string; // site oficial (se houver)
  cor?: string; // cor de marca: fundo do bloco de logo e do fallback (escolha de UI, não dado oficial)
  foto?: string; // logo em public/produtoras/<slug>.webp (sem arquivo → iniciais na cor)
  nota?: string; // observação interna (não vai ao ar), ex.: exceção de escopo
  publicar: boolean; // trava manual: só true quando o perfil estiver completo
}

// Conteúdo VERIFICADO dos rascunhos. Todas com `publicar: false` até você
// confirmar as lacunas (@ Instagram, estilo e, onde faltar, bairros).
export const produtoras: Produtora[] = [
  {
    slug: 'nasala',
    nome: 'naSala',
    cidade: 'Belo Horizonte',
    resumo:
      'Agenda da naSala em Belo Horizonte: próximas festas, local e link oficial de ingresso.',
    perfil: [
      'A naSala é uma das produtoras mais tradicionais da noite de Belo Horizonte, com cerca de 24 anos fazendo festa na cidade.',
    ],
    bairros: [],
    sympla: 'https://www.sympla.com.br/produtor/nasala',
    publicar: false,
  },
  {
    slug: 'chale',
    nome: 'Chalé',
    cidade: 'Belo Horizonte',
    resumo:
      'Agenda do Chalé em Belo Horizonte: próximas festas no Clube Chalezinho e link oficial de ingresso.',
    perfil: [
      'O Chalé é uma marca consolidada da noite de BH, sediada no Clube Chalezinho (Quintal do Chalé), no bairro Estoril.',
      'Entre as festas-marca estão a Carna Chalé, no Carnaval, e as edições de aniversário da casa, como a "Chalé 16 anos".',
    ],
    bairros: ['Estoril'],
    publicar: false,
  },
  {
    slug: 'raro',
    nome: 'Raro',
    cidade: 'Belo Horizonte',
    resumo:
      'Agenda do Raro em Belo Horizonte: as próximas festas temáticas e o link oficial de ingresso.',
    perfil: [
      'O Raro é um selo de festas temáticas de Belo Horizonte, conhecido por edições com atrações nacionais de peso, como o Baile do Raro (com Ludmilla), a Junina do Raro (com Pedro Sampaio) e o Raroween (edição de Halloween).',
    ],
    bairros: [],
    publicar: false,
  },
  {
    slug: '2liv',
    nome: '2Liv',
    cidade: 'Belo Horizonte',
    resumo:
      'Agenda da 2Liv em Belo Horizonte: próximos shows e festas, com link oficial de ingresso.',
    perfil: [
      'A 2Liv é uma produtora de shows e festivais com atrações nacionais, em atividade desde 2019. Entre as edições recentes em BH está "A Halloween Story", com Cat Dealers.',
    ],
    bairros: [],
    site: 'https://2liv.com.br',
    sympla: 'https://www.sympla.com.br/produtor/2liv',
    nota: 'Atua em várias cidades. Esta página lista só os eventos de BH.',
    publicar: false,
  },
  {
    slug: 'club-415',
    nome: 'Club 415',
    cidade: 'Nova Lima',
    resumo:
      'Agenda do Club 415 (Nova Lima, Grande BH): próximas festas de música eletrônica e link oficial.',
    perfil: [
      'O Club 415 é um clube dedicado à música eletrônica, no Jardim Canadá, em Nova Lima (Grande BH). Recebe nomes internacionais e nacionais da cena, como ARTBAT, elrow e Dubdogz, além de edições fixas como o Réveillon 415.',
    ],
    estilo: 'Música eletrônica',
    bairros: ['Jardim Canadá'],
    instagram: 'https://www.instagram.com/club_415/',
    sympla: 'https://www.sympla.com.br/produtor/club415',
    cor: '#101217',
    foto: '/produtoras/club-415.webp',
    nota: 'Exceção de escopo: fica em Nova Lima, não em BH. Só publicar após ajustar o posicionamento do site de "só BH" para "BH e região".',
    publicar: true, // PROTÓTIPO: única produtora com perfil completo verificado. Rever antes de produção (ver nota Nova Lima).
  },
];

// Eventos futuros desta produtora (Camada B). Usa `eventosFuturos` (já expira
// sozinho) e casa pelo nome exato de `evento.produtora`.
export function eventosDaProdutora(nome: string): Evento[] {
  return eventosFuturos
    .filter((e) => e.produtora === nome)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO));
}

// Guardrail: só publica quem tem a trava ligada E @ real E perfil substancial.
// Com todas em `publicar: false`, isto é uma lista vazia — nada fino vai ao ar.
export const produtorasPublicadas = produtoras.filter(
  (p) => p.publicar && !!p.instagram && p.perfil.length > 0,
);

export const getProdutora = (slug: string) => produtoras.find((p) => p.slug === slug);
