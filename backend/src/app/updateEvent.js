const eventRepo = require('../infrastructure/eventRepository');

const updateEvent = async (id, organizador_id, updateData) => {
  const updated = await eventRepo.updateEvent(id, organizador_id, updateData);
  if (!updated) throw new Error('Evento no encontrado o sin permisos');
  return updated;
};

module.exports = updateEvent;
