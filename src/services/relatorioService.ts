import api from "./api";
import type { RelatorioVendas } from "../types/relatorio";

export const relatorioService = {
  vendas: async (
    dataInicio: string,
    dataFim: string,
  ): Promise<RelatorioVendas> => {
    const response = await api.get<RelatorioVendas>("/relatorios/vendas", {
      params: { dataInicio, dataFim },
    });
    return response.data;
  },
};