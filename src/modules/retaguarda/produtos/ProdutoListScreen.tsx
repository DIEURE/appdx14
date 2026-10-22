import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Power, Package, Boxes } from "lucide-react";
import { produtoService } from "../../../services/produtoService";
import type { Produto } from "../../../types/produto";

type FiltroStatus = "TODOS" | "ATIVOS" | "INATIVOS";

const moeda = (valor: number | null | undefined): string =>
  Number(valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const ProdutoListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termo, setTermo] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("ATIVOS");
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar produtos. Verifique se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const t = termo.trim().toLowerCase();
    return produtos
      .filter((p) => {
        if (filtro === "ATIVOS" && !p.ativo) return false;
        if (filtro === "INATIVOS" && p.ativo) return false;
        return true;
      })
      .filter((p) => {
        if (!t) return true;
        return (
          p.descricao.toLowerCase().includes(t) ||
          (p.codigoBarras ?? "").toLowerCase().includes(t)
        );
      });
  }, [produtos, termo, filtro]);

  const handleInativar = async (p: Produto) => {
    if (!window.confirm(`Inativar "${p.descricao}"?`)) return;
    setProcessandoId(p.id);
    try {
           await produtoService.atualizar(p.id, {
        codigoBarras: p.codigoBarras,
        descricao: p.descricao,
        unidade: p.unidade,
        precoCusto: p.precoCusto,
        precoVenda: p.precoVenda,
        ativo: false,
      });

      await carregar();
    } catch (e) {
      console.error(e);
      alert("Erro ao inativar. Verifique o backend.");
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-50">
            Produtos
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Catálogo de itens para venda
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/retaguarda/produtos/novo")}
          className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-md transition hover:brightness-110"
        >
          <Plus size={16} /> Novo produto
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-72 flex-1">
          <input
            type="text"
            placeholder="Buscar por descrição ou código de barras..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-ink-100 placeholder-ink-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan"
          />
          <Search className="absolute left-3 top-3 text-ink-500" size={16} />
        </div>

        <div className="flex overflow-hidden rounded-lg border border-white/10">
          {(["ATIVOS", "INATIVOS", "TODOS"] as FiltroStatus[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={`px-3 py-2.5 text-xs font-semibold transition ${
                filtro === f
                  ? "bg-brand-cyan/15 text-brand-cyan ring-1 ring-inset ring-brand-cyan/40"
                  : "bg-white/5 text-ink-300 hover:bg-white/10 hover:text-ink-100"
              }`}
            >
              {f === "ATIVOS"
                ? "Ativos"
                : f === "INATIVOS"
                ? "Inativos"
                : "Todos"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg">
        {carregando ? (
          <div className="p-12 text-center text-sm text-ink-400">
            Carregando...
          </div>
        ) : erro ? (
          <div className="p-12 text-center text-sm text-red-400">{erro}</div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-ink-500">
            <Package size={42} strokeWidth={1.2} />
            <p className="mt-3 text-sm">Nenhum produto encontrado</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-wider text-ink-400">
              <tr>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Un.</th>
                <th className="px-5 py-3 text-right">Custo</th>
                <th className="px-5 py-3 text-right">Venda</th>
                <th className="px-5 py-3 text-right">Saldo</th>
                <th className="w-32 px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtrados.map((p) => (
                <tr key={p.id} className="transition hover:bg-white/5">
                  <td className="px-5 py-3 font-semibold text-ink-100">
                    {p.descricao}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300">
                    {p.codigoBarras ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-400">{p.unidade ?? "UN"}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-ink-300">
                    {moeda(p.precoCusto)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs font-semibold text-ink-100">
                    {moeda(p.precoVenda)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-ink-300">
                    {p.estoqueSaldo ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/retaguarda/produtos/${p.id}`)
                        }
                        className="rounded p-1.5 text-ink-400 transition hover:bg-brand-cyan/15 hover:text-brand-cyan"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      {p.ativo ? (
                        <button
                          type="button"
                          onClick={() => handleInativar(p)}
                          disabled={processandoId === p.id}
                          className="rounded p-1.5 text-ink-400 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-40"
                          title="Inativar"
                        >
                          <Power size={16} />
                        </button>
                      ) : (
                        <span className="rounded p-1.5 text-ink-700" title="Inativo">
                          <Power size={16} />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
        <span>
          {filtrados.length} produto{filtrados.length === 1 ? "" : "s"}
        </span>
        <span className="flex items-center gap-1">
          <Boxes size={12} />
          <span>Saldo só muda por venda/estorno (ajuste de estoque em breve)</span>
        </span>
      </div>
    </div>
  );
};