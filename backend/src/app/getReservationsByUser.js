const reservationRepo = require('../infrastructure/reservationRepository');

const getReservationsByUser = async (user_id) => {
  return await reservationRepo.getReservationsByUser(user_id);
};

module.exports = getReservationsByUser;
