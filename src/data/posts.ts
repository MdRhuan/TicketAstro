// ─────────────────────────────────────────────────────────────────────────────
// POSTS DO BLOG (conteúdo de exemplo — troca pelos textos reais depois).
// FOTO: public/blog/<slug>.jpg  (sem foto → fallback autoral com a `cor`)
// ─────────────────────────────────────────────────────────────────────────────

export interface Post {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string; // Guia | Cena | Dicas | Bastidores
  autor: string;
  dataISO: string;
  dataLabel: string;
  tempoLeitura: number; // minutos
  imagem: string;
  cor: string;
  destaque?: boolean; // um post em destaque no topo
  corpo: string[]; // parágrafos do artigo (exemplo)
}

const CORPO_EX = [
  'Este é um texto de exemplo para o artigo. Substitua pelo conteúdo real antes de publicar — mantenha os parágrafos curtos e diretos, do jeito que o público de 18 a 25 lê no celular.',
  'Use subtítulos, listas e imagens para quebrar o texto. O importante é que a leitura role fácil e que cada seção entregue uma ideia clara, sem enrolação.',
  'No fim, feche com um convite: qual é o próximo rolê? Aponte para a página de eventos ou para o grupo de ofertas.',
];

export const posts: Post[] = [
  {
    slug: 'guia-roles-bh',
    titulo: 'Guia de rolês em BH: onde a noite acontece',
    resumo:
      'Do centro à Serra, um mapa honesto das casas, galpões e rooftops que movimentam a noite de Belo Horizonte.',
    categoria: 'Guia',
    autor: 'Redação TicketHubh',
    dataISO: '2026-09-12',
    dataLabel: '12 SET 2026',
    tempoLeitura: 6,
    imagem: '/blog/guia-roles-bh.jpg',
    cor: '#2b5cff',
    destaque: true,
    corpo: CORPO_EX,
  },
  {
    slug: 'lote-certo-economizar',
    titulo: 'Comprar no lote certo: como pagar menos no ingresso',
    resumo:
      'Por que o preço sobe a cada lote e como se planejar para nunca pagar o valor cheio de novo.',
    categoria: 'Dicas',
    autor: 'Redação TicketHubh',
    dataISO: '2026-09-05',
    dataLabel: '05 SET 2026',
    tempoLeitura: 4,
    imagem: '/blog/lote-certo-economizar.jpg',
    cor: '#7a3fb0',
    corpo: CORPO_EX,
  },
  {
    slug: 'techno-bh-coletivos',
    titulo: 'Techno em BH: os coletivos que estão mudando a pista',
    resumo:
      'As crews que trouxeram o som de galpão para a cidade e transformaram noites soltas em cena.',
    categoria: 'Cena',
    autor: 'Redação TicketHubh',
    dataISO: '2026-08-28',
    dataLabel: '28 AGO 2026',
    tempoLeitura: 7,
    imagem: '/blog/techno-bh-coletivos.jpg',
    cor: '#0b7285',
    corpo: CORPO_EX,
  },
  {
    slug: 'checklist-open-air',
    titulo: 'Open air sem erro: o que levar (e o que deixar em casa)',
    resumo:
      'Sol, chuva e pista de terra. O checklist rápido para curtir uma festa ao ar livre do começo ao fim.',
    categoria: 'Dicas',
    autor: 'Redação TicketHubh',
    dataISO: '2026-08-20',
    dataLabel: '20 AGO 2026',
    tempoLeitura: 3,
    imagem: '/blog/checklist-open-air.jpg',
    cor: '#c0392b',
    corpo: CORPO_EX,
  },
  {
    slug: 'bastidores-line-up',
    titulo: 'Bastidores: como se monta o line-up de uma festa',
    resumo:
      'Da negociação com o artista ao horário de cada set — o quebra-cabeça que ninguém vê na pista.',
    categoria: 'Bastidores',
    autor: 'Redação TicketHubh',
    dataISO: '2026-08-12',
    dataLabel: '12 AGO 2026',
    tempoLeitura: 8,
    imagem: '/blog/bastidores-line-up.jpg',
    cor: '#1f7a5a',
    corpo: CORPO_EX,
  },
  {
    slug: 'mapa-musical-do-mes',
    titulo: 'Sertanejo, funk e eletrônica: o mapa musical do mês',
    resumo:
      'Os gêneros que dominam a agenda, onde encontrar cada um e para quem é cada pista.',
    categoria: 'Cena',
    autor: 'Redação TicketHubh',
    dataISO: '2026-08-04',
    dataLabel: '04 AGO 2026',
    tempoLeitura: 5,
    imagem: '/blog/mapa-musical-do-mes.jpg',
    cor: '#b5462f',
    corpo: CORPO_EX,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
