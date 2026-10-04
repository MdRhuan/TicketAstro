// ─────────────────────────────────────────────────────────────────────────────
// Resolve a imagem social de uma página.
// Se o caminho for local e o arquivo NÃO existir em public/, cai na Capa padrão
// (/og-default.jpg). Assim o preview social e o JSON-LD nunca ficam quebrados,
// e passam a usar a foto própria automaticamente assim que ela for adicionada.
// Roda só no build (Node), nunca no browser.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export const FALLBACK_OG = '/og-default.jpg';

// Caminho absoluto de um arquivo em public/ a partir de um caminho web ("/x.jpg").
function arquivoPublic(image: string): string {
  return path.join(process.cwd(), 'public', image.replace(/^\//, ''));
}

export function imagemLocal(image?: string): string {
  if (!image || /^https?:\/\//.test(image)) return image || FALLBACK_OG;
  return fs.existsSync(arquivoPublic(image)) ? image : FALLBACK_OG;
}

export interface ImagemOG {
  url: string; // caminho web resolvido (com fallback já aplicado)
  width?: number; // dimensões REAIS do arquivo servido (não chutadas)
  height?: number;
}

// Resolve a imagem social + suas dimensões reais (lidas do arquivo no build).
// Só devolve width/height quando dá para medir de verdade — imagem remota
// (http) fica sem dimensões em vez de inventar valores.
export async function imagemOG(image?: string): Promise<ImagemOG> {
  const url = imagemLocal(image);
  if (/^https?:\/\//.test(url)) return { url };
  try {
    const meta = await sharp(arquivoPublic(url)).metadata();
    return { url, width: meta.width, height: meta.height };
  } catch {
    return { url };
  }
}
