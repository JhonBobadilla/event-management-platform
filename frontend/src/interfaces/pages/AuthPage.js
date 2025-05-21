import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ modoInicial }) => {
  const [modo, setModo] = useState(modoInicial || "login"); // "login" o "register"
  const [rol, setRol] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const limpiarCampos = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setNumeroDocumento("");
    setPassword("");
    setRol("usuario");
    setMensaje("");
  };

  useEffect(() => {
    if (location.pathname.includes("register")) {
      setModo("register");
    } else {
      setModo("login");
    }
    limpiarCampos();
  }, [location.pathname]);

  const cambiarModo = (nuevoModo) => {
    if (nuevoModo === "login") {
      navigate("/auth/login");
    } else {
      navigate("/auth/register");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        correo,
        password,
      });

      if (response.data && response.data.token && response.data.user && response.data.user.rol) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rol", response.data.user.rol);

        if (response.data.user.rol === "organizador") {
          navigate("/organizador/dashboard");
        } else if (response.data.user.rol === "usuario") {
          navigate("/usuario/dashboard");
        } else {
          setMensaje("Rol no permitido");
        }
      } else {
        setMensaje("Credenciales incorrectas");
      }
    } catch (error) {
      setMensaje("Credenciales incorrectas");
    }
  };

    const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
        const response = await axios.post("http://localhost:3000/api/users/register", {
        nombre,
        correo,
        telefono,
        numero_documento: numeroDocumento,
        password,
        rol: rol.trim().toLowerCase(),
        });

        console.log("Respuesta registro:", response.data);

        // Detecta éxito si hay mensaje de confirmación y usuario creado
        if (response.data && response.data.message === "Usuario creado correctamente" && response.data.user) {
        setMensaje("¡Registro exitoso! Ya puedes iniciar sesión.");
        setTimeout(() => {
            navigate("/auth/login");
            limpiarCampos();
        }, 1500);
        } else {
        setMensaje("Hubo un error al registrarse.");
        }
    } catch (error) {
        setMensaje(error.response?.data?.message || "Hubo un error al registrarse.");
    }
    };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-5 w-[370px]">
        <div className="flex mb-4 justify-center gap-4">
          <button
            onClick={() => cambiarModo("login")}
            className={`py-2 px-5 rounded-xl font-semibold text-lg transition ${
              modo === "login"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => cambiarModo("register")}
            className={`py-2 px-5 rounded-xl font-semibold text-lg transition ${
              modo === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Registrarse
          </button>
        </div>

        {modo === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h2>
            <input
              type="email"
              className="border p-3 rounded-xl"
              placeholder="Correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <input
              type="password"
              className="border p-3 rounded-xl"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {mensaje && <div className="text-red-600 text-center">{mensaje}</div>}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg transition"
            >
              Iniciar sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Registro</h2>

            <label className="mb-2 font-semibold text-gray-700">Selecciona tu rol</label>
            <select
              className="border p-3 rounded-xl"
              value={rol}
              onChange={e => setRol(e.target.value)}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="organizador">Organizador</option>
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              className="border p-3 rounded-xl"
              placeholder="Correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <input
              className="border p-3 rounded-xl"
              placeholder="Teléfono"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              required
            />
            <input
              className="border p-3 rounded-xl"
              placeholder="Número de documento"
              value={numeroDocumento}
              onChange={e => setNumeroDocumento(e.target.value)}
              required
            />
            <input
              type="password"
              className="border p-3 rounded-xl"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            {mensaje && <div className="text-center text-blue-600">{mensaje}</div>}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition"
            >
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;



