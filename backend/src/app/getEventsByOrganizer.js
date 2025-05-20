const eventRepo = require('../infrastructure/eventRepository');

const getEventsByOrganizer = async (organizador_id) => {
  const events = await eventRepo.getEventsByOrganizer(organizador_id);
  return events;
};

module.exports = getEventsByOrganizer;
