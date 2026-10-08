// ─────────────────────────────────────────────────────────────────────────────
// FONTE ÚNICA DE EVENTOS (enriquecida) — usada pela página de detalhe/compra.
//
// Objetivo: substituir aos poucos os arrays duplicados que ainda existem em
//   src/pages/eventos/index.astro, src/components/EventosGrid.astro e
//   src/components/EventosCarousel.astro. Migrar esses 3 para importar daqui.
//
// FOTO do evento:  public/eventos/<slug>.jpg  (sem foto → fallback autoral com a `cor`)
// LINK de compra:  `linkCompra` deve apontar para o parceiro oficial de vendas.
//                  Está com '#' de propósito — troca pelo link real de cada evento.
// ─────────────────────────────────────────────────────────────────────────────

export type EstadoLote = 'a-venda' | 'esgotado' | 'em-breve';

export interface Lote {
  nome: string; // "1º lote", "Lote único", "Última chamada"...
  preco: number; // em R$; inteiro
  estado: EstadoLote;
}

export interface TipoIngresso {
  tipo: string; // "Pista", "VIP", "Camarote", "Mesa (4 lugares)"...
  descricao?: string; // o que está incluído — reduz dúvida antes do clique
  lotes: Lote[];
}

export interface Artista {
  nome: string;
  foto: string; // public/artistas/<arquivo>.jpg  (sem foto → avatar com iniciais)
}

export interface Evento {
  slug: string;
  nome: string;
  categoria: 'Festa' | 'Show';
  estilo: string;
  produtora?: string; // opcional: eventos sem produtora a exibir ficam sem este campo
  local: string;
  cidade: string;
  endereco: string;
  dataISO: string; // "2026-12-13"
  dataLabel: string; // "13 DEZ 2026"
  diaSemana: string; // "Sábado"
  horaAbertura: string; // "22:00"
  classificacao: string; // "18 anos" / "16 anos (menores só com responsável)"
  exclusiva: boolean;
  imagem: string; // capa (card/listagem/social) — public/eventos/<slug>.(jpg|webp)
  imagemHero?: string; // opcional: banner 16/9 do topo da página de detalhe (se vazio, usa `imagem`)
  cor: string;
  descricao: string; // 1–3 parágrafos
  lineup: Artista[]; // atrações / DJs / line-up (com foto)
  ingressos: TipoIngresso[];
  regras: string[]; // políticas: meia, portaria, proibições...
  linkCompra: string; // parceiro oficial (EXTERNO)
  ctaCompra?: string; // opcional: rótulo do botão principal. Padrão: "Comprar ingresso".
  linkCondicoes?: string; // opcional: link específico para "condições especiais".
  //                         Se vazio, usa o WhatsApp do rodapé com mensagem pronta.
  ctaCondicoes?: string; // opcional: rótulo do botão secundário. Padrão: "Condições especiais".
  semCondicoes?: boolean; // opcional: true esconde o botão de condições especiais na página.
  linkGrupo?: string; // opcional: link do grupo de ofertas específico do evento.
  //                     Se vazio, usa GRUPO_OFERTAS (o grupo geral).
  ctaGrupo?: string; // opcional: rótulo do botão do grupo. Padrão: "Grupo de ofertas".
}

// WhatsApp para o botão "Condições especiais" (mesmo número do rodapé).
// Troca aqui, ou define `linkCondicoes` num evento para um link específico.
export const WHATSAPP = '5531983158818';

// Link do grupo de ofertas no WhatsApp (chat.whatsapp.com/...).
// Vale para todos os eventos por padrão.
export const GRUPO_OFERTAS = 'https://chat.whatsapp.com/EGrwvkC1N8WJyfp9Rsb8LM';

export function linkCondicoes(e: Evento): string {
  if (e.linkCondicoes) return e.linkCondicoes;
  const msg = `Olá! Quero saber as condições especiais para o evento "${e.nome}" (${e.dataLabel}).`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export function linkGrupo(e: Evento): string {
  return e.linkGrupo || GRUPO_OFERTAS;
}

// Query pronta para o embed/link do Google Maps
export function mapaQuery(e: Evento): string {
  return encodeURIComponent(`${e.local}, ${e.endereco}, ${e.cidade}`);
}

// Contagem de dias no build (o script no browser recalcula para "hoje")
export function diasFalta(iso: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(iso + 'T00:00:00');
  const diff = Math.ceil((d.getTime() - hoje.getTime()) / 86400000);
  if (diff < 0) return 'Já aconteceu';
  if (diff === 0) return 'É hoje';
  if (diff === 1) return 'Falta 1 dia';
  return `Faltam ${diff} dias`;
}

// Menor preço à venda (para o "a partir de" e o CTA)
export function menorPrecoAVenda(e: Evento): number | null {
  const precos = e.ingressos
    .flatMap((t) => t.lotes)
    .filter((l) => l.estado === 'a-venda')
    .map((l) => l.preco);
  return precos.length ? Math.min(...precos) : null;
}

// Iniciais para o avatar de fallback do artista ("Vintage Culture" → "VC")
export const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export const eventos: Evento[] = [
  {
    slug: 'halloween-do-night',
    nome: 'Halloween do Night',
    categoria: 'Festa',
    estilo: 'Funk',
    // sem produtora a exibir (mesmo padrão dos outros eventos do Night Market)
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-10',
    dataLabel: '10 OUT 2026',
    diaSemana: 'Sábado',
    horaAbertura: '23:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/halloween-do-night.webp',
    imagemHero: '/eventos/halloween-do-night-banner.webp',
    cor: '#d9531e',
    descricao: `🎃 HALLOWEEN DO NIGHT – Apocalipse Zumbi 👻

O rooftop do Night Market vira cenário de apocalipse zumbi.

Venha fantasiado e dispute o Concurso de Melhor Fantasia. Quem roubar a cena leva o destaque da noite.

🍸 Open Bar Premium a noite toda
🏆 Concurso de Melhor Fantasia
🎶 Funk • Eletrônico • MTG • Pop

O Halloween de BH é aqui. 🧟`,
    lineup: [], // sem line-up (a pedido)
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://app.nittio.com.br/event/halloween-do-night-open-bar-premium-E7ENGq/details?coupon=BS',
    ctaCompra: 'Comprar Ingresso Com Desconto',
    semCondicoes: true, // sem botão de condições especiais (a pedido)
  },
  {
    slug: 'saideira',
    nome: 'Saideira',
    categoria: 'Festa',
    estilo: 'Funk',
    // sem produtora a exibir (mesmo padrão do Rio Califórnia)
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-10',
    dataLabel: '10 OUT 2026',
    diaSemana: 'Sábado',
    horaAbertura: '22:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/saideira.webp',
    imagemHero: '/eventos/saideira-banner.webp',
    cor: '#c02a6f',
    descricao: `A noite já começou em algum lugar.
Um jantar, um bar, um esquenta na casa de alguém.

E aí chega aquela hora.
Alguém olha o relógio.
Alguém fala em ir embora.

E outra pessoa responde:
"Só mais uma."

É aí que a noite muda.
Quem ia embora fica.
O grupo se reorganiza.
O som sobe, a cidade brilha lá embaixo, e ninguém lembra mais quem queria ir para casa.

As melhores histórias quase nunca acontecem no plano original.
Elas acontecem na saideira.

No dia seguinte, ninguém lembra a hora em que chegou.
Mas todo mundo lembra quem disse "só mais uma".

Sábado, a saideira é lá em cima.`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2477812/539227?id_promoter=48412',
    ctaCompra: 'Garantir Meu Nome Na Lista',
    linkCondicoes: 'https://wa.link/84f5tn',
    ctaCondicoes: 'Lista Para Consumo',
  },
  {
    slug: 'rio-california',
    nome: 'Rio Califórnia',
    categoria: 'Festa',
    estilo: 'Eletrônica',
    // sem produtora a exibir (a pedido)
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-11',
    dataLabel: '11 OUT 2026',
    diaSemana: 'Domingo',
    horaAbertura: '15:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/rio-california.webp',
    imagemHero: '/eventos/rio-california-banner.webp',
    cor: '#e0592b',
    descricao: `Domingo, 15h.
O sol ainda está alto e a cidade fica lá embaixo.
Você chega sem pressa, com o copo na mão e os amigos por perto.

A eletrônica começa baixinho, quase de fundo.
Ninguém dança ainda. Todo mundo só se acomoda.

A tarde vai passando e o som vai crescendo.
O grave fica mais presente.
A conversa diminui. O corpo começa a se mexer.

Então chega a hora.
O sol desce, a luz fica dourada e, sem ninguém combinar, todo mundo vira para o mesmo lado.

Sunset.`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2477961/539658?id_promoter=12006',
    ctaCompra: 'Garantir Meu Nome Na Lista',
    linkCondicoes: 'https://wa.link/clilcl',
    ctaCondicoes: 'Comemorar Aniversário',
    ctaGrupo: 'Grupo De Ofertas',
  },
  {
    slug: 'no-love',
    nome: 'NO LOVE 💔',
    categoria: 'Festa',
    estilo: 'Funk',
    // sem produtora a exibir (mesmo padrão dos outros eventos do Night Market)
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-16',
    dataLabel: '16 OUT 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '23:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/no-love.webp',
    imagemHero: '/eventos/no-love-banner.webp',
    cor: '#b3122e',
    descricao: `NO LOVE 💔

16/10 é dia de deixar o coração em casa.

O Night Market recebe uma edição especial da NO LOVE, pra quem tá solteiro, desapegado ou só a fim de curtir a noite.

No comando, WS da Igrejinha com aquele repertório que não deixa ninguém parado.

Chega com a galera, brinda com quem você ainda não conhece e volta pra casa com história pra contar.

NO LOVE. Sem promessa, só rolê. 💔`,
    lineup: [{ nome: 'Ws da Igrejinha', foto: '/artistas/ws-da-igrejinha.webp' }],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2478002/539883?id_promoter=22252',
    ctaCompra: 'Garantir Nome Na Lista',
    linkCondicoes: 'https://wa.link/wcqwn2',
    ctaCondicoes: 'R$250 Em Consumo',
  },
];

export const getEvento = (slug: string) => eventos.find((e) => e.slug === slug);
