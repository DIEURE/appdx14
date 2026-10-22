import { Navigate, Route, Routes } from "react-router-dom";
import { SelecaoScreen } from "./pages/SelecaoScreen";
import { PDVScreen } from "./pages/PDVScreen";
import { RetaguardaLayout } from "./layouts/RetaguardaLayout";
import { PessoaListScreen } from "./modules/retaguarda/pessoas/PessoaListScreen";
import { PessoaFormScreen } from "./modules/retaguarda/pessoas/PessoaFormScreen";
import { ProdutoListScreen } from "./modules/retaguarda/produtos/ProdutoListScreen";
import { ProdutoFormScreen } from "./modules/retaguarda/produtos/ProdutoFormScreen";
import {EmpresaFormScreen} from "./modules/retaguarda/empresa/EmpresaFormScreen"; 
import {RelatorioVendasScreen} from "./modules/retaguarda/relatorios/RelatorioVendasScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SelecaoScreen />} />
      <Route path="/pdv" element={<PDVScreen />} />

      <Route path="/retaguarda" element={<RetaguardaLayout />}>
        <Route index element={<Navigate to="pessoas" replace />} />
        <Route path="pessoas" element={<PessoaListScreen />} />
        <Route path="pessoas/novo" element={<PessoaFormScreen />} />
        <Route path="pessoas/:id" element={<PessoaFormScreen />} />
        <Route index element={<Navigate to="produtos" replace />} />
        <Route path="produtos" element={<ProdutoListScreen />} />
        <Route path="produtos/novo" element={<ProdutoFormScreen />} />
        <Route path="produtos/:id" element={<ProdutoFormScreen />} />
        <Route path="empresa" element={<EmpresaFormScreen />} />
        <Route path="relatorios/vendas" element={<RelatorioVendasScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
