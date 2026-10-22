import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Lock } from "lucide-react";
import { produtoService } from "../../../services/produtoService";
import type { ProdutoRequest } from "../../../types/produto";

const VAZIO: ProdutoRequest = {
  codigoBarras: "",
  descricao: "",
  unidade: "UN",
  precoCusto: 0,
  precoVenda: 0,
  ativo: true,
};

const UNIDADES = ["UN", "CX", "KG", "G", "M", "M2", "M3", "L", "ML", "PC", "PCT"];

export const ProdutoFormScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState<ProdutoRequest>(VAZIO);
  const [estoque, setEstoque] = useState<number>(0);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    produtoService
      .buscarPorId(Number(id))
      .then((p) => {
        setForm({
          codigoBarras: p.codigoBarras ?? "",
          descricao: p.descricao,
          unidade: p.unidade ?? "UN",
          precoCusto: p.precoCusto,
          precoVenda: p.precoVenda,
          ativo: p.ativo,
        });
        setEstoque(p.estoqueSaldo ?? 0);
      })
      .catch((e) => {
        console.error(e);
        setErro("Não foi possível carregar o produto.");
      })
      .finally(() => setCarregando(false));
  }, [id]);

  const atualizar = <K extends keyof ProdutoRequest>(
    campo: K,
    valor: ProdutoRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descricao.trim()) {
      setErro("Descrição é obrigatória.");
      return;
    }
    if (!form.precoVenda || form.precoVenda <= 0) {
      setErro("Preço de venda deve ser maior que zero.");
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      if (editando && id) {
        await produtoService.atualizar(Number(id), form);
      } else {
        await produtoService.criar(form);
      }
      navigate("/retaguarda/produtos");
    } catch (e) {
      console.error(e);
      setErro("Erro ao salvar. Verifique os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan";
  const labelCls =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400";

  if (carregando) {
    return (
      <div className="mx-auto max-w-3xl p-12 text-center text-sm text-ink-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/retaguarda/produtos")}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-300 transition hover:border-brand-cyan/60 hover:text-brand-cyan"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-50">
            {editando ? "Editar produto" : "Novo produto"}
          </h1>
          <p className="mt-0.5 text-sm text-ink-400">
            {editando
              ? "Atualize os dados abaixo"
              : "Preencha os dados para cadastrar"}
          </p>
        </div>
      </div>

      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-500">
            Identificação
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="md:col-span-4">
              <label className={labelCls}>
                Descrição <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.descricao}
                onChange={(e) => atualizar("descricao", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Unidade</label>
              <select
                value={form.unidade}
                onChange={(e) => atualizar("unidade", e.target.value)}
                className={inputCls}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u} style={{ backgroundColor: "#1e2227" }}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-6">
              <label className={labelCls}>Código de barras</label>
              <input
                type="text"
                value={form.codigoBarras ?? ""}
                onChange={(e) =>
                  atualizar("codigoBarras", e.target.value || null)
                }
                className={inputCls}
                placeholder="EAN-13, código interno, etc. (opcional)"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-500">
            Preços
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Preço de custo</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.precoCusto}
                onChange={(e) =>
                  atualizar("precoCusto", Number(e.target.value) || 0)
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                Preço de venda <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.precoVenda}
                onChange={(e) =>
                  atualizar("precoVenda", Number(e.target.value) || 0)
                }
                className={inputCls}
                required
              />
            </div>
          </div>
        </section>

        {editando && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500">
              <Lock size={12} /> Estoque
            </h2>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-500">
                Saldo atual
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-ink-100">
                {estoque} {form.unidade}
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              O saldo só é alterado por vendas e estornos. Ajuste manual entra
              em uma tela futura.
            </p>
          </section>
        )}

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <input
              id="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => atualizar("ativo", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-cyan focus:ring-brand-cyan"
            />
            <label htmlFor="ativo" className="text-sm text-ink-200">
              Produto ativo
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/retaguarda/produtos")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-ink-300 transition hover:border-white/20 hover:text-ink-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-md transition hover:brightness-110 disabled:opacity-50"
          >
            <Save size={16} />
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};