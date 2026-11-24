// ─────────────────────────────────────────────────────────────────────────────
// POSTS DO BLOG.
// FOTO: public/blog/<slug>.jpg  (sem foto → fallback autoral com a `cor`)
//
// CORPO: cada item do array `corpo` é um parágrafo (string), um subtítulo
// (objeto { h2: '...' }), uma lista ({ lista: ['item', ...] }) ou uma lista de
// links ({ listaLinks: [{ texto, href }] }). O template renderiza string como <p>,
// { h2 } como <h2>, { lista } como <ul> e { listaLinks } como <ul> de <a>.
// ─────────────────────────────────────────────────────────────────────────────

// Bloco do corpo do artigo: texto corrido, subtítulo, lista ou lista de links.
export type BlocoCorpo =
  | string
  | { h2: string }
  | { lista: string[] }
  | { listaLinks: { texto: string; href: string }[] };

export interface Post {
  slug: string;
  titulo: string; // usado na tag <title> (SEO) e no card do blog
  tituloHero?: string; // opcional: título curto exibido no hero (<h1>); cai em `titulo` se ausente
  resumo: string;
  categoria: string; // Guia | Cena | Dicas | Bastidores
  autor: string;
  dataISO: string;
  dataLabel: string;
  tempoLeitura: number; // minutos
  imagem: string;
  cor: string;
  destaque?: boolean; // um post em destaque no topo
  corpo: BlocoCorpo[]; // parágrafos, subtítulos e listas do artigo
  ctaTexto?: string; // opcional: rótulo do botão de ação no fim do post
  ctaLink?: string; // opcional: destino do botão (ex.: /eventos/<slug> ou wa.link)
}

export const posts: Post[] = [
  {
    slug: 'festas-carnaval-2027-bh',
    titulo: 'Festas de Carnaval 2027 em BH: a programação confirmada', // usado na tag <title> (SEO) e no card
    tituloHero: 'Festas de Carnaval 2027 em BH',
    resumo:
      'As festas de Carnaval 2027 confirmadas em Belo Horizonte: Mixed by Mixed, Mineirinha, Esbórnia e Arca de Noé. Veja a programação e garanta desconto.',
    categoria: 'Guia',
    autor: 'Redação TicketHubh',
    dataISO: '2026-11-20',
    dataLabel: '20 NOV 2026',
    tempoLeitura: 3,
    imagem: '/blog/carnaval-2027-bh.webp', // adicionar a imagem; sem o arquivo, cai no poster da `cor`
    cor: '#c026d3',
    corpo: [
      'O Carnaval 2027 cai em fevereiro, e Belo Horizonte já tem festa confirmada. A TicketHubh reuniu aqui a programação fechada até agora: as festas, as produtoras por trás de cada uma e como garantir o seu lugar com desconto. A data e o local de cada festa ficam na página dela, preenchidos assim que forem divulgados.',

      { h2: 'As festas confirmadas até agora' },
      'Até o momento, são quatro festas confirmadas para o Carnaval 2027 em BH, de duas produtoras da cidade: a Raro, com três edições, e a NaSala, com a Arca de Noé.',

      { h2: 'As três festas da Raro' },
      'A Raro é um dos selos de festa mais conhecidos de Belo Horizonte, especializado em festas temáticas com atrações nacionais. O line-up passa por pagode, funk e música eletrônica, dependendo da edição. As festas da Raro são itinerantes: o local muda a cada data, então confirme sempre o endereço no link oficial de cada festa.',
      'No Carnaval 2027, a Raro confirmou três festas. A data e o local de cada uma ficam na página da festa:',
      {
        listaLinks: [
          { texto: 'Mixed by Mixed', href: '/eventos/mixed-by-mixed' },
          { texto: 'Mineirinha', href: '/eventos/mineirinha' },
          { texto: 'Esbórnia', href: '/eventos/esbornia' },
        ],
      },

      { h2: 'Arca de Noé, da NaSala' },
      'A Arca de Noé é a festa da NaSala para o Carnaval: o bloco que virou festa, conhecido pelo clima de fantasia. Como as festas da NaSala não têm endereço fixo, a data e o local ficam na página da festa:',
      {
        listaLinks: [{ texto: 'Arca de Noé', href: '/eventos/arca-de-noe' }],
      },

      { h2: 'Como garantir o seu lugar com desconto' },
      'Na porta, você paga o valor cheio. Entrando no grupo da TicketHubh, você recebe as datas e os locais assim que saem e garante o ingresso com desconto.',
      'É a vantagem de quem se planeja: a programação de Carnaval muda rápido, e quem está no grupo fica sabendo de cada data e de cada oferta em primeira mão.',

      'Entre no grupo pelo botão abaixo para receber as datas das festas de Carnaval 2027 e garantir o seu desconto.',
    ],
    ctaTexto: 'Entrar no grupo e garantir desconto no Carnaval',
    ctaLink: 'https://chat.whatsapp.com/EGrwvkC1N8WJyfp9Rsb8LM',
  },
  {
    slug: 'rio-california-festa-sunset-bh',
    titulo: 'Rio Califórnia: a festa sunset de domingo em BH',
    resumo:
      'A festa sunset de domingo em BH, no rooftop do Night Market: eletrônica do fim de tarde à noite, e como a lista garante entrada com desconto.',
    categoria: 'Cena',
    autor: 'Redação TicketHubh',
    dataISO: '2026-10-11',
    dataLabel: '11 OUT 2026',
    tempoLeitura: 3,
    imagem: '/blog/CapaPostRio.webp',
    cor: '#e0592b',
    destaque: true,
    corpo: [
      'A Rio Califórnia é a festa sunset de domingo da TicketHubh em Belo Horizonte: eletrônica no rooftop do Night Market, a partir das 15h, para maiores de 18 anos. A ideia é simples: chegar com o sol ainda alto e deixar a música crescer junto com o pôr do sol.',

      { h2: 'O que é uma festa sunset' },
      'Sunset é a festa que começa de dia e vira a noite com você dentro. No início, o som fica baixo, quase de fundo, e a pista enche sem pressa: ninguém dança ainda, todo mundo só se acomoda com o copo na mão.',
      'Conforme a tarde cai, o grave aumenta e a conversa diminui. Aí chega a hora: o sol desce, a luz fica dourada e, sem ninguém combinar, todo mundo vira para o mesmo lado. Esse é o sunset, e é de onde vem o nome da festa.',

      { h2: 'Onde e quando acontece' },
      'A Rio Califórnia acontece no Night Market, na Rua Wilson Rocha Lima, 137, em Belo Horizonte. É aos domingos, a partir das 15h, para maiores de 18 anos.',
      'Não é um evento único: é uma série que volta ao Night Market a cada edição. Se você perdeu uma, a próxima está a caminho.',

      { h2: 'Por que domingo e por que começar às 15h' },
      'Começar cedo tem motivo. Você aproveita o fim de tarde inteiro, vive o sunset na hora certa e volta para casa sem trocar o domingo por uma segunda-feira arrastada.',
      'É o rolê para quem quer dançar eletrônica de verdade sem perder o dia seguinte: chega no claro, fica até a cidade acender lá embaixo e dorme no seu horário.',

      { h2: 'Como entrar na lista' },
      'Na porta, você paga o valor cheio. Entrando na lista antes, você garante entrada com desconto. É a vantagem de quem se planeja em vez de decidir em cima da hora.',
      'Por isso vale colocar o nome na lista com antecedência. Quanto antes você garante, mais tranquilo chega no domingo.',

      'Veja a data da próxima edição da Rio Califórnia e garanta seu nome na lista pelo botão abaixo.',
    ],
    ctaTexto: 'Ver a próxima edição e entrar na lista',
    ctaLink: '/eventos/rio-california',
  },
  {
    slug: 'comemorar-aniversario-em-bh',
    titulo: 'Comemore seu aniversário: entrada grátis e até R$ 500 em consumação', // "R$ 500" usa espaço inseparável (U+00A0) para não quebrar entre linhas
    resumo:
      'Junte a galera e comemore seu aniversário em BH: entrada grátis, até R$ 500 em consumação e desconto para os convidados.',
    categoria: 'Dicas',
    autor: 'Redação TicketHubh',
    dataISO: '2026-10-11',
    dataLabel: '11 OUT 2026',
    tempoLeitura: 3,
    imagem: '/blog/CapaAniversario.webp',
    cor: '#d6336c',
    corpo: [
      'Seu aniversário é uma vez por ano, e a vontade quase sempre é a mesma: juntar a galera toda no mesmo lugar, sem complicação. O problema costuma ser a logística: mesa que não cabe todo mundo, lugar que fecha cedo, conta para dividir no fim.',
      'Tem um jeito mais simples. Dá para comemorar seu aniversário com a TicketHubh numa festa que já vai acontecer, e ainda garantir benefícios para você e para o seu grupo.',

      { h2: 'Por que comemorar numa festa' },
      'A diferença está na energia. Num restaurante ou num bar, a noite depende de vocês animarem a mesa. Numa festa, o clima já está pronto quando você chega: música alta, pista cheia, gente a fim de curtir. Você entra num rolê que já está rolando, em vez de montar um do zero.',
      'E a comemoração não acaba cedo por causa do lugar. Enquanto o bar baixa a grade, a festa ainda está esquentando, e o seu aniversário vira a noite que a galera vai lembrar depois.',

      { h2: 'O que você ganha' },
      'Comemorando seu aniversário com a gente, você e a galera garantem:',
      {
        lista: [
          'Entrada grátis: você entra comemorando, sem pagar na porta.',
          'Até R$ 500 em consumação, dependendo do evento.',
          'Um link com desconto para os convidados: cada um garante o próprio ingresso sem pagar o valor cheio.',
        ],
      },
      'O link com desconto resolve a parte mais chata de qualquer comemoração: a grana. Em vez de você bancar todo mundo ou sair cobrando um por um, cada convidado garante o lugar dele no tempo dele, sem vaquinha e sem ninguém ficando de fora na última hora. Você é o aniversariante, não o tesoureiro do rolê.',
      'Os detalhes exatos a gente acerta rapidinho no WhatsApp: qual festa, quantas pessoas e como cada benefício funciona. Tudo isso muda conforme a data e o evento da sua semana.',

      { h2: 'Como funciona, do primeiro WhatsApp até o dia' },
      'Começa com uma mensagem. Você chama a gente no WhatsApp com a data do seu aniversário, e a gente te mostra quais festas têm por perto naquela semana, porque a programação muda e a melhor opção depende de quando você faz anos.',
      'Escolhida a festa, a gente acerta os benefícios do seu grupo e te passa o link com desconto. Você compartilha com a galera, cada um garante o ingresso no seu tempo, e no dia é só chegar e comemorar.',

      'Aniversário bom é o que junta as pessoas certas num lugar com a energia no ponto. Se a sua data está chegando, chama a gente e garanta os benefícios pelo botão abaixo. Quanto antes, mais fácil encaixar na festa que você quer.',
    ],
    ctaTexto: 'Comemorar meu aniversário no WhatsApp',
    ctaLink: 'https://wa.link/aaoyj1',
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
