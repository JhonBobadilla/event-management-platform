const eventRepo = require('../infrastructure/eventRepository');

const deleteEvent = async (id, organizador_id) => {
  const deleted = await eventRepo.deleteEvent(id, organizador_id);
  if (!deleted) throw new Error('Evento no encontrado o sin permisos');
  return deleted;
};

module.exports = deleteEvent;
