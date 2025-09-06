type Data = {
  ITEM: string;
  CÓDIGO: string;
  DESCRIÇÃO: string;
  FONTE: string;
  UND: string;
  QUANTIDADE: number;
  'PREÇO UNITÁRIO R$': string;
  'PREÇO TOTAL R$': string;
}

export function createOrcamentoSentence(chunk: any) {
  const data = chunk as Data
  let sentence = `Orçamento: `

  if (!!data.ITEM) {
    sentence += `item ${data.ITEM} `
  } else {
    sentence += `DADOS GERAIS DO ORÇAMENTO: `;
  }

  // adiconar sentença condicional.
  if(!!data.CÓDIGO)
    sentence += `pertence ao código ${data.CÓDIGO}`

  if(!!data.DESCRIÇÃO)
    sentence += `, ${data.DESCRIÇÃO}`

  if (!!data.FONTE)
    sentence += `, da fonte ${data.FONTE}`

  if (!!data.QUANTIDADE)
    sentence += `com quantidade ${data.QUANTIDADE}`

  if (!!data['PREÇO UNITÁRIO R$'])
    sentence += `, com preço unitário ${data['PREÇO UNITÁRIO R$']}`

  if (data['PREÇO TOTAL R$'])
    sentence += `, com preço total de ${data['PREÇO TOTAL R$']} `

  return sentence


  // return `
  // ${type}: 
  // item ${data.ITEM} que pertence ao código ${data.CÓDIGO} ${data.DESCRIÇÃO} da fonte ${data.FONTE} com quantidade ${data.QUANTIDADE} e preço unitário ${data['PREÇO UNITÁRIO R$']}, 
  // com preço total de ${data['PREÇO TOTAL R$']}.
  // `
}