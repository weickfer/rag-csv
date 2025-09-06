import { parse } from 'csv-parse/sync';
import fs from 'fs';

import type { BlocoComposicao, Linha, Subtabela } from './types';

// Função principal
export function processComposicaoCSV(filePath: string): BlocoComposicao[] {
  const csvRaw = fs.readFileSync(filePath, 'utf8');
  const linhas: Linha[] = parse(csvRaw, { relaxColumnCount: true });

  const blocos: BlocoComposicao[] = [];
  let i = 0;

  while (i < linhas.length) {
    // 1. Detecta nova composição
    while (i < linhas.length && !linhas[i][0]?.startsWith('FNDE')) i++;
    if (i >= linhas.length) break;

    const composicao = linhas[i][0];
    i++;

    const subtabelas: Subtabela[] = [];

    // 2. Laço pelas subtabelas até encontrar VALOR:
    while (i < linhas.length) {
      const linha = linhas[i];
      const primeira = linha[0]?.trim();

      if (primeira?.startsWith('VALOR')) break;

      // Detecta cabeçalho de subtabela
      if (
        linha[2]?.trim()?.toUpperCase() === 'FONTE' &&
        linha[3]?.trim()?.toUpperCase() === 'UNID'
      ) {
        // Importante: o nome da subtabela está uma linha acima
        const sub = extrairSubtabelaDinamica(linhas, i - 1);
        subtabelas.push(sub.subtabela);
        i = sub.novaPos;
      } else {
        i++;
      }
    }

    // 3. Captura VALOR final
    let valorTotal: string | null = null;
    if (linhas[i]?.[0]?.startsWith('VALOR')) {
      valorTotal = linhas[i].at(-1) ?? null;
      i++;
    }

    blocos.push({
      composicao,
      subtabelas,
      valorTotal,
    });
  }

  return blocos;
}

// Extrai uma subtabela de forma dinâmica
function extrairSubtabelaDinamica(
  linhas: Linha[],
  pos: number
): { subtabela: Subtabela; novaPos: number } {
  const totalRegex = /^TOTAL .+:$/i;

  const nome = linhas[pos][0]?.trim() ?? 'Subtabela';
  const headers = linhas[pos + 1]?.map(h => h.trim() || '') ?? [];
  pos += 2; // pula nome + cabeçalho

  const dados: Linha[] = [];
  let total: string | null = null;

  while (pos < linhas.length) {
    const linha = linhas[pos];
    const primeira = linha[0]?.trim();

    if (primeira && totalRegex.test(primeira)) {
      total = linha.at(-1) ?? null;
      pos++;
      break;
    }

    if (primeira?.startsWith('FNDE') || primeira?.startsWith('VALOR')) break;

    dados.push(linha);
    pos++;
  }

  return {
    subtabela: { nome, headers, dados, total },
    novaPos: pos,
  };
}
