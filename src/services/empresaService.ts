import api from "./api";
import type { Empresa, EmpresaRequest } from "../types/empresa";

export const empresaService = {
  obterPrincipal: async (): Promise<Empresa | null> => {
  try {
    const response = await api.get<Empresa>("/empresa/principal");
    return response.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
},

  criar: async (dados: EmpresaRequest): Promise<Empresa> => {
    const response = await api.post<Empresa>("/empresa", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: EmpresaRequest): Promise<Empresa> => {
    const response = await api.put<Empresa>(`/empresa/${id}`, dados);
    return response.data;
  },
};