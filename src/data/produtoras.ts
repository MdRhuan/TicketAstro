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
//
// CONVENÇÃO [A PREENCHER]: campos de TEXTO sem dado verificado ficam com a string
// '[A PREENCHER]' (perfil, resposta de FAQ, src/alt de imagem). Já as URLs (Instagram,
// WhatsApp, site) ficam OMITIDAS até ter o link real, nunca com placeholder — senão o
// template renderia um link quebrado. Nunca preencher com suposição.
// ─────────────────────────────────────────────────────────────────────────────

import { eventosFuturos, GRUPO_OFERTAS, type Evento } from './eventos';

// Grupo de descontos no WhatsApp específico da Raro (só eventos da Raro).
const GRUPO_RARO =
  'https://chat.whatsapp.com/D3mYzSmSXga2J2pM96PdkK?s=cl&p=i&mlu=4&ilr=4&iam=2';

// Grupo de descontos no WhatsApp específico do Club 415 (só eventos do Club 415).
const GRUPO_CLUB_415 = 'https://chat.whatsapp.com/ExkLWH7CQzaB6UmyWZ2o5D';

// Grupo de descontos no WhatsApp do Chalé — compartilhado com a Fora da Casinha (a pedido do usuário).
const GRUPO_CHALE = 'https://chat.whatsapp.com/DknPtbb1QJ6Lh65RS1Uc2A';

// Grupo de descontos no WhatsApp específico do Praia Buritis (só festas do Praia Buritis).
const GRUPO_PRAIA_BURITIS = 'https://chat.whatsapp.com/GK0KztbRhm99uCtkFOwIok';

// Lista VIP / grupo de descontos no WhatsApp específico da Rio Califórnia.
const GRUPO_RIO_CALIFORNIA = 'https://chat.whatsapp.com/BapREPkLhZnKnFvsZi3OiC';

// Lista VIP / grupo de descontos no WhatsApp específico do Night Market.
const GRUPO_NIGHT_MARKET = 'https://chat.whatsapp.com/FfeQQmR6XMvDNlH15IPsPs';

// Grupo de descontos no WhatsApp específico do Rust (só festas/shows do Rust).
const GRUPO_RUST = 'https://chat.whatsapp.com/I2akdCnPPHd0rLBnAPWUx7';

export interface Produtora {
  slug: string;
  nome: string; // deve bater com `evento.produtora` para a Camada B se auto-listar
  tituloExibicao?: string; // opcional: marca de exibição no H1 e no <title> quando difere de `nome` (ex.: "Rio Califórnia Sunset"). `nome` segue para schema/breadcrumb/matching.
  tituloSeo?: string; // opcional: <title> SEO completo, SEM o sufixo " | TicketHubh" (o template adiciona). Quando presente, substitui o padrão "{nome}: próximas festas em {cidade}". O H1 segue usando tituloExibicao.
  cidade: string; // base de atuação (quase sempre "Belo Horizonte")
  resumo: string; // meta description (~150 car.) — usada no <head> da página de perfil
  cartao?: string; // linha CURTA exibida no card do hub (humana/memorável; NÃO é a meta description)
  perfil: string[]; // parágrafos verificados do perfil (Camada A)
  estilo?: string; // estilo/gênero musical — PREENCHER (você)
  bairros: string[]; // bairros reais de atuação (sinal local; nunca inventar)
  locais?: string[]; // locais/endereços onde as festas acontecem (verificado; nunca inventar)
  instagram?: string; // URL do Instagram oficial — PREENCHER (obrigatório p/ publicar)
  whatsapp?: string; // URL do WhatsApp oficial (wa.me/... ou chat.whatsapp.com) — PREENCHER
  sympla?: string; // URL do perfil na Sympla (se houver)
  site?: string; // site oficial (se houver)
  postRelacionado?: string; // slug de um post do blog que fala desta produtora → vira link "No blog" na página
  faq?: { pergunta: string; resposta: string; link?: { href: string; texto: string } }[]; // perguntas ESPECÍFICAS da produtora (não repetir o FAQ geral /faq). `link` opcional vira um <a> clicável após a resposta.
  linkAniversario?: string; // opcional: link do WhatsApp da oferta de aniversário desta produtora (usado no FAQ de aniversário gerado no template). Se vazio, usa WHATSAPP_ANIVERSARIO (o link global interino).
  linkGrupo?: string; // opcional: link do grupo de descontos no WhatsApp específico desta produtora (ex.: grupo só dos eventos da Raro). Se vazio, usa GRUPO_OFERTAS (o grupo geral).
  imagens?: { src: string; alt: string }[]; // espaços de imagem; src '[A PREENCHER]' = reservado; alt sempre obrigatório
  cor?: string; // cor de marca: fundo do bloco de logo e do fallback (escolha de UI, não dado oficial)
  foto?: string; // logo em public/produtoras/<slug>.webp (sem arquivo → iniciais na cor)
  nota?: string; // observação interna (não vai ao ar), ex.: exceção de escopo
  ocultarCanais?: boolean; // esconde o bloco visível "Canais oficiais" na página; os links de instagram/site seguem no sameAs do schema. Default: mostra.
  publicar: boolean; // trava manual: só true quando o perfil estiver completo
}

// Conteúdo VERIFICADO dos rascunhos. Todas com `publicar: false` até você
// confirmar as lacunas (@ Instagram, estilo e, onde faltar, bairros).
export const produtoras: Produtora[] = [
  {
    slug: 'nasala',
    nome: 'NaSala',
    tituloExibicao: 'NaSala', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/nasala.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'NaSala em Belo Horizonte: as festas da produtora, do Halloween nos Trilhos à naSala de Verão, com ingresso oficial e desconto no grupo do WhatsApp.',
    cartao: 'Tradição na noite de BH há mais de 25 anos.',
    perfil: [
      'A NaSala é uma das produtoras mais tradicionais da noite de Belo Horizonte, com mais de 25 anos de história na cidade. Hoje funciona como uma plataforma de entretenimento conhecida pelas mega-produções temáticas, com som que passa por música eletrônica e funk.',
      'Entre as festas-marca da NaSala estão o Aniversário NaSala, a Arca (o bloco que virou festa, com open bar e clima de fantasia), o Halloween nos Trilhos e a naSala de Verão. São edições temáticas que mudam de cara a cada temporada.',
      'A NaSala não tem endereço fixo: cada festa acontece em um local diferente, por Belo Horizonte. O Halloween nos Trilhos, por exemplo, embarca o público em um trem na Estação Central rumo a um local secreto, no metrô de BH. A produtora atua em várias cidades do país, mas esta página reúne as festas da NaSala em Belo Horizonte.',
    ],
    estilo: 'Eletrônica e funk',
    bairros: [],
    locais: [
      'A NaSala não tem endereço fixo: cada festa acontece em um local diferente, por Belo Horizonte.',
      'O Halloween nos Trilhos acontece no metrô de BH, com embarque na Estação Central (Praça da Estação) rumo a um local secreto.',
    ],
    instagram: 'https://www.instagram.com/nasala_/',
    sympla: 'https://www.sympla.com.br/produtor/nasala',
    linkAniversario: 'https://wa.link/rqgq45',
    faq: [
      { pergunta: 'Onde acontecem as festas da NaSala?', resposta: 'A NaSala não tem endereço fixo: cada festa acontece em um local diferente, por Belo Horizonte. O Halloween nos Trilhos, por exemplo, embarca o público em um trem na Estação Central rumo a um local secreto. Por isso, confira sempre o endereço no link oficial de cada festa.' },
      { pergunta: 'Quais são as principais festas da NaSala?', resposta: 'As principais festas da NaSala são o Aniversário NaSala, a Arca (bloco que virou festa, com open bar), o Halloween nos Trilhos (no metrô de BH) e a naSala de Verão. São edições temáticas ao longo do ano.' },
      { pergunta: 'Qual é o estilo de música das festas da NaSala?', resposta: 'As festas da NaSala são de música eletrônica e funk, em produções temáticas.' },
      { pergunta: 'Como conseguir ingresso da NaSala com desconto?', resposta: 'Os descontos das produções da NaSala, do Halloween nos Trilhos à naSala de Verão, saem no nosso grupo no WhatsApp. Entre para receber o link oficial de cada edição já com desconto:', link: { href: GRUPO_OFERTAS, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso da NaSala pela TicketHubh?', resposta: 'Pode confiar: a TicketHubh só faz a ponte. Você recebe o link oficial de venda da festa da NaSala e entra no grupo de descontos, mas o pagamento é feito direto no canal oficial do evento, não na TicketHubh.' },
    ],
    nota: 'Atua em várias cidades. Esta página foca só as festas de BH (escopo do site).',
    publicar: true,
  },
  {
    slug: 'chale',
    nome: 'Chalé',
    tituloExibicao: 'Chalé', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/chale.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Agenda do Chalé em Belo Horizonte: próximas festas no Clube Chalezinho e link oficial de ingresso.',
    cartao: 'Festas no Quintal do Chalé, no Estoril.',
    perfil: [
      'O Chalé é uma marca consolidada da noite de BH, sediada no Clube Chalezinho (Quintal do Chalé), no bairro Estoril.',
      'Entre as festas-marca estão a Carna Chalé, no Carnaval, e as edições de aniversário da casa, como a "Chalé 16 anos".',
    ],
    bairros: ['Estoril'],
    locais: ['Clube Chalezinho, Avenida Professor Mário Werneck, 530, Estoril, Belo Horizonte.'],
    instagram: 'https://www.instagram.com/_clubechalezinho/',
    linkGrupo: GRUPO_CHALE,
    linkAniversario: 'https://wa.link/0hu62y',
    faq: [
      { pergunta: 'Onde acontecem as festas do Chalé?', resposta: 'As festas do Chalé acontecem no Clube Chalezinho, na Avenida Professor Mário Werneck, 530, no bairro Estoril, em Belo Horizonte.' },
      { pergunta: 'O que é o Clube Chalezinho?', resposta: 'O Clube Chalezinho, conhecido como "a casa de madeira", funciona no Estoril desde 2002, com estrutura de super clube e vários ambientes.' },
      { pergunta: 'Quais são as festas do Chalé?', resposta: 'Entre as festas do Chalé estão a Carna Chalé (no Carnaval), o Buteco do Chalé, o Réveillon e as edições de aniversário da casa.' },
      { pergunta: 'Como conseguir ingresso para as festas do Chalé com desconto?', resposta: 'Os descontos das festas do Chalé, no Clube Chalezinho, saem no nosso grupo no WhatsApp. Entre para pegar o link oficial de cada edição com desconto:', link: { href: GRUPO_CHALE, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso do Chalé pela TicketHubh?', resposta: 'Sim. A TicketHubh te leva ao canal oficial de venda de cada festa do Chalé e ao grupo de descontos no WhatsApp. O pagamento é feito no site oficial do evento, então dá para comprar por aqui com segurança.' },
    ],
    nota: 'Publicada após o usuário confirmar (nov/2026) que o Clube Chalezinho segue operando. Instagram @_clubechalezinho e endereço (Av. Prof. Mário Werneck, 530) verificados. Havia notícia antiga (Itatiaia) de possível fechamento; reconferir o status de tempos em tempos.',
    publicar: true,
  },
  {
    slug: 'raro',
    nome: 'Raro',
    tituloExibicao: 'Raro', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/raro.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Raro em Belo Horizonte: as próximas festas da marca, como Raroween, Esbórnia e Mineirinha, com link oficial de ingresso e desconto no grupo do WhatsApp.',
    cartao: 'Festas temáticas com atrações nacionais.',
    perfil: [
      'A Raro é um dos selos de festa mais conhecidos de Belo Horizonte, especializado em festas temáticas com atrações nacionais. Entre as principais festas da marca estão Raroween, Mixed by Mixed, Esbórnia, Mineirinha e o Raro Club, com line-up que passa por pagode, funk e música eletrônica.',
      'As festas da Raro acontecem em endereços diferentes. O Raro Club tem local fixo, na Rua Senador Milton Campos, 230, no Vila da Serra, em Nova Lima, na Grande BH. Já as outras festas, como Raroween, Esbórnia e Mineirinha, são itinerantes: o local muda a cada edição, então confira sempre o endereço no link oficial de cada data.',
      'A Raro é uma marca de Belo Horizonte, com festas na capital e na Grande BH. O grupo tem ainda operações no litoral do Ceará, mas esta página reúne as festas da marca na região de BH. Acompanhe as próximas datas e garanta seu ingresso sempre pelo canal oficial de cada festa.',
    ],
    estilo: 'Pagode, funk e eletrônica',
    bairros: [],
    locais: [
      'Raro Club: Rua Senador Milton Campos, 230, Vila da Serra, Nova Lima.',
      'Demais festas da Raro (Raroween, Mixed by Mixed, Esbórnia e Mineirinha): o local varia a cada edição; confira o endereço no link oficial de cada festa.',
    ],
    instagram: 'https://www.instagram.com/sigararo/',
    site: 'https://raro.live',
    linkGrupo: GRUPO_RARO,
    linkAniversario: 'https://wa.link/ovtzzp',
    faq: [
      { pergunta: 'Onde acontecem as festas da Raro?', resposta: 'O Raro Club, uma das festas da Raro, acontece na Rua Senador Milton Campos, 230, no bairro Vila da Serra, em Nova Lima, na Grande BH. As demais festas da marca, como Raroween, Mixed by Mixed, Esbórnia e Mineirinha, acontecem em locais diferentes, que variam a cada edição, por isso confira sempre o endereço no link oficial de cada festa.' },
      { pergunta: 'Quais são as principais festas da Raro?', resposta: 'As principais festas da Raro são Raroween (edição de Halloween), Mixed by Mixed, Esbórnia, Mineirinha e o Raro Club. São festas temáticas com atrações nacionais, em Belo Horizonte e na Grande BH.' },
      { pergunta: 'Qual é o estilo de música das festas da Raro?', resposta: 'A Raro faz festas temáticas com line-up variado, que passa por pagode, funk e música eletrônica, a depender da festa.' },
      { pergunta: 'Como conseguir ingresso da Raro com desconto?', resposta: 'No nosso grupo de descontos no WhatsApp é onde saem os descontos das festas da Raro, como Raroween e Esbórnia, junto com o link oficial de cada edição. Entre e garanta seu ingresso:', link: { href: GRUPO_RARO, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso da Raro pela TicketHubh?', resposta: 'Sim. A TicketHubh não é a bilheteria: ela te encaminha ao canal oficial de venda de cada festa da Raro e ao grupo de descontos no WhatsApp. Como o pagamento acontece no site oficial do evento, seu ingresso é legítimo.' },
    ],
    publicar: true,
  },
  {
    slug: '2liv',
    nome: '2Liv',
    tituloExibicao: '2Liv', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/2liv.webp',
    cidade: 'Belo Horizonte',
    resumo:
      '2Liv em Belo Horizonte: os shows e festivais da produtora, com atrações nacionais, link oficial de ingresso e desconto no grupo do WhatsApp.',
    cartao: 'Shows e festivais com nomes nacionais.',
    perfil: [
      'A 2Liv é uma produtora de shows e festivais de Belo Horizonte, em atividade desde 2019, especializada em trazer atrações nacionais para o público mineiro. O line-up reúne nomes de vários gêneros, de pagode e sertanejo a trap e música eletrônica, com artistas como Livinho, Matuê, Henrique & Diego e Cat Dealers.',
      'Entre os eventos e festivais da 2Liv estão o Pagode do Condé, o Not Simple Club, o Tudo Pode e o Deixa de Charme, além de edições como A Halloween Story, que levou o Cat Dealers a Belo Horizonte.',
      'Os shows e festivais da 2Liv acontecem em locais diferentes a cada edição, por Belo Horizonte, de acordo com o tamanho de cada atração. A produtora também leva eventos a outras cidades, mas esta página reúne a agenda da 2Liv em BH.',
    ],
    estilo: 'Shows e festivais',
    bairros: [],
    locais: [
      'Os shows e festivais da 2Liv acontecem em locais diferentes a cada edição, por Belo Horizonte. Confira o endereço no link oficial de cada evento.',
    ],
    instagram: 'https://www.instagram.com/2liv_oficial/',
    site: 'https://2liv.com.br',
    sympla: 'https://www.sympla.com.br/produtor/2liv',
    linkAniversario: 'https://wa.link/8qrpiv',
    faq: [
      { pergunta: 'Onde acontecem os shows da 2Liv?', resposta: 'Os shows e festivais da 2Liv acontecem em locais diferentes a cada edição, por Belo Horizonte, de acordo com a atração. Por isso, confira sempre o endereço no link oficial de cada evento.' },
      { pergunta: 'Quais são os principais eventos e festivais da 2Liv?', resposta: 'Entre os eventos e festivais da 2Liv estão o Pagode do Condé, o Not Simple Club, o Tudo Pode e o Deixa de Charme, além de edições como A Halloween Story, que levou o Cat Dealers a Belo Horizonte.' },
      { pergunta: 'Que tipo de atração a 2Liv traz?', resposta: 'A 2Liv traz atrações nacionais de vários gêneros, de pagode e sertanejo a trap e música eletrônica, com nomes como Livinho, Matuê, Henrique & Diego e Cat Dealers.' },
      { pergunta: 'Como conseguir ingresso da 2Liv com desconto?', resposta: 'Quer desconto nos shows da 2Liv? Os descontos e o link oficial de cada show e festival saem no nosso grupo no WhatsApp. É só entrar:', link: { href: GRUPO_OFERTAS, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso da 2Liv pela TicketHubh?', resposta: 'Sim. A TicketHubh encaminha você para a venda oficial de cada show da 2Liv e para o grupo de descontos no WhatsApp. Como a compra é concluída no canal oficial do evento, não há risco de ingresso falso.' },
    ],
    nota: 'Atua em várias cidades. Esta página lista só os eventos de BH. "To Live" é a grafia como se lê (nome oficial: 2Liv). NÃO citar os números de marketing do site (100+ eventos, 150 mil pessoas): autorreportados, sem fonte.',
    publicar: true,
  },
  {
    slug: 'club-415',
    nome: 'Club 415',
    tituloExibicao: 'Club 415', // H1 limpo (sem ": festas em BH"), a pedido
    cidade: 'Nova Lima',
    resumo:
      'Agenda do Club 415 (Nova Lima, Grande BH): próximas festas de música eletrônica e link oficial.',
    cartao: 'Clube no Jardim Canadá, em Nova Lima.',
    perfil: [
      'O Club 415 é um clube dedicado à música eletrônica, no Jardim Canadá, em Nova Lima (Grande BH). Recebe nomes internacionais e nacionais da cena, como ARTBAT, elrow e Dubdogz, além de edições fixas como o Réveillon 415.',
    ],
    estilo: 'Música eletrônica',
    bairros: ['Jardim Canadá'],
    instagram: 'https://www.instagram.com/club_415/',
    sympla: 'https://www.sympla.com.br/produtor/club415',
    linkGrupo: GRUPO_CLUB_415,
    linkAniversario: 'https://wa.link/qm1g5s',
    faq: [
      { pergunta: 'Onde fica o Club 415?', resposta: 'O Club 415 fica no Jardim Canadá, em Nova Lima, na Grande BH.' },
      { pergunta: 'Qual é o estilo de música do Club 415?', resposta: 'É um clube dedicado à música eletrônica, com nomes internacionais e nacionais da cena como ARTBAT, elrow e Dubdogz.' },
      { pergunta: 'Quais atrações já passaram pelo Club 415?', resposta: 'O Club 415 já recebeu nomes internacionais e nacionais da música eletrônica, como ARTBAT, elrow e Dubdogz, além de edições fixas como o Réveillon 415.' },
      { pergunta: 'Como conseguir ingresso para o Club 415 com desconto?', resposta: 'Os descontos das festas de música eletrônica do Club 415 saem no nosso grupo no WhatsApp. Entre para receber o link oficial de cada edição com desconto:', link: { href: GRUPO_CLUB_415, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso do Club 415 pela TicketHubh?', resposta: 'Sim. A TicketHubh direciona você para a venda oficial de cada festa do Club 415 e para o grupo de descontos no WhatsApp. Como o pagamento é feito no canal oficial do evento, é seguro garantir sua entrada por aqui.' },
    ],
    cor: '#101217',
    foto: '/produtoras/club-415.webp',
    nota: 'Exceção de escopo: fica em Nova Lima, não em BH. Só publicar após ajustar o posicionamento do site de "só BH" para "BH e região".',
    publicar: true, // PROTÓTIPO: única produtora com perfil completo verificado. Rever antes de produção (ver nota Nova Lima).
  },

  // ── Rascunhos novos (publicar: false até você preencher os [A PREENCHER]). ──
  {
    slug: 'major-lock',
    nome: 'Major Lock',
    tituloExibicao: 'Major Lock', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/major-lock.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Major Lock em Belo Horizonte: o pub tradicional desde 1992, com as festas e shows que acontecem por lá, ingresso oficial e desconto no grupo do WhatsApp.',
    cartao: 'Pub tradicional de BH, desde 1992.',
    perfil: [
      'O Major Lock é um pub tradicional de Belo Horizonte, aberto desde 1992 no estilo dos pubs europeus. É um dos endereços históricos do rock da cidade, da mesma cena que viu surgir nomes como Jota Quest e Skank.',
      'Hoje funciona na Rua dos Guajajaras, 842, no bairro de Lourdes, para onde a casa se mudou em 2022. O espaço tem vários ambientes, além de estúdio de tatuagem e loja.',
      'A programação é eclética: do rock ao vivo às festas de funk e open bar, com edições como a Freaky Friday e a Baile Extra, entre outras.',
    ],
    estilo: 'Do rock ao funk',
    bairros: ['Lourdes'],
    locais: ['Rua dos Guajajaras, 842, Lourdes, em Belo Horizonte.'],
    instagram: 'https://www.instagram.com/majorlockpub/',
    linkAniversario: 'https://wa.link/q3rz9x',
    faq: [
      { pergunta: 'Onde fica o Major Lock?', resposta: 'O Major Lock fica na Rua dos Guajajaras, 842, no bairro de Lourdes, em Belo Horizonte. A casa se mudou para esse endereço em 2022.' },
      { pergunta: 'Desde quando existe o Major Lock?', resposta: 'O Major Lock é um pub tradicional de Belo Horizonte, aberto desde 1992, no estilo dos pubs europeus. É um dos endereços históricos do rock da cidade.' },
      { pergunta: 'Que festas e eventos acontecem no Major Lock?', resposta: 'O Major Lock tem programação eclética: shows de rock ao vivo e festas de funk e open bar, com edições como a Freaky Friday e a Baile Extra, entre outras.' },
      { pergunta: 'Como conseguir ingresso para as festas do Major Lock com desconto?', resposta: 'Os descontos das noites e festas do Major Lock saem no nosso grupo no WhatsApp. Entre para pegar o link oficial de cada edição no pub, já com desconto:', link: { href: GRUPO_OFERTAS, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável comprar ingresso do Major Lock pela TicketHubh?', resposta: 'Sim. A TicketHubh não processa o pagamento: ela te leva ao canal oficial de venda de cada festa do Major Lock e ao grupo de descontos. Você compra no site oficial do evento, com segurança.' },
    ],
    nota: 'Pub/casa com endereço fixo (Rua dos Guajajaras 842). Bairro aparece como Lourdes no mapa, mas uma fonte cita Centro — confirmar. Recebe festas de terceiros; Freaky Friday e Baile Extra citadas como exemplos (confirmar recorrência). Sem site oficial encontrado.',
    publicar: true,
  },
  {
    slug: 'praia-buritis',
    nome: 'Praia Buritis',
    tituloExibicao: 'Praia Buritis', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/praia-buritis.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Praia Buritis: espaço de festas e eventos no bairro Buritis, em Belo Horizonte. Conheça o espaço, o endereço e as festas que acontecem por lá.',
    cartao: 'Espaço de festas no bairro Buritis.',
    perfil: [
      'O Praia Buritis é um espaço de eventos na Rua Moisés Kalil, 209, no bairro Buritis, em Belo Horizonte. É um espaço amplo e versátil, que recebe desde festas abertas até eventos privados.',
      'Entre as festas que acontecem no Praia Buritis estão a Nossa Samba, às sextas, além de edições sazonais como o Nosso Carnaval e o Réveillon, entre outras festas temáticas ao longo do ano.',
      'Além das festas, o Praia Buritis funciona como espaço para eventos privados, como aniversários, casamentos e confraternizações de empresa, com ambiente personalizável e serviço de gastronomia.',
    ],
    estilo: 'Samba, pagode e festas temáticas',
    bairros: ['Buritis'],
    locais: ['Praia Buritis, Rua Moisés Kalil, 209, Buritis, Belo Horizonte'],
    // instagram / whatsapp / site: [A PREENCHER]
    linkGrupo: GRUPO_PRAIA_BURITIS,
    linkAniversario: 'https://wa.link/t6rg7a',
    faq: [
      { pergunta: 'Onde fica o Praia Buritis?', resposta: 'O Praia Buritis fica na Rua Moisés Kalil, 209, no bairro Buritis, em Belo Horizonte.' },
      { pergunta: 'Que festas acontecem no Praia Buritis?', resposta: 'O Praia Buritis recebe festas como a Nossa Samba, às sextas, além de edições sazonais como o Nosso Carnaval e o Réveillon, entre outras festas temáticas.' },
      { pergunta: 'Quando acontece a Nossa Samba no Praia Buritis?', resposta: 'A Nossa Samba acontece às sextas, no Praia Buritis.' },
      { pergunta: 'O Praia Buritis também recebe eventos privados?', resposta: 'Sim. Além das festas abertas, o Praia Buritis funciona como espaço para eventos privados, como aniversários, casamentos e confraternizações de empresa, com ambiente personalizável e serviço de gastronomia.' },
      { pergunta: 'É seguro entrar na lista das festas do Praia Buritis?', resposta: 'Sim. A lista das festas do Praia Buritis é organizada pelos canais oficiais de cada evento. Confira sempre o link oficial antes de entrar na lista.' },
    ],
    // imagens: sem fotos reais ainda — omitido para não renderizar slots "[A PREENCHER]" na página
    publicar: true,
  },
  {
    slug: 'rio-california',
    nome: 'Rio Califórnia',
    tituloExibicao: 'Rio Califórnia Sunset', // H1 e nome no <title>; `nome` segue "Rio Califórnia" p/ schema/breadcrumb/FAQ
    foto: '/produtoras/rio-california.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Rio Califórnia: a festa sunset de domingo no rooftop do Night Market, em Belo Horizonte. Veja a próxima data e entre na lista com desconto.',
    cartao: 'Série sunset aos domingos.',
    perfil: [
      'A Rio Califórnia é a festa sunset de domingo em Belo Horizonte: música eletrônica no rooftop do Night Market, a partir das 15h, para maiores de 18 anos. A ideia é chegar com o sol ainda alto e deixar o som crescer junto com o pôr do sol, da tarde até a noite.',
      'Não é um evento único: é uma série que volta ao Night Market a cada edição, na Rua Wilson Rocha Lima, 137, em Belo Horizonte. A eletrônica começa baixa no fim da tarde e ganha força quando o sol desce, no momento sunset que dá nome à festa.',
      'A entrada é para maiores de 18 anos, com documento com foto. Na porta você paga o valor cheio; entrando na lista antes, garante entrada com desconto.',
    ],
    estilo: 'Música eletrônica',
    bairros: [], // vazio de propósito: memória pede NÃO citar "Estoril" na copy da Rio Califórnia
    locais: ['Night Market, Rua Wilson Rocha Lima, 137, Belo Horizonte'], // sem o bairro (Estoril) de propósito
    instagram: 'https://www.instagram.com/riocalifornia/',
    postRelacionado: 'rio-california-festa-sunset-bh',
    linkGrupo: GRUPO_RIO_CALIFORNIA,
    linkAniversario: 'https://wa.link/clilcl',
    faq: [
      { pergunta: 'Onde acontece a Rio Califórnia?', resposta: 'A Rio Califórnia acontece no rooftop do Night Market, na Rua Wilson Rocha Lima, 137, em Belo Horizonte.' },
      { pergunta: 'Que dia e horário é a Rio Califórnia?', resposta: 'É aos domingos, a partir das 15h. A música começa no fim da tarde e segue noite adentro.' },
      { pergunta: 'Como entrar na lista da Rio Califórnia?', resposta: 'Na porta, você paga o valor cheio. Entrando na lista antes, garante entrada com desconto. A lista e os descontos saem no nosso grupo no WhatsApp:', link: { href: GRUPO_RIO_CALIFORNIA, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'Qual a idade mínima da Rio Califórnia?', resposta: 'A idade mínima é 18 anos, e é preciso apresentar documento com foto.' },
      { pergunta: 'É confiável entrar na lista da Rio Califórnia pela TicketHubh?', resposta: 'Sim. A TicketHubh te leva ao canal oficial da Rio Califórnia e ao grupo onde sai a lista com desconto. Você entra na lista pelo canal oficial da festa, então dá para garantir seu nome por aqui com segurança.' },
    ],
    publicar: true,
  },
  {
    slug: 'night-market',
    nome: 'Night Market',
    tituloExibicao: 'Night Market', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/night-market.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Night Market: o rooftop de festas no Estoril, em Belo Horizonte. Veja as próximas festas, os horários e o link oficial de ingresso, e entre na lista VIP.',
    perfil: [
      'O Night Market é um rooftop de festas em Belo Horizonte, na Rua Wilson Rocha Lima, 137, no bairro Estoril, a mais de 1.000 metros de altitude. Com projeto do arquiteto Gustavo Penna, reúne clube, bar e espaço de eventos em quatro ambientes que funcionam juntos ou separados, com vista panorâmica da cidade e pôr do sol.',
      'A programação aberta acontece às sextas e sábados à noite, das 22h às 5h, e aos domingos a partir das 15h, com festas ao pôr do sol. O som passa por funk, eletrônico e open format, em edições como a Saideira, e a classificação é de 18 anos.',
      'Além das festas abertas, o Night Market também recebe eventos privados, como aniversários, confraternizações de empresa e formaturas, com estrutura completa de cozinha, bar, som e equipe. A casa está em atividade há mais de dez anos e realiza cerca de 80 eventos por ano.',
    ],
    cartao: 'Rooftop de festas no alto do Estoril.',
    estilo: 'Funk, eletrônico e open format',
    bairros: ['Estoril'], // verificado: endereço do Night Market
    locais: ['Night Market, Rua Wilson Rocha Lima, 137, Estoril, Belo Horizonte'], // verificado via evento Saideira
    instagram: 'https://www.instagram.com/nightmarket.bh/',
    site: 'https://www.nightmarket.com.br',
    postRelacionado: 'rio-california-festa-sunset-bh',
    linkGrupo: GRUPO_NIGHT_MARKET,
    linkAniversario: 'https://wa.link/89ncvh',
    faq: [
      { pergunta: 'Onde fica o Night Market?', resposta: 'O Night Market fica na Rua Wilson Rocha Lima, 137, no bairro Estoril, em Belo Horizonte.' },
      { pergunta: 'Como entrar na lista VIP do Night Market?', resposta: 'A lista e os descontos das festas do Night Market saem no grupo de descontos no WhatsApp. Entre pelo link:', link: { href: GRUPO_NIGHT_MARKET, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'Qual a idade mínima para as festas do Night Market?', resposta: 'A idade mínima é 18 anos.' },
      { pergunta: 'Quais são as festas no Night Market?', resposta: 'Entre as festas que acontecem no Night Market estão a Rio Califórnia, a MEDWEEN e a Saideira.' },
      { pergunta: 'É confiável comprar ingresso do Night Market pela TicketHubh?', resposta: 'Sim. Quem compra pela TicketHubh é levado ao canal oficial de venda de cada festa do Night Market e ao grupo com a lista VIP e os descontos. Como o pagamento é feito no site oficial do evento, é seguro garantir seu ingresso ou a lista VIP por aqui.' },
    ],
    publicar: true,
  },
  {
    slug: 'fora-da-casinha',
    nome: 'Fora da Casinha',
    tituloExibicao: 'Fora da Casinha', // H1 limpo (sem ": festas em BH")
    foto: '/produtoras/fora-da-casinha.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Fora da Casinha em Belo Horizonte: acompanhe as próximas festas da produtora e garanta seu ingresso pelo link oficial, com desconto no grupo do WhatsApp.',
    cartao: 'Festas em Belo Horizonte.',
    // Página MÍNIMA (a pedido do usuário): só conteúdo verdadeiro, sem [A PREENCHER] no ar
    // e sem fato inventado. Campos ainda desconhecidos (estilo, bairros, locais, @ Instagram,
    // site, FAQ específico) ficam OMITIDOS até o usuário enviar — completar quando chegarem.
    perfil: [
      'A Fora da Casinha é uma das produtoras de festas que você acompanha pela TicketHubh. Esta página reúne as próximas datas da Fora da Casinha em Belo Horizonte.',
      'Assim que uma nova festa for confirmada, ela aparece aqui, sempre com o link oficial de compra. Para receber as datas e os descontos antes de todo mundo, entre no nosso grupo no WhatsApp.',
    ],
    bairros: [],
    linkGrupo: GRUPO_CHALE, // usa o mesmo grupo de desconto do Chalé (a pedido do usuário)
    linkAniversario: 'https://wa.link/k7u9qe',
    faq: [],
    nota: 'Publicada a pedido do usuário (nov/2026) como página MÍNIMA, mesmo sem perfil completo. SEM dados inventados: estilo, @ Instagram, site, locais e festas-marca seguem pendentes até o usuário enviar. Completar quando chegarem. Grupo de desconto compartilhado com o Chalé.',
    publicar: true,
  },
  {
    slug: 'rust',
    nome: 'Rust',
    tituloExibicao: 'Rust Music Bar', // H1 limpo (sem ": festas em BH"), a pedido
    foto: '/produtoras/rust.webp',
    cidade: 'Belo Horizonte',
    resumo:
      'Rust Music Bar em Belo Horizonte: music bar e boate no Estoril, com shows, festas e artistas nacionais. Entre na lista com desconto no grupo do WhatsApp.',
    cartao: 'Music bar e boate no Estoril.',
    perfil: [
      'O Rust Music Bar é um music bar e boate no bairro Estoril, em Belo Horizonte. Durante o dia funciona como bar e, à noite, vira balada, com capacidade para cerca de 1.200 pessoas, palco de 60 m² para bandas ao vivo e shows de artistas nacionais.',
      'A programação é variada, com sertanejo, samba e pagode ao longo da semana, além de festas e eventos como o Buteco da Rust e o Sábado Rust. A classificação é de 18 anos.',
    ],
    estilo: 'Sertanejo, samba e pagode',
    bairros: ['Estoril'],
    locais: ['Rust Music Bar, Avenida Professor Mário Werneck, 50, Estoril, Belo Horizonte.'],
    instagram: 'https://www.instagram.com/rustmusicbarbh/',
    linkGrupo: GRUPO_RUST,
    linkAniversario: 'https://wa.link/rmajev',
    faq: [
      { pergunta: 'Onde fica o Rust Music Bar?', resposta: 'O Rust Music Bar fica na Avenida Professor Mário Werneck, 50, no bairro Estoril, em Belo Horizonte.' },
      { pergunta: 'O que acontece no Rust Music Bar?', resposta: 'O Rust funciona como bar e boate, com shows de bandas ao vivo e artistas nacionais. A programação passa por sertanejo, samba e pagode, além de festas como o Buteco da Rust e o Sábado Rust.' },
      { pergunta: 'Qual a idade mínima para entrar no Rust?', resposta: 'A classificação é de 18 anos.' },
      { pergunta: 'Como entrar na lista do Rust com desconto?', resposta: 'Os descontos das festas e shows do Rust saem no nosso grupo no WhatsApp. Entre para receber o link oficial de cada noite no music bar e garantir seu nome na lista com desconto:', link: { href: GRUPO_RUST, texto: 'Entrar no grupo do WhatsApp' } },
      { pergunta: 'É confiável entrar na lista do Rust pela TicketHubh?', resposta: 'Sim. A TicketHubh faz a ponte: te leva ao canal oficial de cada festa do Rust e ao grupo de descontos no WhatsApp. Você entra na lista pelo canal oficial do evento, então é seguro garantir seu nome por aqui.' },
    ],
    nota: 'Music bar/boate com endereço fixo (Av. Prof. Mário Werneck, 50, Estoril). @rustmusicbarbh. Festas citadas (Buteco da Rust, Sábado Rust) vêm de busca; confirmar recorrência. Sem site oficial encontrado.',
    publicar: true,
  },
];

// Eventos futuros desta produtora (Camada B). Usa `eventosFuturos` (já expira
// sozinho) e casa pelo nome exato de `evento.produtora`.
export function eventosDaProdutora(nome: string): Evento[] {
  return eventosFuturos
    .filter((e) => e.produtora === nome)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO));
}

// Guardrail anti-conteúdo-fino: só vai ao ar quem tem `publicar: true`.
// Rascunhos (publicar:false) não geram página, não entram no hub nem no sitemap
// (hoje não há nenhum: todas as produtoras acima estão publicadas). Para
// pré-visualizar um rascunho, ligue `publicar: true` nele e reverta antes do commit.
export const produtorasPublicadas = produtoras.filter((p) => p.publicar);

export const getProdutora = (slug: string) => produtoras.find((p) => p.slug === slug);
