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
  horaFim?: string; // opcional: horário de término ("05:00"). Só isto habilita o endDate no schema — sem horário real, não declara (nunca inventa).
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
  ctaGrupo?: string; // opcional: rótulo do botão do grupo. Padrão: "Grupo De Descontos".
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

// endDate do schema (schema.org/Event): só quando há horário real de término
// cadastrado (`horaFim`). Nunca inventa. Se o término é de madrugada (hora menor
// que a de abertura), conta como o dia seguinte.
export function fimEvento(e: Pick<Evento, 'dataISO' | 'horaAbertura' | 'horaFim'>): string | null {
  if (!e.horaFim) return null;
  const viraDia = e.horaFim < e.horaAbertura; // "05:00" < "22:00"
  const base = new Date(e.dataISO + 'T00:00:00');
  if (viraDia) base.setDate(base.getDate() + 1);
  const dataFim = base.toISOString().slice(0, 10);
  return `${dataFim}T${e.horaFim}:00-03:00`;
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

// ─────────────────────────────────────────────────────────────────────────────
// EVENTO SEMANAL (recorrente) — próxima ocorrência de um dia da semana.
//
// A Rio Califórnia é uma série sunset que acontece TODO DOMINGO. Em vez de fixar
// a data (que vence e some da home), calcula-se no BUILD o próximo domingo >=
// hoje. Com um rebuild agendado a data anda sozinha; sem ele, recalcula a cada
// deploy. ATENÇÃO: pressupõe que a festa acontece todo domingo — se a série
// pausar (feriado, etc.), ajuste o evento manualmente, o site não tem como saber.
// ─────────────────────────────────────────────────────────────────────────────
const MESES_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const DIAS_PT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export interface OcorrenciaSemanal {
  dataISO: string; // "2026-11-01"
  dataLabel: string; // "01 NOV 2026"
  diaSemana: string; // "Domingo"
}

// `dia`: 0 = domingo … 6 = sábado. Devolve a próxima ocorrência desse dia (se hoje
// já for o dia, devolve hoje). Usa a hora local do build, igual ao resto do arquivo.
export function proximaOcorrenciaSemanal(dia: number): OcorrenciaSemanal {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const delta = (dia - hoje.getDay() + 7) % 7;
  const d = new Date(hoje);
  d.setDate(hoje.getDate() + delta);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return {
    dataISO: `${d.getFullYear()}-${mm}-${dd}`,
    dataLabel: `${dd} ${MESES_PT[d.getMonth()]} ${d.getFullYear()}`,
    diaSemana: DIAS_PT[d.getDay()],
  };
}

// Próximo domingo (a partir de hoje) — Rio Califórnia, série sunset de domingo.
export const proximoDomingo = proximaOcorrenciaSemanal(0);

export const eventos: Evento[] = [
  {
    slug: 'versus-f2f',
    nome: 'VERSUS | F2F',
    categoria: 'Festa',
    estilo: 'Eletrônica',
    produtora: 'Baila',
    local: 'Secret Kitchen',
    cidade: 'Belo Horizonte',
    endereco: 'Rua da Bahia, 54 | Centro',
    dataISO: '2026-10-23',
    dataLabel: '23 OUT 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '21:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/versus-f2f.webp',
    imagemHero: '/eventos/versus-f2f-banner.webp',
    cor: '#f23a6e',
    descricao: `VERSUS F2F | BELO HORIZONTE

UMA PISTA. DUAS FREQUÊNCIAS. ZERO MESMICE

BH, chegou a hora de mudar a forma de viver a noite.

No dia 23 de outubro, a VERSUS F2F chega para transformar o Secret Kitchen em um verdadeiro ponto de colisão entre música, tecnologia e atitude. Esquece tudo o que você conhece sobre uma festa tradicional: aqui, o som toma conta, o visual te envolve e a pista dita o ritmo até o último minuto.

Dois DJs frente a frente, uma disputa de energia e uma mistura de estilos que não deixa espaço para ficar parado. Tudo isso em uma experiência audiovisual imersiva, criada para quem não sai de casa para viver mais do mesmo.

Não é só uma festa. É um confronto de frequências. E você faz parte dele.

O QUE TE ESPERA?

- Face to Face ao vivo: dois DJs frente a frente, dividindo a cabine e elevando a energia da pista.
- Open Format sem limites: Funk, House, Techno, Hip Hop e muito mais, em uma sequência feita para surpreender.
- Imersão visual 360°: uma atmosfera audiovisual que transforma a pista em parte do espetáculo.
- Energia do início ao fim: música, movimento e uma experiência pensada para quem vive a noite de verdade.

F2F + OPEN FORMAT: DOIS DJs. UMA SÓ PISTA.

Imagine dois DJs frente a frente, trocando energia, criatividade e sonoridades em tempo real. No formato Face to Face, a cabine vira o centro de tudo: sem aquela dinâmica previsível, sem depender de uma sequência tradicional de apresentações.

O resultado? Uma experiência contínua, cheia de viradas, misturas inesperadas e momentos que só acontecem quando a música encontra a energia certa.

House, Funk, Techno, Hip Hop e Open Format se encontram para quebrar as regras e fazer a pista falar mais alto.

Você não vem só para assistir. Você vem para sentir.

ESCOLHA COMO VIVER A VERSUS

PISTA

O centro da experiência. Acesso ao ambiente principal, imersão visual 360°, bares de rápido atendimento, praça de alimentação e visão privilegiada da cabine F2F. Para quem quer estar no meio da energia e viver cada segundo de perto.

BACKSTAGE F2F

Quer ficar ainda mais perto da ação? Tenha acesso aos bastidores da pista, proximidade máxima dos artistas, bar e caixa exclusivos e uma área de descanso. Com lotação reduzida para garantir mais conforto e circulação.`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://www.sympla.com.br/evento/versus--f2f/3603184?d=SamuelDuarte',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/lyjocu',
    ctaCondicoes: 'Condições Especiais',
    ctaGrupo: 'Grupo De Descontos',
  },
  {
    slug: 'saideira',
    nome: 'Saideira',
    categoria: 'Festa',
    estilo: 'Funk',
    produtora: 'Night Market',
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-30',
    dataLabel: '30 OUT 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '22:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/saideira.webp',
    imagemHero: '/eventos/saideira-banner.webp',
    cor: '#e63950',
    descricao: `SAIDEIRA

O plano era sair cedo. Mas a noite tinha outros planos.

A semana merece um final à altura, e a Saideira é o lugar certo pra isso. Uma noite de música boa, energia lá no alto e aquela vibe que faz você perder a noção do tempo. No som, um Open Format que mistura Funk, MTG, Eletrônico e os hits que todo mundo canta e dança. Chama a galera, prepara o look e vem curtir uma das vistas mais incríveis de BH.

E não é só sobre música. É sobre viver a noite do seu jeito, com drinks autorais, cardápio exclusivo, atendimento diferenciado e espaços com mesas e bistrôs pra curtir cada momento. Tudo pensado pra transformar uma saída qualquer em uma noite que rende histórias.

Na dúvida entre ir embora ou ficar mais um pouco? Você já sabe a resposta.

Sua semana termina na Saideira.

A cada 5 amigos que forem com você, você ganha R$ 50 em consumação para aproveitar na noite!

Exemplo:

5 amigos = R$ 50 em consumação
10 amigos = R$ 100 em consumação
15 amigos = R$ 150 em consumação
20 amigos = R$ 200 em consumação

Quanto mais amigos você levar, mais consumação você garante!

Dúvidas: O couvert e os ingressos podem ser cobrados na portaria, com valores sujeitos a alterações.`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2478785/544504?id_promoter=48412',
    ctaCompra: 'Garantir Nome Na Lista',
    linkCondicoes: 'https://wa.link/37eo38',
    ctaCondicoes: 'R$250 Em Consumo',
    ctaGrupo: 'Grupo De Descontos',
  },
  {
    slug: 'medween',
    nome: 'MEDWEEN',
    categoria: 'Festa',
    estilo: 'Funk',
    // sem produtora a exibir
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-10-23',
    dataLabel: '23 OUT 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '23:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/medween.webp',
    imagemHero: '/eventos/medween-banner.webp',
    cor: '#a81d1d',
    descricao: `MEDWEEN - O HALLOWEEN QUE VAI DAR PLANTÃO NA SUA MEMÓRIA!🧟‍♂️🔥

🚨 ATENÇÃO, FUTUROS MÉDICOS: o surto coletivo mais aguardado do semestre tem data e lugar pra acontecer!

Pode esquecer a anamnese, suspender os atendimentos e preparar o psicológico, porque a MEDWEEN VAI SER ABSURDA!

📍 O destino é o Night Market. O diagnóstico? Vontade de viver uma noite INSANA! Com muito FUNK, ELETRÔNICO e MTG, a pista vai pegar fogo e o único caso grave vai ser querer que essa noite não acabe.

E já fica o aviso: não adianta deixar pra decidir em cima da hora e depois chorar vendo os stories dos outros!

🩸 MEDWEEN: o único plantão em que ninguém quer receber alta e todo mundo quer voltar pra mais uma dose!

🚨 Se você ficar de fora, o arrependimento vai ser o seu próximo diagnóstico.`,
    lineup: [{ nome: 'DJ Scar', foto: '/artistas/dj-scar.webp' }],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2478325/541699?id_promoter=22252',
    ctaCompra: 'Garantir Nome Na Lista',
    linkCondicoes: 'https://wa.link/0qjks6',
    ctaCondicoes: 'R$250 Em Consumo',
    ctaGrupo: 'Grupo De Descontos',
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
    dataISO: proximoDomingo.dataISO,
    dataLabel: proximoDomingo.dataLabel,
    diaSemana: proximoDomingo.diaSemana,
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
    linkCompra: 'https://listariocalifornia.vercel.app/',
    ctaCompra: 'Garantir Meu Nome Na Lista',
    linkCondicoes: 'https://wa.link/clilcl',
    ctaCondicoes: 'Comemorar Aniversário',
    ctaGrupo: 'Grupo De Descontos',
  },
];

export const getEvento = (slug: string) => eventos.find((e) => e.slug === slug);

// ─────────────────────────────────────────────────────────────────────────────
// EVENTO PASSADO vs FUTURO
//
// "Passado" é decidido no BUILD (o site é estático). Para um evento recém-vencido
// virar "passado" sozinho, é preciso REGERAR o site. Na Vercel: um Deploy Hook
// agendado (cron diário) resolve sem trabalho manual. A página do evento também
// tem um reforço no browser (esconde o botão de compra se a data já passou),
// cobrindo o intervalo entre o vencimento e o próximo build.
// ─────────────────────────────────────────────────────────────────────────────
export function eventoPassado(e: Pick<Evento, 'dataISO'>): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return new Date(e.dataISO + 'T00:00:00').getTime() < hoje.getTime();
}

// Só os eventos que ainda vão acontecer (para as listagens "próximos").
export const eventosFuturos = eventos.filter((e) => !eventoPassado(e));
// Só os eventos que já aconteceram (mantidos no ar como acervo indexável).
export const eventosPassados = eventos.filter((e) => eventoPassado(e));

// Próximas festas, ordenadas por data — usado para recircular quem cai numa
// página de evento que já passou.
export function proximosEventos(excluirSlug?: string, limite = 3): Evento[] {
  return eventosFuturos
    .filter((e) => e.slug !== excluirSlug)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO))
    .slice(0, limite);
}
