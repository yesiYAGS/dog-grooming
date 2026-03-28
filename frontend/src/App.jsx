import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Reservar from "./pages/Reservar.jsx";
import Confirmacion from "./pages/Confirmacion.jsx";

export default function App() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
