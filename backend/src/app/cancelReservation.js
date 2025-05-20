const reservationRepo = require('../infrastructure/reservationRepository');
const eventRepo = require('../infrastructure/eventRepository');

const cancelReservation = async (reservationId, userId) => {
  // Eliminar la reserva
  const deleted = await reservationRepo.deleteReservation(reservationId, userId);
  if (!deleted) throw new Error('Reserva no encontrada o no tienes permisos para eliminarla.');

  // Disminuir cupo_actual del evento
  await eventRepo.decrementCupoActual(deleted.event_id);

  return deleted;
};

module.exports = cancelReservation;
