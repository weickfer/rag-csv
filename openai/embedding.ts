import { openai } from "./client.ts";


export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    // O embedding está em response.data[0].embedding
    return response.data[0].embedding;
  } catch (error) {
    console.error("Erro ao gerar embedding:", error);
    throw error;
  }
}
