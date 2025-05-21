import { useEffect, useState } from "react";
import axios from "axios";

const UsuarioEvents = () => {
  const token = localStorage.getItem("token");

  const [eventsPublic, setEventsPublic] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [reservaId, setReservaId] = useState(null);

  useEffect(() => {
    fetchPublicEvents();
    fetchReservations();
  }, []);

  const fetchPublicEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/events/public");
      setEventsPublic(res.data);
    } catch {
      setMensaje("Error al cargar eventos públicos");
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch {
      setMensaje("Error al cargar reservas");
    }
  };

  const reservarEvento = async (eventId) => {
    setMensaje("");
    try {
      await axios.post(
        "http://localhost:3000/api/reservations",
        { event_id: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Reserva realizada");
      fetchReservations();
    } catch {
      setMensaje("Error al reservar");
    }
  };

  const cancelarReserva = async (reservationId) => {
    setMensaje("");
    try {
      await axios.delete(`http://localhost:3000/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Reserva cancelada");
      fetchReservations();
    } catch {
      setMensaje("Error al cancelar reserva");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Eventos Públicos Disponibles</h1>
      {mensaje && <div className="mb-4 text-red-600">{mensaje}</div>}

      <ul>
        {eventsPublic.map((evt) => (
          <li key={evt.id} className="border p-3 rounded mb-3">
            <h3 className="font-semibold">{evt.nombre_evento}</h3>
            <p>Tipo: {evt.tipo_evento}</p>
            <p>Modalidad: {evt.modalidad}</p>
            <p>Descripción: {evt.descripcion}</p>
            <p>Ciudad: {evt.ciudad}</p>
            <p>Dirección: {evt.direccion}</p>
            <p>Teléfono contacto: {evt.telefono_contacto}</p>
            <p>Requisitos: {evt.requisitos}</p>
            <p>Cupo máximo: {evt.cupo_maximo}</p>
            <p>Cupo actual: {evt.cupo_actual}</p>

            <button
              onClick={() => reservarEvento(evt.id)}
              disabled={evt.estado !== "disponible" || evt.cupo_actual >= evt.cupo_maximo}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2 disabled:opacity-50"
            >
              Reservar
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">Mis Reservas</h2>

      <ul>
        {reservations.map((res) => (
          <li key={res.reservation_id} className="border p-3 rounded mb-3 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{res.nombre_evento}</h3>
              <p>Fecha reserva: {new Date(res.fecha_reserva).toLocaleString()}</p>
              <p>Tipo: {res.tipo_evento}</p>
              <p>Modalidad: {res.modalidad}</p>
            </div>
            <button
              onClick={() => cancelarReserva(res.reservation_id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Cancelar Reserva
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuarioEvents;

