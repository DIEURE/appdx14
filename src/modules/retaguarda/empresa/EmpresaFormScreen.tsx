import { useEffect, useState } from "react";
import { Save, Building2, Loader2 } from "lucide-react";
import { empresaService } from "../../../services/empresaService";
import type { EmpresaRequest } from "../../../types/empresa";

const VAZIO: EmpresaRequest = {
  razaoSocial: "",
  nomeFantasia: null,
  cnpj: "",
  inscricaoEstadual: null,
  endereco: null,
  cidade: null,
  uf: null,
  cep: null,
  telefone: null,
  email: null,
  logoUrl: null,
};

export const EmpresaFormScreen: React.FC = () => {
  const [form, setForm] = useState<EmpresaRequest>(VAZIO);
  const [id, setId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    empresaService
      .obterPrincipal()
      .then((e) => {
        if (e) {
          setId(e.id);
          setForm({
            razaoSocial: e.razaoSocial,
            nomeFantasia: e.nomeFantasia,
            cnpj: e.cnpj,
            inscricaoEstadual: e.inscricaoEstadual,
            endereco: e.endereco,
            cidade: e.cidade,
            uf: e.uf,
            cep: e.cep,
            telefone: e.telefone,
            email: e.email,
            logoUrl: e.logoUrl,
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setErro("Não foi possível carregar os dados da empresa.");
      })
      .finally(() => setCarregando(false));
  }, []);

  const atualizar = <K extends keyof EmpresaRequest>(
    campo: K,
    valor: EmpresaRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setSucesso(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razaoSocial.trim()) {
      setErro("Razão social é obrigatória.");
      return;
    }
    if (!form.cnpj.trim()) {
      setErro("CNPJ é obrigatório.");
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      if (id) {
        await empresaService.atualizar(id, form);
      } else {
        const nova = await empresaService.criar(form);
        setId(nova.id);
      }
      setSucesso(true);
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
      <div className="flex items-center justify-center p-12 text-sm text-ink-400">
        <Loader2 className="mr-2 animate-spin" size={16} /> Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-brand-cyan/15 p-2 text-brand-cyan ring-1 ring-inset ring-brand-cyan/40">
          <Building2 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-50">
            Empresa
          </h1>
          <p className="mt-0.5 text-sm text-ink-400">
            {id ? "Dados da empresa emitente" : "Cadastre a empresa emitente"}
          </p>
        </div>
      </div>

      {erro && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          Dados salvos com sucesso.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-500">
            Identificação
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelCls}>
                Razão social <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.razaoSocial}
                onChange={(e) => atualizar("razaoSocial", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Nome fantasia</label>
              <input
                type="text"
                value={form.nomeFantasia ?? ""}
                onChange={(e) =>
                  atualizar("nomeFantasia", e.target.value || null)
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                CNPJ <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => atualizar("cnpj", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Inscrição estadual</label>
              <input
                type="text"
                value={form.inscricaoEstadual ?? ""}
                onChange={(e) =>
                  atualizar("inscricaoEstadual", e.target.value || null)
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Telefone</label>
              <input
                type="text"
                value={form.telefone ?? ""}
                onChange={(e) =>
                  atualizar("telefone", e.target.value || null)
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>E-mail</label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => atualizar("email", e.target.value || null)}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Logo (URL)</label>
              <input
                type="text"
                value={form.logoUrl ?? ""}
                onChange={(e) => atualizar("logoUrl", e.target.value || null)}
                className={inputCls}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-500">
            Endereço
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="md:col-span-4">
              <label className={labelCls}>Endereço</label>
              <input
                type="text"
                value={form.endereco ?? ""}
                onChange={(e) =>
                  atualizar("endereco", e.target.value || null)
                }
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>CEP</label>
              <input
                type="text"
                value={form.cep ?? ""}
                onChange={(e) => atualizar("cep", e.target.value || null)}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-4">
              <label className={labelCls}>Cidade</label>
              <input
                type="text"
                value={form.cidade ?? ""}
                onChange={(e) => atualizar("cidade", e.target.value || null)}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>UF</label>
              <input
                type="text"
                maxLength={2}
                value={form.uf ?? ""}
                onChange={(e) =>
                  atualizar("uf", e.target.value.toUpperCase() || null)
                }
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
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