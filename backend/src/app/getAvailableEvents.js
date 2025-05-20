const eventRepo = require('../infrastructure/eventRepository');

const getAvailableEvents = async () => {
  return await eventRepo.getAvailableEvents();
};

module.exports = getAvailableEvents;
