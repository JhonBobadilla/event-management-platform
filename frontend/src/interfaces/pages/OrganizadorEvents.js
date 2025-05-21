import { useEffect, useState } from "react";
import axios from "axios";

const OrganizadorEvents = () => {
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre_evento: "",
    tipo_evento: "educativo",
    modalidad: "virtual",
    descripcion: "",
    ciudad: "",
    direccion: "",
    telefono_contacto: "",
    requisitos: "",
    cupo_maximo: 0,
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch {
      setMensaje("Error al cargar eventos");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento((prev) => ({ ...prev, [name]: value }));
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      await axios.post("http://localhost:3000/api/events", nuevoEvento, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Evento creado");
      setNuevoEvento({
        nombre_evento: "",
        tipo_evento: "educativo",
        modalidad: "virtual",
        descripcion: "",
        ciudad: "",
        direccion: "",
        telefono_contacto: "",
        requisitos: "",
        cupo_maximo: 0,
      });
      fetchEvents();
    } catch {
      setMensaje("Error al crear evento");
    }
  };

  // Editar evento
  const startEdit = (evt) => {
    console.log("startEdit -> evt recibido:", evt); 
    setEditId(evt.id);
    const nuevoEditForm = {
      id: evt.id,
      nombre_evento: evt.nombre_evento || "",
      tipo_evento: evt.tipo_evento || "",
      modalidad: evt.modalidad || "",
      descripcion: evt.descripcion || "",
      ciudad: evt.ciudad || "",
      direccion: evt.direccion || "",
      telefono_contacto: evt.telefono_contacto || "",
      requisitos: evt.requisitos || "",
      cupo_maximo: evt.cupo_maximo || 0,
    };
    console.log("Nuevo estado editForm que se va a setear:", nuevoEditForm); 
    setEditForm(nuevoEditForm);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updated = { ...prev, [name]: value };
      console.log(`Editando campo: ${name}, valor: ${value}`);
      console.log("editForm actualizado:", updated);
      return updated;
    });
  };

  const saveEdit = async () => {
    setMensaje("");
    try {
      // Extraemos id para enviarlo en la URL, no en el body
      const { id, ...bodyWithoutId } = editForm;
      console.log("Enviando PUT a backend con:", bodyWithoutId);

      await axios.put(`http://localhost:3000/api/events/${id}`, bodyWithoutId, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje("Evento actualizado");
      setEditId(null);
      fetchEvents();
    } catch (error) {
      setMensaje("Error al actualizar evento");
      console.log("ERROR al actualizar evento:", error);
    }
  };

  // cancela edición
  const cancelEdit = () => {
    setEditId(null);
  };

  const handleDelete = async (id) => {
    setMensaje("");
    try {
      await axios.delete(`http://localhost:3000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Evento eliminado");
      fetchEvents();
    } catch {
      setMensaje("Error al eliminar evento");
    }
  };

  // Carga Excel
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadExcel = async () => {
    if (!file) {
      setMensaje("Selecciona un archivo");
      return;
    }
    setMensaje("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:3000/api/events/upload-excel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMensaje("Archivo cargado correctamente");
      fetchEvents();
    } catch {
      setMensaje("Error al cargar archivo");
    }
  };

  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-none my-10">

      <h1 className="text-center font-bold mt-16 mb-6 text-red-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">SECCIÓN DE EVENTOS</h1>
      <h1 className="text-center font-bold mt-6 mb-6 text-red-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Organizador</h1>

      <h2 className="text-center font-bold mt-40 mb-8 text-red-500 text-2xl sm:text-3xl md:text-4xl
      ">Crear nuevo evento</h2>
      {mensaje && <div className="mb-4 text-red-600 font-semibold">{mensaje}</div>}

      {/* Formulario creación */}
      <form onSubmit={createEvent} className="mb-8 flex flex-col gap-4 border border-red-300 p-6 rounded-lg shadow-sm">
        
        <input
          name="nombre_evento"
          value={nuevoEvento.nombre_evento}
          onChange={handleInputChange}
          placeholder="Nombre evento"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          required
        />
        <select
          name="tipo_evento"
          value={nuevoEvento.tipo_evento}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          required
        >
          <option value="educativo">Educativo</option>
          <option value="empresarial">Empresarial</option>
          <option value="deportivo">Deportivo</option>
          <option value="artístico">Artístico</option>
        </select>
        <select
          name="modalidad"
          value={nuevoEvento.modalidad}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          required
        >
          <option value="virtual">Virtual</option>
          <option value="presencial">Presencial</option>
        </select>
        <input
          name="descripcion"
          value={nuevoEvento.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        <input
          name="ciudad"
          value={nuevoEvento.ciudad}
          onChange={handleInputChange}
          placeholder="Ciudad"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        <input
          name="direccion"
          value={nuevoEvento.direccion}
          onChange={handleInputChange}
          placeholder="Dirección o URL"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        <input
          name="telefono_contacto"
          value={nuevoEvento.telefono_contacto}
          onChange={handleInputChange}
          placeholder="Teléfono contacto"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        <input
          name="requisitos"
          value={nuevoEvento.requisitos}
          onChange={handleInputChange}
          placeholder="Requisitos"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        <input
          name="cupo_maximo"
          value={nuevoEvento.cupo_maximo}
          onChange={handleInputChange}
          placeholder="Cupo máximo"
          type="number"
          min="1"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          required
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
        >
          Crear Evento
        </button>
      </form>

      {/* Lista y edición */}
      
      <ul className="space-y-6">
      <h2 className="text-center font-bold mt-40 mb-8 text-red-500 text-2xl sm:text-3xl md:text-4xl
      ">Eventos registrados</h2>
        {events.map((evt) => (
          
          <li key={evt.id} className="border border-red-300 rounded-lg p-5 shadow-sm bg-white">
            {editId === evt.id ? (
              <>
                <input
                  name="nombre_evento"
                  value={editForm.nombre_evento}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  
                />
                <input
                  name="descripcion"
                  value={editForm.descripcion}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Descripción"
                />

                <select
                  name="tipo_evento"
                  value={editForm.tipo_evento}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                >
                  <option value="educativo">Educativo</option>
                  <option value="empresarial">Empresarial</option>
                  <option value="deportivo">Deportivo</option>
                  <option value="artístico">Artístico</option>
                </select>

                <select
                  name="modalidad"
                  value={editForm.modalidad}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                >
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                </select>

                <input
                  name="ciudad"
                  value={editForm.ciudad}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Ciudad"
                />

                <input
                  name="direccion"
                  value={editForm.direccion}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Dirección o URL"
                />

                <input
                  name="telefono_contacto"
                  value={editForm.telefono_contacto}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Teléfono de contacto"
                />

                <input
                  name="requisitos"
                  value={editForm.requisitos}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Requisitos"
                />

                <input
                  name="cupo_maximo"
                  type="number"
                  value={editForm.cupo_maximo}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded-md mb-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                  placeholder="Cupo máximo"
                  min="0"
                />

                <button
                  onClick={saveEdit}
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 mr-2 transition"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 rounded px-4 py-2 transition"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h3 className="text-left font-bold mt-8 mb-8 text-red-500 text-2xl sm:text-3xl md:text-3xl">{evt.nombre_evento}</h3>
                <p>Tipo: {evt.tipo_evento}</p>
                <p>Modalidad: {evt.modalidad}</p>
                <p>Descripción: {evt.descripcion}</p>
                <p>Ciudad: {evt.ciudad}</p>
                <p>Dirección: {evt.direccion}</p>
                <p>Teléfono contacto: {evt.telefono_contacto}</p>
                <p>Requisitos: {evt.requisitos}</p>
                <p>Cupo máximo: {evt.cupo_maximo}</p>
                <p>Cupo actual: {evt.cupo_actual}</p>
                <div className="mt-3">
                  <button
                    onClick={() => startEdit(evt)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-3 transition"
                  >
                    Editar     
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 mt-10 mb-30 rounded transition"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      

      {/* Carga masiva */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-center font-bold mt-40 mb-8 text-red-500 text-2xl sm:text-3xl md:text-4xl
        ">Carga masiva de eventos</h2>
        <input
  type="file"
  accept=".xlsx"
  onChange={handleFileChange}
  className="block mx-auto mb-3"
/>
<div className="flex justify-center">
  <button
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 mt-10 mb-30 rounded transition"
    onClick={uploadExcel}
  >
    Cargar Excel
  </button>
</div>

      </div>
    </div>
    
  );

};


export default OrganizadorEvents;





