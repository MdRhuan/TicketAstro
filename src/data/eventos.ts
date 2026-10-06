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

Sábado, a saideira é lá em cima.

Seu domingo merece terminar lá em cima.`,
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
    linkCompra: 'https://listario-sigma.vercel.app',
    ctaCompra: 'Garantir Meu Nome Na Lista',
    linkCondicoes: 'https://wa.link/clilcl',
    ctaCondicoes: 'Comemorar Aniversário',
    ctaGrupo: 'Grupo De Ofertas',
  },
  {
    slug: 'festa-neon',
    nome: 'Festa Neon',
    categoria: 'Festa',
    estilo: 'Eletrônica',
    produtora: 'Neon Produções',
    local: 'Clube da Serra',
    cidade: 'Belo Horizonte',
    endereco: 'Av. Bandeirantes, 1200 | Mangabeiras',
    dataISO: '2026-12-13',
    dataLabel: '13 DEZ 2026',
    diaSemana: 'Sábado',
    horaAbertura: '22:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/festa-neon.jpg',
    cor: '#2b5cff',
    descricao:
      'Uma noite inteira de eletrônica com estrutura de som e luz montada especialmente para a pista principal. Três ambientes, open de água até meia-noite e projeções mapeadas nas paredes do Clube da Serra.',
    lineup: [
      { nome: 'Vintage Culture', foto: '/artistas/vintage-culture.jpg' },
      { nome: 'Ana Santtana', foto: '/artistas/ana-santtana.jpg' },
      { nome: 'Marco Lys', foto: '/artistas/marco-lys.jpg' },
      { nome: 'Residentes Neon', foto: '/artistas/residentes-neon.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso à pista principal e aos dois ambientes secundários.',
        lotes: [
          { nome: '1º lote', preco: 70, estado: 'esgotado' },
          { nome: '2º lote', preco: 90, estado: 'a-venda' },
          { nome: '3º lote', preco: 120, estado: 'em-breve' },
        ],
      },
      {
        tipo: 'VIP',
        descricao: 'Área elevada com vista para o palco, bar exclusivo e acesso rápido.',
        lotes: [
          { nome: 'Lote único', preco: 180, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
      'Proibida a entrada com bebidas ou objetos cortantes.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'sunset-club',
    nome: 'Sunset Club | Rooftop',
    categoria: 'Festa',
    estilo: 'House',
    produtora: 'Neon Produções',
    local: 'Terraço 22',
    cidade: 'Belo Horizonte',
    endereco: 'Rua dos Aimorés, 22 | Funcionários (cobertura)',
    dataISO: '2026-11-15',
    dataLabel: '15 NOV 2026',
    diaSemana: 'Domingo',
    horaAbertura: '16:00',
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/sunset-club.jpg',
    cor: '#7a3fb0',
    descricao:
      'House e disco no melhor pôr do sol da cidade. Festa de fim de tarde numa cobertura aberta, com bar de drinks autorais e set contínuo até a noite.',
    lineup: [
      { nome: 'Sabrina Terence', foto: '/artistas/sabrina-terence.jpg' },
      { nome: 'Duo Rooftop', foto: '/artistas/duo-rooftop.jpg' },
      { nome: 'Convidado surpresa', foto: '/artistas/convidado-surpresa.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso ao rooftop e à pista.',
        lotes: [
          { nome: '1º lote', preco: 60, estado: 'a-venda' },
          { nome: '2º lote', preco: 80, estado: 'em-breve' },
        ],
      },
      {
        tipo: 'Lounge',
        descricao: 'Sofá reservado por até 4 pessoas, com serviço na mesa.',
        lotes: [
          { nome: 'Lote único', preco: 140, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Evento ao ar livre | sujeito às condições do tempo.',
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'noite-eletronica',
    nome: 'Noite Eletrônica | Warehouse',
    categoria: 'Festa',
    estilo: 'Techno',
    produtora: 'Neon Produções',
    local: 'Galpão 7',
    cidade: 'Belo Horizonte',
    endereco: 'Rua da Bahia, 700 | Lourdes',
    dataISO: '2026-11-28',
    dataLabel: '28 NOV 2026',
    diaSemana: 'Sábado',
    horaAbertura: '23:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/noite-eletronica.jpg',
    cor: '#0b7285',
    descricao:
      'Techno em formato warehouse: um galpão, um sistema de som Void e um line-up que segura a pista até o amanhecer.',
    lineup: [
      { nome: 'ANNA', foto: '/artistas/anna.jpg' },
      { nome: 'Kolombo', foto: '/artistas/kolombo.jpg' },
      { nome: 'Residentes Warehouse', foto: '/artistas/residentes-warehouse.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso ao galpão e à pista principal.',
        lotes: [
          { nome: '1º lote', preco: 120, estado: 'esgotado' },
          { nome: '2º lote', preco: 150, estado: 'a-venda' },
        ],
      },
      {
        tipo: 'Backstage',
        descricao: 'Área reservada próxima à cabine, com bar exclusivo.',
        lotes: [
          { nome: 'Lote único', preco: 260, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
      'Sem reentrada após a saída.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'baile-do-mercado',
    nome: 'Baile do Mercado',
    categoria: 'Festa',
    estilo: 'Funk',
    produtora: 'Baile Coletivo',
    local: 'Mercado Central',
    cidade: 'Belo Horizonte',
    endereco: 'Av. Augusto de Lima, 744 | Centro',
    dataISO: '2026-12-06',
    dataLabel: '06 DEZ 2026',
    diaSemana: 'Domingo',
    horaAbertura: '18:00',
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/baile-do-mercado.jpg',
    cor: '#c0392b',
    descricao:
      'O baile de funk que tomou conta do centro. DJs da cena local, MC convidado e a pista mais quente de BH num domingo à tarde.',
    lineup: [
      { nome: 'DJ Batata', foto: '/artistas/dj-batata.jpg' },
      { nome: 'MC Larissa', foto: '/artistas/mc-larissa.jpg' },
      { nome: 'Coletivo Baile', foto: '/artistas/coletivo-baile.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso à pista.',
        lotes: [
          { nome: '1º lote', preco: 40, estado: 'a-venda' },
          { nome: '2º lote', preco: 55, estado: 'em-breve' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'rock-nacional',
    nome: 'Rock Nacional ao Vivo',
    categoria: 'Show',
    estilo: 'Rock',
    produtora: 'Palco BR',
    local: 'Arena Hall',
    cidade: 'Belo Horizonte',
    endereco: 'Av. Nossa Senhora do Carmo, 230 | Sion',
    dataISO: '2026-11-22',
    dataLabel: '22 NOV 2026',
    diaSemana: 'Domingo',
    horaAbertura: '19:00',
    classificacao: '16 anos (menores só com responsável)',
    exclusiva: false,
    imagem: '/eventos/rock-nacional.jpg',
    cor: '#b5462f',
    descricao:
      'Uma noite dedicada aos clássicos do rock nacional, com banda completa e repertório que atravessa quatro décadas.',
    lineup: [
      { nome: 'Banda convidada', foto: '/artistas/banda-convidada.jpg' },
      { nome: 'Os Aves', foto: '/artistas/os-aves.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso em pé à área da pista, em frente ao palco.',
        lotes: [
          { nome: '1º lote', preco: 140, estado: 'a-venda' },
          { nome: '2º lote', preco: 180, estado: 'em-breve' },
        ],
      },
      {
        tipo: 'Cadeira superior',
        descricao: 'Lugar marcado na mezanino, sentado.',
        lotes: [
          { nome: 'Lote único', preco: 220, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
      'Abertura dos portões às 19:00; início às 21:00.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'pagode-do-mirante',
    nome: 'Pagode do Mirante',
    categoria: 'Show',
    estilo: 'Pagode',
    produtora: 'Roda Produções',
    local: 'Mirante das Mangabeiras',
    cidade: 'Belo Horizonte',
    endereco: 'Av. José do Patrocínio Pontes, 580 | Mangabeiras',
    dataISO: '2026-11-16',
    dataLabel: '16 NOV 2026',
    diaSemana: 'Segunda',
    horaAbertura: '17:00',
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/pagode-do-mirante.jpg',
    cor: '#7a5c1f',
    descricao:
      'Roda de pagode ao entardecer, com vista para a cidade. Repertório raiz e clima de fim de tarde.',
    lineup: [
      { nome: 'Grupo convidado', foto: '/artistas/grupo-convidado.jpg' },
      { nome: 'Roda de abertura', foto: '/artistas/roda-abertura.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso à área do mirante.',
        lotes: [
          { nome: '1º lote', preco: 45, estado: 'a-venda' },
          { nome: '2º lote', preco: 60, estado: 'em-breve' },
        ],
      },
    ],
    regras: [
      'Evento ao ar livre | sujeito às condições do tempo.',
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'samba-da-praca',
    nome: 'Samba da Praça',
    categoria: 'Show',
    estilo: 'Samba',
    produtora: 'Roda Produções',
    local: 'Praça da Estação',
    cidade: 'Belo Horizonte',
    endereco: 'Praça Rui Barbosa, s/n | Centro',
    dataISO: '2026-11-30',
    dataLabel: '30 NOV 2026',
    diaSemana: 'Domingo',
    horaAbertura: '20:00',
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/samba-da-praca.jpg',
    cor: '#1f7a5a',
    descricao:
      'O melhor do samba mineiro no coração de BH. Uma noite de roda na Praça da Estação, com convidados subindo ao palco a cada bloco.',
    lineup: [
      { nome: 'Grupo residente', foto: '/artistas/grupo-residente.jpg' },
      { nome: 'Convidados especiais', foto: '/artistas/convidados-especiais.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso em pé à pista da Praça da Estação.',
        lotes: [
          { nome: '1º lote', preco: 80, estado: 'esgotado' },
          { nome: '2º lote', preco: 100, estado: 'a-venda' },
        ],
      },
      {
        tipo: 'Mezanino',
        descricao: 'Área elevada com melhor visão do palco.',
        lotes: [
          { nome: 'Lote único', preco: 160, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
    ],
    linkCompra: '#',
  },
  {
    slug: 'sertanejo-arena',
    nome: 'Sertanejo Arena',
    categoria: 'Show',
    estilo: 'Sertanejo',
    produtora: 'Palco BR',
    local: 'Mineirão',
    cidade: 'Belo Horizonte',
    endereco: 'Av. Antônio Abrahão Caram, 1001 | São José',
    dataISO: '2026-12-20',
    dataLabel: '20 DEZ 2026',
    diaSemana: 'Domingo',
    horaAbertura: '18:00',
    classificacao: '16 anos (menores só com responsável)',
    exclusiva: true,
    imagem: '/eventos/sertanejo-arena.jpg',
    cor: '#12141a',
    descricao:
      'O maior show de sertanejo do ano na arena do Mineirão. Estrutura de palco 360°, telões e dupla convidada de peso.',
    lineup: [
      { nome: 'Dupla principal', foto: '/artistas/dupla-principal.jpg' },
      { nome: 'Convidados', foto: '/artistas/convidados.jpg' },
      { nome: 'Abertura', foto: '/artistas/abertura.jpg' },
    ],
    ingressos: [
      {
        tipo: 'Pista',
        descricao: 'Acesso em pé à pista comum.',
        lotes: [
          { nome: '1º lote', preco: 160, estado: 'a-venda' },
          { nome: '2º lote', preco: 200, estado: 'em-breve' },
        ],
      },
      {
        tipo: 'Pista Premium',
        descricao: 'Área mais próxima do palco, com bar dedicado.',
        lotes: [
          { nome: '1º lote', preco: 320, estado: 'a-venda' },
        ],
      },
      {
        tipo: 'Camarote',
        descricao: 'Open bar e vista privilegiada em área coberta.',
        lotes: [
          { nome: 'Lote único', preco: 550, estado: 'a-venda' },
        ],
      },
    ],
    regras: [
      'Obrigatório documento com foto na entrada.',
      'Meia-entrada mediante comprovação, conforme lei.',
      'Sem reentrada após a saída.',
    ],
    linkCompra: '#',
  },
];

export const getEvento = (slug: string) => eventos.find((e) => e.slug === slug);
