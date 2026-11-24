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
  metaDesc?: string; // opcional: meta description de SEO (~150–160 chars). Se vazio,
  //                    gera a partir da `descricao` (cortando na fronteira da palavra).
  //                    Use quando a `descricao` é atmosférica e não serve de resumo p/ busca.
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

// Link do WhatsApp da oferta de aniversário (entrada grátis + consumação, varia por evento).
// INTERINO: wa.link/aaoyj1 (mesmo do blog). Trocar aqui quando chegar o link específico.
export const WHATSAPP_ANIVERSARIO = 'https://wa.link/aaoyj1';

export function linkCondicoes(e: Evento): string {
  if (e.linkCondicoes) return e.linkCondicoes;
  const msg = `Olá! Quero saber as condições especiais para o evento "${e.nome}" (${e.dataLabel}).`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export function linkGrupo(e: Evento): string {
  return e.linkGrupo || GRUPO_OFERTAS;
}

// Query pronta para o embed/link do Google Maps.
// Só endereço + cidade geocodifica de forma mais determinística do que incluir
// o nome do local (que o Maps tenta casar com um negócio e pode fixar o pino
// errado). O "|" do endereço (separador de bairro) vira vírgula pro Maps ler.
export function mapaQuery(e: Evento): string {
  if (!e.endereco) return ''; // evento sem endereço ("a confirmar") não gera mapa
  const endereco = e.endereco.replace(/\s*\|\s*/g, ', ');
  return encodeURIComponent(`${endereco}, ${e.cidade}`);
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
    dataISO: '2026-11-26',
    dataLabel: '26 NOV 2026',
    diaSemana: 'Quinta-feira',
    horaAbertura: '22:00',
    horaFim: '03:30', // término 03h30 (veio no schema do Nittio)
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/saideira.webp', // flyer "Edição Férias" (retrato, Nittio)
    imagemHero: '/eventos/saideira-banner.webp', // banner 16/9 composto do flyer "Edição Férias"
    cor: '#6b46e0', // roxo da edição férias
    descricao: `SAIDEIRA · EDIÇÃO FÉRIAS

Porque "só mais uma" é onde as melhores histórias acontecem.

A Saideira volta em edição férias, no Night Market: um Open Format que passeia pelo Funk, MTG, Eletrônico e os hits que não deixam ninguém parado, com a vista mais linda de BH. Reúne a galera, sai de casa e vem curtir.

Uma balada pensada nos detalhes: cardápio exclusivo, drinks autorais, atendimento diferenciado e área com mesas e bistrôs. Uma noite cheia de surpresas pra brindar, dançar e viver até o último minuto.

Porque toda boa semana merece uma grande Saideira.`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos. Menores não entram, mesmo acompanhados dos pais ou responsáveis.',
      'Não é permitida a entrada com camisas de time de futebol, correntes grossas, regatas, chinelos e papetes.',
      'Ingresso pessoal e nominal: obrigatório documento oficial com foto, junto do ingresso, para validar a titularidade.',
      'Não são aceitos fotos ou prints de documento, apenas o original ou em aplicativo oficial.',
      'Proibida a entrada de perfumes, sprays, líquidos, maquiagens pontiagudas, espelhos e itens similares.',
      'O couvert e os ingressos podem ser cobrados na portaria, com valores sujeitos a alteração.',
      'Ao entrar, você autoriza o uso de imagem, vídeo e áudio na comunicação do Night Market e seus eventos.',
    ],
    // Venda via VipMe, com o código de promoter da TicketHubh (id_promoter=48412). Link enviado pelo usuário.
    linkCompra: 'https://events.vipme.com.br/2480054/552062?id_promoter=48412',
    ctaCompra: 'Colocar Nome Na Lista',
    linkCondicoes: 'https://wa.link/yvtoa5',
    ctaCondicoes: 'Condições Especiais',
    // GRUPO_NIGHT_MARKET (espelhado de produtoras.ts; não importado p/ evitar ciclo eventos↔produtoras)
    linkGrupo: 'https://chat.whatsapp.com/FfeQQmR6XMvDNlH15IPsPs',
    ctaGrupo: 'Grupo VIP do Night Market',
  },
  {
    slug: 'no-love-betim-atl',
    nome: 'No Love - Betim ATL',
    categoria: 'Festa',
    estilo: 'Funk',
    produtora: 'Night Market',
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-11-20',
    dataLabel: '20 NOV 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '22:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/no-love-betim-atl.webp',
    imagemHero: '/eventos/no-love-betim-atl-banner.webp',
    cor: '#b5179e',
    descricao: `NO LOVE

Quem precisa de amor quando tem pista cheia e funk estourando?

A NO LOVE chega à sua 2ª edição no Night Market, dessa vez com Betim ATL no comando, trazendo aquele funk que não deixa ninguém parado!

É pra cantar alto, dançar até cansar e curtir cada segundo sem pensar em mais nada. Aqui não tem espaço pra romance, só pra música boa, resenha e muita curtição!

O único match da noite é com a pista. 🔥

Vai ficar de LOVE ou vai colar com a gente?`,
    metaDesc:
      'No Love 2ª edição no Night Market, Estoril (BH): funk com Betim ATL na sexta 20/11, a partir das 22h. Festa 18+ com desconto exclusivo.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2479402/548842?id_promoter=48410',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/1ep6y8',
    ctaCondicoes: 'Condições Especiais',
    ctaGrupo: 'Grupo De Descontos',
  },
  {
    slug: 'aprovados-pos-oficial',
    nome: 'Aprovados | Pós Oficial',
    categoria: 'Festa',
    estilo: 'Funk',
    produtora: 'Night Market',
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-11-27',
    dataLabel: '27 NOV 2026',
    diaSemana: 'Sexta-feira',
    horaAbertura: '22:00',
    horaFim: '05:00', // termina 05h (veio no schema do Nittio) — habilita o endDate
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/aprovados-pos-oficial.webp', // capa do card (flyer vertical)
    imagemHero: '/eventos/aprovados-pos-oficial-banner.webp', // banner 16/9 "Virada de Lote"
    cor: '#1e6fb0',
    descricao: `APROVADOS | PÓS ENEM OFICIAL DO NIGHT

Acabaram as provas. Passou? Então vem comemorar.

O Night Market é o ponto de encontro de quem encarou o ENEM e o fim de mais um ano de estudos, e agora só quer reunir a turma, relaxar e brindar o dever cumprido. Esquece as provas, deixa a preocupação pra depois e aproveita a noite com os amigos.

Depois de tanta dedicação, a única tarefa que sobra é essa: aproveitar.`,
    metaDesc:
      'Aprovados | Pós ENEM Oficial no Night Market, Estoril (BH): festa pra comemorar o fim das provas, sexta 27/11 das 22h. 18+, com desconto exclusivo.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos. Menores não entram, mesmo acompanhados dos pais ou responsáveis.',
      'Não é permitida a entrada com camisas de time de futebol, correntes grossas, regatas, chinelos e papetes.',
      'Ingresso pessoal e nominal: obrigatório documento oficial com foto, junto do ingresso, para validar a titularidade.',
      'Não são aceitos fotos ou prints de documento, apenas o original ou em aplicativo oficial.',
      'Proibida a entrada de perfumes, sprays, líquidos, maquiagens pontiagudas, espelhos e itens similares.',
      'Ao entrar, você autoriza o uso de imagem, vídeo e áudio na comunicação do Night Market e seus eventos.',
    ],
    linkCompra: 'https://events.vipme.com.br/2480032/551683?id_promoter=48410',
    ctaCompra: 'Colocar Nome Na Lista',
    linkCondicoes: 'https://wa.link/asw3pd',
    ctaCondicoes: 'Condições Especiais',
    linkGrupo: 'https://chat.whatsapp.com/FfeQQmR6XMvDNlH15IPsPs',
    ctaGrupo: 'Grupo VIP do Night Market',
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
    produtora: 'Rio Califórnia', // casa com a produtora Rio Califórnia p/ ela listar esta festa; não é exibido na página do evento
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    // Data FIXADA nesta edição confirmada (domingo, 22/11/2026). Antes usava
    // proximoDomingo (recorrente), mas isso só recalcula a cada deploy; sem
    // rebuild agendado, o build travou no domingo anterior (15/11) e a página
    // saiu com data vencida. Para voltar ao automático de todo domingo, troque
    // de volta para proximoDomingo.dataISO / .dataLabel / .diaSemana.
    dataISO: '2026-11-22',
    dataLabel: '22 NOV 2026',
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
    metaDesc:
      'Rio Califórnia em BH: sunset de música eletrônica no Night Market, aos domingos a partir das 15h. Entre na lista e garanta seu nome com desconto. 18+.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://listariocalifornia.vercel.app/',
    ctaCompra: 'Garantir Meu Nome Na Lista',
    linkCondicoes: 'https://wa.link/clilcl',
    ctaCondicoes: 'Comemorar Aniversário',
    ctaGrupo: 'Grupo VIP',
  },
  {
    slug: 'reveillon-do-night-2027',
    nome: 'Réveillon do Night 2027',
    categoria: 'Festa',
    estilo: 'Eletrônica',
    produtora: 'Night Market',
    local: 'Night Market',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Wilson Rocha Lima, 137 | Estoril',
    dataISO: '2026-12-31',
    dataLabel: '31 DEZ 2026',
    diaSemana: 'Quinta-feira',
    horaAbertura: '22:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/reveillon-do-night-2027.webp',
    imagemHero: '/eventos/reveillon-do-night-2027-banner.webp',
    cor: '#c9a227',
    descricao: `✨ RÉVEILLON DO NIGHT 2027 | FULL OPEN BAR & OPEN FOOD PREMIUM 🥂

Já pensou começar 2027 nas alturas, com uma vista absurda de BH, muita música, open bar e open food premium? 👀

O Réveillon do Night está de volta para mais uma edição e promete uma virada simplesmente inesquecível!

A 1.070 metros de altitude, você vai curtir uma experiência completa, com 3 espaços simultâneos, grandes atrações, gastronomia premium e bebidas liberadas para brindar cada segundo da noite.

É a combinação perfeita de música, gente bonita, experiências incríveis e aquela energia que só uma virada de ano pode proporcionar!

🥂 Uma vista de tirar o fôlego. Uma festa em grande estilo. E 2027 começando do jeito que merece!

Não deixe para a última hora: garanta seu ingresso e venha viver uma das viradas mais especiais de BH! 🔥`,
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
    ],
    linkCompra: 'https://app.nittio.com.br/event/reveillon-do-night-2027-XIYJqb/details?coupon=BS',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/ed8wvn',
    ctaCondicoes: 'Condições Especiais',
    ctaGrupo: 'Grupo De Descontos',
  },
  {
    slug: 'boca-a-boca',
    nome: 'Boca a Boca',
    categoria: 'Festa',
    estilo: 'Pop',
    produtora: 'Fora da Casinha',
    local: 'Casa Vereda',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Maria Luiza Santiago, 25 | Belvedere',
    dataISO: '2026-12-19',
    dataLabel: '19 DEZ 2026',
    diaSemana: 'Sábado',
    horaAbertura: '22:00', // término não informado
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/boca-a-boca.webp', // foto a adicionar depois; cai no poster da cor
    cor: '#e11d48',
    descricao:
      'A Boca a Boca é a festa da Fora da Casinha, que chega de São Paulo para uma edição em Belo Horizonte. Acontece no sábado, 19 de dezembro de 2026, na Casa Vereda, no Belvedere, com abertura às 22h e open bar.\n\nFesta de música pop, para maiores de 18 anos.',
    metaDesc:
      'Boca a Boca em BH: a festa pop da Fora da Casinha chega de SP à Casa Vereda, no Belvedere, sábado 19/12/2026, a partir das 22h, com open bar. Maiores de 18.',
    lineup: [],
    ingressos: [],
    regras: [],
    // Compra com desconto via WhatsApp (link enviado pelo usuário).
    linkCompra: 'https://wa.link/4s7djc',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/64zjxx',
    ctaCondicoes: 'Condições Especiais',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CARNAVAL 2027 — páginas-stub criadas para o blog poder linkar.
  // Produtoras confirmadas pelo usuário: Raro (4 festas) e NaSala (1).
  // SEM dados inventados: data, local, endereço, line-up, ingressos e idade ficam
  // em branco ('' = a confirmar) até o usuário preencher ao longo do tempo.
  // Enquanto não tiverem `dataISO`, a página existe e é linkável, mas NÃO aparece
  // nas listagens nem na página da produtora (ver `eventosFuturos`).
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'mixed-by-mixed',
    nome: 'Mixed by Mixed',
    categoria: 'Festa',
    estilo: 'Eletrônica', // confirmado pelo usuário
    produtora: 'Raro', // casa com a produtora publicada → link "Produção: Raro" sai automático em [slug].astro
    local: '', // "local revelado no dia do evento" (Sympla) — Raro é itinerante
    cidade: 'Belo Horizonte',
    endereco: '',
    dataISO: '2027-02-05',
    dataLabel: '05 FEV 2027',
    diaSemana: 'Sexta-feira',
    horaAbertura: '23:00',
    horaFim: '06:00',
    classificacao: '18 anos',
    exclusiva: true,
    imagem: '/eventos/mixed-by-mixed.webp', // capa 4:5 composta da arte oficial do Sympla (banner sobre fundo desfocado dele mesmo, p/ não cortar o texto)
    imagemHero: '/eventos/mixed-by-mixed-banner.webp', // banner 16/9 (arte oficial do Sympla, 1400x733)
    cor: '#d81e34', // tema "sexta vermelha" da edição
    descricao:
      'A Mixed by Mixed abre o Carnaval 2027 de Belo Horizonte: a sexta-feira de Carnaval, 5 de fevereiro, com Full Open Bar das 23h às 6h da manhã. A madrugada inteira na pista.\n\nÉ uma festa do Grupo Raro, selo de BH conhecido pelas festas temáticas com atrações nacionais. O tema desta edição: sua sexta de Carnaval vai ser vermelha.\n\nPara maiores de 18 anos. O local é revelado no dia do evento e o line-up ainda vai ser anunciado.',
    metaDesc:
      'Mixed by Mixed BH Carnival 2027: festa do Grupo Raro com Full Open Bar, sexta 5/2 das 23h às 6h, em BH. Maiores de 18, local revelado no dia. Garanta o desconto.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos. Menores não acessam, mesmo acompanhados ou com autorização dos responsáveis.',
      'Ingressos pessoais e nominais.',
      'O local é revelado no dia do evento.',
      'Entrada só com documento original com foto e o ingresso aberto no app ou e-mail; prints ou ingressos em nome de terceiros não são aceitos.',
      'Transferência de titularidade disponível até uma semana antes do evento.',
      'Cancelamento: até 7 dias após a compra e até 48h antes do evento; ingressos no pix sem taxa não podem ser cancelados.',
      'Ao comparecer, você autoriza o uso da sua imagem nas captações do evento.',
    ],
    // Venda e emissão pela Sympla (site oficial do evento), com o código de desconto próprio da TicketHubh (?d=THUB).
    linkCompra: 'https://www.sympla.com.br/evento/mixed-by-mixed-bh-carnival-2027-full-open-bar/3627499?d=THUB',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/bn4032',
    ctaCondicoes: 'Condições Especiais',
    // Grupo de descontos específico da Raro (espelha GRUPO_RARO de produtoras.ts; não importado p/ evitar ciclo eventos↔produtoras)
    linkGrupo: 'https://chat.whatsapp.com/D3mYzSmSXga2J2pM96PdkK?s=cl&p=i&mlu=4&ilr=4&iam=2',
    ctaGrupo: 'Grupo VIP da Raro',
  },
  {
    slug: 'mineirinha',
    nome: 'Mineirinha',
    categoria: 'Festa',
    estilo: 'Funk', // confirmado pela Sympla: "Todo Carnaval tem um ritmo. Em BH, é funk"
    produtora: 'Raro', // mantido Raro (confirmado antes); a Sympla não cita produtora → gera o link "Produção: Raro"
    local: '', // "local revelado no dia do evento" (Sympla)
    cidade: 'Belo Horizonte',
    endereco: '',
    dataISO: '2027-02-07',
    dataLabel: '07 FEV 2027',
    diaSemana: 'Domingo',
    horaAbertura: '22:00', // Sympla: "22h (sujeito a alterações)"
    // horaFim omitido de propósito: fim não confirmado ("do começo ao nascer do sol") — não inventa o endDate
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/mineirinha.webp', // capa 4:5 composta da arte oficial do Sympla
    imagemHero: '/eventos/mineirinha-banner.webp', // banner 16/9 (arte oficial do Sympla)
    cor: '#c0902a', // dourado da arte "Made in Minas"
    descricao: `MINEIRINHA · CARNIVAL 2027

A festa mais mineira do Brasil volta para o Carnaval: a Mineirinha abre as portas no domingo de folia, 7 de fevereiro de 2027, em Belo Horizonte, pra quem já é de casa e pra quem ainda vai descobrir.

Todo Carnaval tem um ritmo. Em BH, é funk. No comando da pista, os DJs residentes da casa transformam a noite numa festa com sotaque, grave e muita energia. E, como todo bom mineiro, de copo cheio: Full Open Bar Premium do começo ao nascer do sol.

Mais do que uma festa, a Mineirinha é um jeito de ser: orgulho de onde a gente vem, encontro e liberdade. Para maiores de 18 anos. O local é revelado no dia do evento.`,
    metaDesc:
      'Mineirinha Carnival 2027 em BH: a festa mais mineira, no domingo de Carnaval 7/2, com funk e Full Open Bar Premium. Maiores de 18, local revelado no dia.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos. Menores não entram, mesmo acompanhados ou com autorização dos responsáveis.',
      'Ingressos pessoais e nominais.',
      'O local é revelado no dia do evento.',
      'Entrada só com documento original com foto e o ingresso aberto no app ou e-mail; prints ou ingressos em nome de terceiros não são aceitos.',
      'Transferência de titularidade disponível até uma semana antes do evento.',
      'Cancelamento: até 7 dias após a compra e até 48h antes do evento; ingressos no pix sem taxa não podem ser cancelados.',
      'Ao comparecer, você autoriza o uso da sua imagem nas captações do evento.',
    ],
    // Compra com desconto via WhatsApp (link enviado pelo usuário).
    linkCompra: 'https://wa.link/94krxt',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/5yccrc',
    ctaCondicoes: 'Condições Especiais',
    // Grupo de descontos da Raro (espelha GRUPO_RARO de produtoras.ts; não importado p/ evitar ciclo eventos↔produtoras)
    linkGrupo: 'https://chat.whatsapp.com/D3mYzSmSXga2J2pM96PdkK?s=cl&p=i&mlu=4&ilr=4&iam=2',
    ctaGrupo: 'Grupo VIP da Raro',
  },
  {
    slug: 'esbornia',
    nome: 'Esbórnia',
    categoria: 'Festa',
    estilo: '', // line-up e gênero ainda a divulgar (Sympla/RA não informam)
    produtora: 'Raro', // na RA a produção aparece como "Festa Esbórnia"; mantido Raro (confirmado antes) → gera o link "Produção: Raro"
    local: '', // "local a ser divulgado" (Sympla/RA)
    cidade: 'Belo Horizonte',
    endereco: '',
    dataISO: '2027-02-08',
    dataLabel: '08 FEV 2027',
    diaSemana: 'Segunda-feira',
    horaAbertura: '22:00', // Sympla: "22h (sujeito a alterações)"; horário oficial ainda a divulgar
    // horaFim omitido de propósito: fim não confirmado (RA: "horários a divulgar") — não inventa o endDate
    classificacao: '18 anos',
    exclusiva: false,
    imagem: '/eventos/esbornia.webp', // capa 4:5 composta da arte oficial do Sympla
    imagemHero: '/eventos/esbornia-banner.webp', // banner 16/9 (arte oficial do Sympla)
    cor: '#cc2a6e', // tom de Carnaval da arte
    descricao: `ESBÓRNIA · CARNIVAL 2027

A Esbórnia leva o Carnaval para Belo Horizonte na segunda-feira de folia, 8 de fevereiro de 2027. A festa que virou referência pela mistura de autenticidade, liberdade e intensidade numa só noite, entre fantasias, música e encontros inesquecíveis.

A edição de Carnaval tem Full Open Bar Premium, com as melhores marcas do mercado, e os Magic Shots que são a marca registrada da casa.

Para maiores de 18 anos. O local, os horários e o line-up ainda serão divulgados pela organização.`,
    metaDesc:
      'Esbórnia Carnival 2027 em BH: festa de Carnaval na segunda 8/2, com Full Open Bar Premium e Magic Shots. Maiores de 18, local a divulgar. Garanta o desconto.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos. Menores não entram.',
      'Ingressos nominais. A transferência de titularidade é permitida até uma semana antes do evento; ingressos do pré-lote não podem ser transferidos.',
      'Todos os ingressos já saem com o valor de meia-entrada (Lei nº 12.933/2013).',
      'Evento sujeito a mudança de horário e local.',
      'Ao comprar, você autoriza o compartilhamento de telefone, e-mail e data de nascimento com o organizador para ações de marketing.',
    ],
    // Venda e emissão pela Sympla (site oficial), com o código de desconto próprio da TicketHubh (?d=THUB) — confirmado pelo usuário.
    linkCompra: 'https://www.sympla.com.br/evento/esbornia-carnival-2027-full-open-bar/3643615?d=THUB',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/hnu8z1',
    ctaCondicoes: 'Condições Especiais',
    // Grupo de descontos da Raro (espelha GRUPO_RARO de produtoras.ts; não importado p/ evitar ciclo eventos↔produtoras)
    linkGrupo: 'https://chat.whatsapp.com/D3mYzSmSXga2J2pM96PdkK?s=cl&p=i&mlu=4&ilr=4&iam=2',
    ctaGrupo: 'Grupo VIP da Raro',
  },
  {
    slug: 'arca-de-noe',
    nome: 'Arca de Noé',
    categoria: 'Festa',
    estilo: '', // bloco/Carnaval; gênero não informado pelas fontes
    produtora: 'NaSala', // gera o link "Produção: NaSala"
    local: '', // "local a divulgar" (fontes só citam "Belo Horizonte")
    cidade: 'Belo Horizonte',
    endereco: '',
    dataISO: '2027-02-06',
    dataLabel: '06 FEV 2027',
    diaSemana: 'Sábado',
    horaAbertura: '22:00', // confirmado pelo usuário
    classificacao: '18 anos', // confirmado pelo usuário
    exclusiva: false,
    imagem: '/eventos/arca-de-noe.webp', // capa 4:5 composta da arte oficial (3RS/Wix)
    imagemHero: '/eventos/arca-de-noe-banner.webp', // banner 16/9 composto da mesma arte
    cor: '#2563eb', // azul/neon da arte
    descricao: `ARCA DE NOÉ · CARNAVAL BH 2027

Arca is the new bloco. A Arca de Noé leva a essência do Carnaval de rua do Rio para Belo Horizonte no sábado de Carnaval, 6 de fevereiro de 2027. Um dos projetos que entraram pro calendário nacional de festas, de volta à capital mineira.

Mais do que um bloco, é uma experiência imersiva: open bar, ambientação temática, cores, brilho, fantasias e ativações interativas. Pintura neon, bandeiras e brincadeiras que colocam o público dentro da festa.

Reúne a turma, capricha no visual e vem viver o Carnaval do seu jeito.`,
    metaDesc:
      'Arca de Noé BH 2027: o bloco que virou festa chega ao Carnaval de Belo Horizonte no sábado 6/2, a partir das 22h, com open bar, fantasias e pintura neon. 18+.',
    lineup: [],
    ingressos: [],
    regras: [
      'Classificação etária: 18 anos.',
      'O local é divulgado pela organização.',
    ],
    // Compra com desconto via WhatsApp (link enviado pelo usuário). Grupo: geral GRUPO_OFERTAS (NaSala não tem grupo próprio) via fallback.
    linkCompra: 'https://wa.link/7a0ldu',
    ctaCompra: 'Garantir Desconto',
    linkCondicoes: 'https://wa.link/xd2nn0',
    ctaCondicoes: 'Condições Especiais',
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
  // Evento sem data ("a confirmar") não é passado: ainda vai acontecer, só não
  // tem data marcada. (Fica de fora das listagens por não ser "futuro" ainda.)
  if (!e.dataISO) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return new Date(e.dataISO + 'T00:00:00').getTime() < hoje.getTime();
}

// Só os eventos que ainda vão acontecer E já têm data marcada (para as listagens
// "próximos"). Evento sem data tem página própria e é linkável, mas NÃO aparece
// nas listagens até ganhar data — entra sozinho quando a data for preenchida.
export const eventosFuturos = eventos.filter((e) => !!e.dataISO && !eventoPassado(e));
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
