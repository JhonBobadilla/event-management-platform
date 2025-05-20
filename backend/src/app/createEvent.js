const Joi = require('joi');
const eventRepo = require('../infrastructure/eventRepository');

const eventSchema = Joi.object({
  nombre_evento: Joi.string().required(),
  tipo_evento: Joi.string().valid('educativo', 'empresarial', 'deportivo', 'artístico').required(),
  modalidad: Joi.string().valid('virtual', 'presencial').required(),
  descripcion: Joi.string().allow('', null),
  ciudad: Joi.string().allow('', null),
  direccion: Joi.string().allow('', null),
  telefono_contacto: Joi.string().allow('', null),
  requisitos: Joi.string().allow('', null),
  cupo_maximo: Joi.number().integer().min(1).required(),
  url: Joi.string().uri().allow('', null)
});

const createEvent = async (eventData, organizador_id) => {
  const { error } = eventSchema.validate(eventData);
  if (error) throw new Error(error.details[0].message);

  // Adjunta el organizador_id
  const newEvent = await eventRepo.createEvent({
    ...eventData,
    organizador_id
  });

  return newEvent;
};

module.exports = createEvent;
