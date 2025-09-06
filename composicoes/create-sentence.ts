import type { Subtabela } from "./types";

// Gera uma frase genérica para uma linha
function gerarFraseGenerica(headers: string[], valores: string[]): string {
  const partes: string[] = [];

  for (let i = 0; i < Math.max(headers.length, valores.length); i++) {
    const header = headers[i]?.trim();
    const valor = valores[i]?.trim();

    if (!valor) continue;

    const chave = header && header.length > 0 ? header : `[coluna ${i + 1}]`;
    partes.push(`${chave}: ${valor}`);
  }

  return partes.join(', ') + '.';
}

// Gera frases para todas as linhas de uma subtabela
function gerarFrasesDaSubtabelaGenerico(sub: Subtabela): string[] {
  return sub.dados
    .filter(l => l.some(cell => cell.trim()))
    .map(linha => gerarFraseGenerica(sub.headers, linha));
}

export function createComposicaoSentence(subtabela: Subtabela) {
  let sentence = ''
  sentence += `/n  🔸 ${subtabela.nome}`;
  const frases = gerarFrasesDaSubtabelaGenerico(subtabela);
  frases.forEach(frase => {
    sentence += '    - ' + frase
  });

  return sentence
}