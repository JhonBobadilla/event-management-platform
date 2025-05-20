const Joi = require('joi');
const reservationRepo = require('../infrastructure/reservationRepository');
const eventRepo = require('../infrastructure/eventRepository');

const schema = Joi.object({
  event_id: Joi.number().integer().required(),
});

const createReservation = async ({ user_id, event_id }) => {
  // Validar datos de entrada
  const { error } = schema.validate({ event_id });
  if (error) throw new Error(error.details[0].message);

  // Verificar si el usuario ya reservó este evento
  const exists = await reservationRepo.checkReservationExists({ user_id, event_id });
  if (exists) throw new Error('Ya tienes una reserva para este evento.');

  // Verificar que el evento exista y tenga cupo disponible
  const event = await eventRepo.getEventById(event_id);
  if (!event) throw new Error('Evento no encontrado.');
  if (event.cupo_actual >= event.cupo_maximo) throw new Error('Evento lleno. No hay cupos disponibles.');

  // Crear reserva
  const reservation = await reservationRepo.createReservation({ user_id, event_id });

  // Actualizar cupo_actual del evento
  await eventRepo.incrementCupoActual(event_id);

  return reservation;
};

module.exports = createReservation;

