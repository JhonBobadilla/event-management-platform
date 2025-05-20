const xlsx = require('xlsx');
const eventRepository = require('../infrastructure/eventRepository');
const Joi = require('joi');

// Esquema de validación de cada evento (igual al usado en la creación manual)
const eventSchema = Joi.object({
  nombre_evento: Joi.string().required(),
  tipo_evento: Joi.string().valid('educativo', 'empresarial', 'deportivo', 'artístico').required(),
  modalidad: Joi.string().valid('virtual', 'presencial').required(),
  descripcion: Joi.string().allow(''),
  ciudad: Joi.string().allow(''),
  direccion: Joi.string().allow(''),
  telefono_contacto: Joi.any().custom((v) => v === undefined ? '' : v.toString()).allow(''),
  requisitos: Joi.string().allow(''),
  cupo_maximo: Joi.number().integer().min(1).required(),
});

module.exports = async function processExcelEvents(fileBuffer, organizadorId) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  let creados = 0;
  let errores = [];

  for (const [idx, row] of rows.entries()) {
    // Validar los datos del evento
    const { error, value } = eventSchema.validate(row);
    if (error) {
      errores.push({ fila: idx + 2, error: error.details[0].message }); // +2 para reflejar la fila real del Excel
      continue;
    }
    // Intentar crear el evento
    try {
      await eventRepository.createEvent({
        ...value,
        organizador_id: organizadorId
      });
      creados++;
    } catch (e) {
      errores.push({ fila: idx + 2, error: e.message });
    }
  }

  return {
    total: rows.length,
    creados,
    fallidos: errores.length,
    errores
  };
};
