export interface RelatorioVendas {
  dataInicio: string;
  dataFim: string;
  totalVendas: number;
  totalBruto: number;
  totalDesconto: number;
  totalLiquido: number;
  ticketMedio: number;
  quantidadePorFormaPagamento: Record<string, number>;
  valorPorFormaPagamento: Record<string, number>;
}