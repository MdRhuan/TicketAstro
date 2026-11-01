// ─────────────────────────────────────────────────────────────────────────────
// GRUPOS DO WHATSAPP — fonte única da página /grupos.
//
// COMO ADICIONAR UM GRUPO (passo a passo):
//   1. Copie um bloco { ... } inteiro (incluindo as chaves e a vírgula).
//   2. Cole dentro do array `grupos` abaixo.
//   3. Troque `nome`, `descricao` e `link`.
//
//   O `link` PRECISA ser o convite real do grupo — começa com
//   https://chat.whatsapp.com/...  (Pegue no WhatsApp:
//   abrir o grupo → Dados do grupo → Convite por link → Copiar link.)
//   NÃO invente o código: um link errado leva a pessoa a "grupo inválido".
//
//   tipo:  'ofertas' → descontos/avisos gerais  (aparecem no topo)
//          'festa'   → grupo de uma festa específica (aparecem na seção de baixo)
//   destaque: true   → marca o card como "Principal" (badge na foto); use só no principal.
//
//   FOTO:  coloque o arquivo em  public/grupos/<arquivo>.jpg  e aponte o campo
//          `foto` para ele (ex.: '/grupos/geral.jpg'). Sem foto → o card mostra
//          um fallback autoral com o ícone do WhatsApp (nada quebra).
// ─────────────────────────────────────────────────────────────────────────────

import { GRUPO_OFERTAS } from './eventos';

export interface Grupo {
  nome: string;
  descricao: string; // 1 linha curta: o que a pessoa ganha ao entrar
  link: string; // convite real: https://chat.whatsapp.com/...
  tipo: 'ofertas' | 'festa';
  foto?: string; // public/grupos/<arquivo>.jpg  (sem foto → fallback autoral)
  destaque?: boolean;
}

export const grupos: Grupo[] = [
  // ── Grupo geral de ofertas de ingressos de BH (aparece no topo). ──
  {
    nome: 'Ofertas de Ingressos | BH',
    descricao: 'As ofertas e promoções das festas de BH, reunidas em um só lugar. A gente posta ingressos com desconto, listas, datas, horários, atrações e avisos de cada festa. Antes de comprar o seu, confere aqui.',
    link: GRUPO_OFERTAS, // mesmo grupo dos botões "Descontos" do site (fonte única em eventos.ts)
    tipo: 'ofertas',
    foto: '/grupos/FotoGrupoTicketHubh.webp',
  },

  // ── Rio Califórnia — grupo da festa (lista + avisos). ──
  {
    nome: 'Lista VIP Rio Califórnia 🌤️',
    descricao: 'Aqui você coloca seu nome na lista e entra com desconto. Também postamos as informações de cada festa: data, horário, atrações e avisos importantes.',
    link: 'https://chat.whatsapp.com/BapREPkLhZnKnFvsZi3OiC',
    tipo: 'festa',
    foto: '/grupos/FotoGrupoRC.webp',
  },

  // ── Offs BH — grupo da festa (lista + avisos). ──
  {
    nome: 'Lista Offs - BH #2',
    descricao: 'Seu desconto na entrada começa aqui. Mande seu nome quando a lista abrir e acompanhe as novidades de cada edição: line-up, horários, avisos de última hora e tudo o que rola antes da festa.',
    link: 'https://chat.whatsapp.com/FfeQQmR6XMvDNlH15IPsPs',
    tipo: 'festa',
    foto: '/grupos/FotoGrupoOffs.webp',
  },

  // ── MODELO — copie, cole acima desta linha e troque os campos. ──
  // {
  //   nome: 'Festa Neon — grupo',
  //   descricao: 'Lotes, avisos e condições exclusivas só para quem vai à Festa Neon.',
  //   link: 'https://chat.whatsapp.com/COLE-O-CODIGO-DO-CONVITE-AQUI',
  //   tipo: 'festa',
  //   foto: '/grupos/festa-neon.jpg',
  // },
];
