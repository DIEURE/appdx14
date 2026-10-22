import { useState } from "react";
import {
  Calendar,
  Printer,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
} from "lucide-react";
import { relatorioService } from "../../../services/relatorioService";
import type { RelatorioVendas } from "../../../types/relatorio";

const hoje = new Date().toISOString().slice(0, 10);
const primeiroDiaMes = (() => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
})();

const moeda = (v: number | null | undefined) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dataBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const RelatorioVendasScreen: React.FC = () => {
  const [dataInicio, setDataInicio] = useState(primeiroDiaMes);
  const [dataFim, setDataFim] = useState(hoje);
  const [relatorio, setRelatorio] = useState<RelatorioVendas | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const gerar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await relatorioService.vendas(dataInicio, dataFim);
      setRelatorio(r);
    } catch (e) {
      console.error(e);
      setErro("Erro ao gerar relatório. Verifique se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink-100 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 no-print">
        <h1 className="text-2xl font-bold tracking-tight text-ink-50">
          Relatório de Vendas
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Consolidado por período, formato 80mm
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg no-print">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Data inicial
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Data final
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={gerar}
            disabled={carregando}
            className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-md transition hover:brightness-110 disabled:opacity-50"
          >
            <Calendar size={16} />
            {carregando ? "Gerando..." : "Gerar relatório"}
          </button>
          {relatorio && (
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-ink-200 transition hover:border-brand-cyan/60 hover:text-brand-cyan"
            >
              <Printer size={16} /> Imprimir (80mm)
            </button>
          )}
        </div>
        {erro && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {erro}
          </div>
        )}
      </div>

      {relatorio && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 no-print">
            <CardResumo
              icone={<ShoppingBag size={16} />}
              titulo="Vendas"
              valor={String(relatorio.totalVendas)}
            />
            <CardResumo
              icone={<DollarSign size={16} />}
              titulo="Bruto"
              valor={moeda(relatorio.totalBruto)}
            />
            <CardResumo
              icone={<Percent size={16} />}
              titulo="Desconto"
              valor={moeda(relatorio.totalDesconto)}
            />
            <CardResumo
              icone={<TrendingUp size={16} />}
              titulo="Líquido"
              valor={moeda(relatorio.totalLiquido)}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg no-print">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
              Por forma de pagamento
            </h3>
            {Object.keys(relatorio.valorPorFormaPagamento).length === 0 ? (
              <p className="text-sm text-ink-500">
                Nenhuma venda no período.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="py-2">Forma</th>
                    <th className="py-2 text-right">Qtd</th>
                    <th className="py-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(relatorio.valorPorFormaPagamento).map(
                    ([forma, valor]) => (
                      <tr key={forma}>
                        <td className="py-2 text-ink-100">{forma}</td>
                        <td className="py-2 text-right text-ink-300">
                          {relatorio.quantidadePorFormaPagamento[forma] ?? 0}
                        </td>
                        <td className="py-2 text-right font-mono text-xs text-ink-100">
                          {moeda(valor)}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Ticket médio
              </span>
              <span className="font-mono font-bold text-ink-50">
                {moeda(relatorio.ticketMedio)}
              </span>
            </div>
          </div>

          <div className="print-area hidden print:block">
            <pre className="font-mono text-xs leading-tight text-black">
              {[
                "==========================================",
                "        RELATORIO DE VENDAS",
                "==========================================",
                `Periodo: ${dataBR(relatorio.dataInicio)} a ${dataBR(relatorio.dataFim)}`,
                `Emitido: ${new Date().toLocaleString("pt-BR")}`,
                "",
                "------------------------------------------",
                "RESUMO GERAL",
                "------------------------------------------",
                `Vendas realizadas:  ${String(relatorio.totalVendas).padStart(12)}`,
                `Total bruto:        ${moeda(relatorio.totalBruto).padStart(12)}`,
                `Desconto concedido:     ${moeda(relatorio.totalDesconto).padStart(12)}`,
                `Total liquido:      ${moeda(relatorio.totalLiquido).padStart(12)}`,
                `Ticket medio:       ${moeda(relatorio.ticketMedio).padStart(12)}`,
                "",
                "------------------------------------------",
                "POR FORMA DE PAGAMENTO",
                "------------------------------------------",
                ...Object.entries(relatorio.valorPorFormaPagamento).map(
                  ([forma, valor]) =>
                    `${forma.padEnd(14)}${String(
                      relatorio.quantidadePorFormaPagamento[forma] ?? 0,
                    ).padStart(4)}x ${moeda(valor).padStart(14)}`,
                ),
                "==========================================",
              ].join("\n")}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

const CardResumo: React.FC<{
  icone: React.ReactNode;
  titulo: string;
  valor: string;
}> = ({ icone, titulo, valor }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
      {icone}
      {titulo}
    </div>
    <div className="mt-2 font-mono text-lg font-bold text-ink-50">{valor}</div>
  </div>
);