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
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-none my-10">
      <h1 className="text-center font-bold mt-16 mb-6 text-red-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">SECCIÓN DE EVENTOS</h1>
      <h1 className="text-center font-bold mt-6 mb-6 text-red-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Usuario</h1>
      {mensaje && <div className="mb-4 text-red-600 font-semibold text-center">{mensaje}</div>}

      <h2 className="text-center font-bold mt-40 mb-8 text-red-500 text-2xl sm:text-3xl md:text-4xl">
        Eventos Públicos Disponibles
      </h2>
      <ul className="space-y-6">
        {eventsPublic.map((evt) => (
          <li key={evt.id} className="border border-red-700 rounded-lg p-5 shadow-sm bg-white">
            <h3 className="text-left font-bold mt-8 mb-8 text-red-500 text-2xl sm:text-3xl md:text-3xl">{evt.nombre_evento}</h3>
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
              className="bg-gray-400 text-white px-5 py-2 mt-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
            >
              Reservar
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-center font-bold mt-40 mb-8 text-red-500 text-2xl sm:text-3xl md:text-4xl">
        Mis Reservas
      </h2>

      <ul className="space-y-6">
        {reservations.map((res) => (
          <li
            key={res.reservation_id}
            className="border border-red-300 rounded-lg p-5 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="text-left font-bold mt-8 mb-8 text-red-500 text-2xl sm:text-3xl md:text-3xl">{res.nombre_evento}</h3>
              <p>Fecha reserva: {new Date(res.fecha_reserva).toLocaleString()}</p>
              <p>Modalidad: {res.modalidad}</p>
              <p>Ciudad: {res.ciudad}</p>
              <p>Dirección: {res.direccion}</p>
              <p>Teléfono contacto: {res.telefono_contacto}</p>
              <p>Requisitos: {res.requisitos}</p>

            
            </div>
            <button
              onClick={() => cancelarReserva(res.reservation_id)}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 mt-10 mb-30 rounded transition"
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


