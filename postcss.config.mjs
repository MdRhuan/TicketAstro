// Config PostCSS vazio, propositadamente.
// Impede que o PostCSS suba a árvore de pastas e apanhe um config
// fora do projeto (ex.: C:\Users\j\postcss.config.js com Tailwind).
// Não usamos Tailwind aqui — o site é CSS puro para ficar leve.
export default {
  plugins: {},
};
