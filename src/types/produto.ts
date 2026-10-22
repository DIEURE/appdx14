export interface Produto {
  id: number;
  codigoBarras: string | null;
  descricao: string;
  unidade: string;
  precoCusto: number;
  precoVenda: number;
  estoqueSaldo: number;
  ativo: boolean;
}

export interface ProdutoRequest {
  codigoBarras: string | null;
  descricao: string;
  unidade: string;
  precoCusto: number;
  precoVenda: number;
  estoqueSaldo?: number | null;
  ativo: boolean;
}