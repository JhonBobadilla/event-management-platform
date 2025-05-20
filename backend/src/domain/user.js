class User {
  constructor({ id, nombre, correo, telefono, numero_documento, password, rol, creado_en }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
    this.numero_documento = numero_documento;
    this.password = password;
    this.rol = rol;
    this.creado_en = creado_en;
  }
}

module.exports = User;
