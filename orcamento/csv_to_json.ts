// csv_to_json_stream.ts
import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

/**
 * Async generator que lê um CSV e entrega chunks de objetos JSON.
 * - columns: true => primeira linha vira nomes de colunas
 * - relax_column_count: tolera colunas faltantes/extras
 * - bom: true => lida com BOM
 */
export async function* streamCsvToJsonChunks<T extends Record<string, any>>(
  filePath: string,
  chunkSize = 1_000,
  parserOptions: Partial<Parameters<typeof parse>[0]> = {}
): AsyncGenerator<T[]> {
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      bom: true,
      relax_column_count: true,
      skip_empty_lines: true,
      ...parserOptions,
    })
  );

  let chunk: T[] = [];
  for await (const record of parser) {
    chunk.push(record as T);
    if (chunk.length >= chunkSize) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length) yield chunk;
}


export async function processOrcamentoCSV(filePath: string) {
  const chunkSize = 100;
  const chunks = []

  for await (const chunk of streamCsvToJsonChunks(filePath, chunkSize)) {
    chunks.push(...chunk)
  }

  return chunks
}

