// Tipos
export type Linha = string[];

export interface Subtabela {
  nome: string;
  headers: string[];
  dados: Linha[];
  total: string | null;
}

export interface BlocoComposicao {
  composicao: string;
  subtabelas: Subtabela[];
  valorTotal: string | null;
}