import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ICONOS = { corte: "✂️", banio: "🛁", unas: "💅" };

export default function Home() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/servicios`)
      .then((r) => r.json())
      .then(setServicios);
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <h1>Cuidado y estética para tu mejor amigo</h1>
        <p>Profesionales con amor por los animales</p>
        <Link to="/reservar" className="btn">
          Agendar hora
        </Link>
      </section>

      <section className="servicios">
        <h2>Nuestros servicios</h2>
        <div className="cards">
          {servicios.map((s) => (
            <div key={s.id} className="card">
              <div className="card-icon">{ICONOS[s.id]}</div>
              <h3>{s.nombre}</h3>
              <p className="duracion">{s.duracion}</p>
              <p className="precio">{s.precio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
