import { useLocation, Link, Navigate } from "react-router-dom";

export default function Confirmacion() {
  const { state: cita } = useLocation();

  if (!cita) return <Navigate to="/" replace />;

  return (
    <div className="container">
      <div className="confirmacion-box">
        <div className="check">✅</div>
        <h2>¡Reserva confirmada!</h2>
        <p>
          Gracias, <strong>{cita.nombre}</strong>. Tu hora ha sido agendada exitosamente.
        </p>

        <table className="resumen">
          <tbody>
            <tr>
              <td>Servicio</td>
              <td><strong>{cita.servicio}</strong></td>
            </tr>
            <tr>
              <td>Perro</td>
              <td><strong>{cita.perro}</strong></td>
            </tr>
            <tr>
              <td>Fecha</td>
              <td><strong>{cita.fecha}</strong></td>
            </tr>
            <tr>
              <td>Hora</td>
              <td><strong>{cita.hora}</strong></td>
            </tr>
          </tbody>
        </table>

        <p className="nota">Te esperamos puntual. Si necesitas cancelar, contáctanos con anticipación.</p>

        <Link to="/" className="btn">Volver al inicio</Link>
      </div>
    </div>
  );
}
