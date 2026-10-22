import api from "./api";
import type { Produto, ProdutoRequest } from "../types/produto";

export const produtoService = {
  listar: async (): Promise<Produto[]> => {
    const response = await api.get<Produto[]>("/produtos");
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Produto> => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  criar: async (dados: ProdutoRequest): Promise<Produto> => {
    const response = await api.post<Produto>("/produtos", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: ProdutoRequest): Promise<Produto> => {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  },
};