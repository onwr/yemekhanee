import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import DLayout from "./layout/DuyuruLayout";
import { Toaster } from "sonner";
import PanelLay from "./layout/PanelLay";
import Panel from "./pages/panel/Panel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DLayout />}>
            <Route path="/" element={<Menu />} />
          </Route>
          <Route element={<PanelLay />}>
            <Route path="/yetkili/panel" element={<Panel />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
