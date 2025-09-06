import { readFile } from "node:fs/promises";

export async function jsonToOpenAI(path: string) {
  const json = await readFile(path, "utf-8");
  const jsonObject = JSON.parse(json);
  return jsonObject;
}

async function main() {
  // Aceita: node arquivo.ts input.csv output.json [chunkSize]
  const [input, output, chunkStr] = process.argv.slice(2);
  if (!input) {
    console.error("Uso: node openai.ts <input.json>");
    process.exit(1);
  }

  const json = await jsonToOpenAI(input);

  console.log(json);
}

main();