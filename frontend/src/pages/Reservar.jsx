import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const hoy = new Date().toISOString().split("T")[0];

const CAMPOS_INICIALES = {
  nombre: "",
  telefono: "",
  email: "",
  perro: "",
  servicio: "",
  fecha: "",
  hora: "",
};

export default function Reservar() {
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [form, setForm] = useState(CAMPOS_INICIALES);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/servicios`).then((r) => r.json()).then(setServicios);
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/horarios`).then((r) => r.json()).then(setHorarios);
  }, []);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error. Intenta de nuevo.");
        return;
      }

      navigate("/confirmacion", { state: data.cita });
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Agendar hora</h2>

      {error && <p className="error">{error}</p>}

      <form className="formulario" onSubmit={onSubmit}>
        <div className="campo">
          <label htmlFor="nombre">Tu nombre</label>
          <input
            id="nombre" name="nombre" type="text" required
            placeholder="Ej: María González"
            value={form.nombre} onChange={onChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono" name="telefono" type="tel" required
            placeholder="+56 9 1234 5678"
            value={form.telefono} onChange={onChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email" name="email" type="email" required
            placeholder="tu@correo.com"
            value={form.email} onChange={onChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="perro">Nombre de tu perro</label>
          <input
            id="perro" name="perro" type="text" required
            placeholder="Ej: Firulais"
            value={form.perro} onChange={onChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="servicio">Servicio</label>
          <select id="servicio" name="servicio" required value={form.servicio} onChange={onChange}>
            <option value="" disabled>Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} — {s.precio} ({s.duracion})
              </option>
            ))}
          </select>
        </div>

        <div className="fila">
          <div className="campo">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha" name="fecha" type="date" required
              min={hoy}
              value={form.fecha} onChange={onChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="hora">Hora</label>
            <select id="hora" name="hora" required value={form.hora} onChange={onChange}>
              <option value="" disabled>Selecciona</option>
              {horarios.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? "Enviando..." : "Confirmar reserva"}
        </button>
      </form>
    </div>
  );
}
