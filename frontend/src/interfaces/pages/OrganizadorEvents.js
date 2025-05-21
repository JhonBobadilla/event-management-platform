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

  // cancela eventos reservados  

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Eventos del Organizador</h1>
      {mensaje && <div className="mb-4 text-red-600">{mensaje}</div>}

      {/* Formulario creación */}
      <form onSubmit={createEvent} className="mb-6 flex flex-col gap-3 border p-4 rounded">
        <h2 className="text-xl font-semibold">Crear nuevo evento</h2>
        <input
          name="nombre_evento"
          value={nuevoEvento.nombre_evento}
          onChange={handleInputChange}
          placeholder="Nombre evento"
          className="border p-2 rounded"
          required
        />
        <select
          name="tipo_evento"
          value={nuevoEvento.tipo_evento}
          onChange={handleInputChange}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />
        <input
          name="ciudad"
          value={nuevoEvento.ciudad}
          onChange={handleInputChange}
          placeholder="Ciudad"
          className="border p-2 rounded"
        />
        <input
          name="direccion"
          value={nuevoEvento.direccion}
          onChange={handleInputChange}
          placeholder="Dirección o URL"
          className="border p-2 rounded"
        />
        <input
          name="telefono_contacto"
          value={nuevoEvento.telefono_contacto}
          onChange={handleInputChange}
          placeholder="Teléfono contacto"
          className="border p-2 rounded"
        />
        <input
          name="requisitos"
          value={nuevoEvento.requisitos}
          onChange={handleInputChange}
          placeholder="Requisitos"
          className="border p-2 rounded"
        />
        <input
          name="cupo_maximo"
          value={nuevoEvento.cupo_maximo}
          onChange={handleInputChange}
          placeholder="Cupo máximo"
          type="number"
          min="1"
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded mt-2 hover:bg-green-700"
        >
          Crear Evento
        </button>
      </form>

      {/* Lista y edición */}
      <ul>
        {events.map((evt) => (
          <li key={evt.id} className="border p-3 rounded mb-3">
            {editId === evt.id ? (
              <>
                <input
                  name="nombre_evento"
                  value={editForm.nombre_evento}
                  onChange={handleEditChange}
                  className="border p-1 rounded mb-1 w-full"
                />
                <input
                    name="descripcion"
                    value={editForm.descripcion}
                    onChange={handleEditChange}
                    className="border p-1 rounded mb-1 w-full"
                    placeholder="Descripción"
                    />

                <select
  name="tipo_evento"
  value={editForm.tipo_evento}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
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
  className="border p-1 rounded mb-1 w-full"
>
  <option value="virtual">Virtual</option>
  <option value="presencial">Presencial</option>
</select>

<input
  name="ciudad"
  value={editForm.ciudad}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
  placeholder="Ciudad"
/>

<input
  name="direccion"
  value={editForm.direccion}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
  placeholder="Dirección o URL"
/>

<input
  name="telefono_contacto"
  value={editForm.telefono_contacto}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
  placeholder="Teléfono de contacto"
/>

<input
  name="requisitos"
  value={editForm.requisitos}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
  placeholder="Requisitos"
/>

<input
  name="cupo_maximo"
  type="number"
  value={editForm.cupo_maximo}
  onChange={handleEditChange}
  className="border p-1 rounded mb-1 w-full"
  placeholder="Cupo máximo"
  min="0"
/>
    
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 text-white rounded px-3 py-1 mr-2"
                >
                  Guardar
                </button>
                <button onClick={cancelEdit} className="bg-gray-400 rounded px-3 py-1">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{evt.nombre_evento}</h3>
                <p>Tipo: {evt.tipo_evento}</p>
                <p>Modalidad: {evt.modalidad}</p>
                <p>Descripción: {evt.descripcion}</p>
                <p>Ciudad: {evt.ciudad}</p>
                <p>Dirección: {evt.direccion}</p>
                <p>Teléfono contacto: {evt.telefono_contacto}</p>
                <p>Requisitos: {evt.requisitos}</p>
                <p>Cupo máximo: {evt.cupo_maximo}</p>
                <p>Cupo actual: {evt.cupo_actual}</p>
                <div className="mt-2">
                  <button
                    onClick={() => startEdit(evt)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
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
      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold mb-2">Carga masiva de eventos (Excel)</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button
          onClick={uploadExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
        >
          Cargar Excel
        </button>
      </div>
    </div>
  );
};

export default OrganizadorEvents;




