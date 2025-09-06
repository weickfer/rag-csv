import cliProgress from 'cli-progress'
import { createComposicaoSentence } from "./composicoes/create-sentence.ts"
import { processComposicaoCSV } from "./composicoes/csv_to_json.ts"
import { client, connectDB } from "./db.ts"
import { createEmbedding } from './openai/embedding.ts'
import { createOrcamentoSentence } from "./orcamento/create-sentence.ts"
import { processOrcamentoCSV } from "./orcamento/csv_to_json.ts"

async function createAndInsert(text: string) {
  const query = `
  INSERT INTO vectors (id, text, metadata, embedding)
  VALUES (gen_random_uuid(), $1, $2::jsonb, $3::vector)
  `;


  try {
    const embedding = await createEmbedding(text)
    const values = [
      text,
      JSON.stringify({}),
      `[${embedding.join(',')}]`
    ]
    await client.query(query, values)
    console.log("\nSentença inserida com sucesso!")
  } catch (error) {
    console.error("Erro ao inserir sentença:", error)
  }
}

function chunkTextArray(textArray: string[], chunkSize = 1000, overlap = 200) {
  const chunks = [];

  for (const text of textArray) {
    if (text.length <= chunkSize) {
      chunks.push(text);
      continue;
    }

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start += chunkSize - overlap; // avanço com sobreposição
    }
  }

  return chunks;
}

async function main() {
  try {
    console.log("Processando composicoes.csv...")
    const composicao = processComposicaoCSV('composicoes.csv')[0]
    const composicaoSentences = chunkTextArray(composicao.subtabelas.map(s => createComposicaoSentence(s)))

    console.log(`Total de sentenças de composição: ${composicaoSentences.length}`)

    console.log("Processando orcamento.csv...")
    const orcamento = await processOrcamentoCSV('orcamento.csv')
    const orcamentoSentences = chunkTextArray(orcamento.map(o => createOrcamentoSentence(o)))
    console.log(`Total de sentenças de orçamento: ${orcamentoSentences.length}`)

    // Barra de progresso para composições
    const barComposicao = new cliProgress.SingleBar({
      format: 'Composições |{bar}| {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    })
    barComposicao.start(composicaoSentences.length, 0)
    for await (const sentence of composicaoSentences) {
      console.log(sentence)
      await createAndInsert(sentence)
      barComposicao.increment()
    }
    barComposicao.stop()

    // Barra de progresso para orçamentos
    // const barOrcamento = new cliProgress.SingleBar({
    //   format: 'Orçamentos   |{bar}| {value}/{total}',
    //   barCompleteChar: '\u2588',
    //   barIncompleteChar: '\u2591',
    //   hideCursor: true
    // })
    // barOrcamento.start(orcamentoSentences.length, 0)
    // for await (const sentence of orcamentoSentences) {
    //   await createAndInsert(sentence)
    //   barOrcamento.increment()
    // }
    // barOrcamento.stop()

    console.log("Processo finalizado com sucesso!")
  } catch (error) {
    console.error("Erro no processamento principal:", error)
  }
}

connectDB().then(() => {
  console.log("Conexão com o banco de dados estabelecida.")
  main()
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error)
})