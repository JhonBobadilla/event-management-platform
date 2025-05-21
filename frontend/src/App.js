import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./interfaces/pages/AuthPage";
import OrganizadorEvents from "./interfaces/pages/OrganizadorEvents";
import UsuarioEvents from "./interfaces/pages/UsuarioEvents";

function OrganizadorDashboard() {
  return <OrganizadorEvents />;
}

function UsuarioDashboard() {
  return <UsuarioEvents />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage modoInicial="login" />} />
        <Route path="/auth/login" element={<AuthPage modoInicial="login" />} />
        <Route path="/auth/register" element={<AuthPage modoInicial="register" />} />
        <Route path="/organizador/dashboard" element={<OrganizadorDashboard />} />
        <Route path="/usuario/dashboard" element={<UsuarioDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;













