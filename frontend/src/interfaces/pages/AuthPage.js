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
    <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6">
      {/* Título afuera del cuadro */}
      <div className="mb-40 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-6xl font-extrabold text-white">

          Bienvenido a nuestra   
        </h1>
        <h1 className="text-4xl sm:text-6xl md:text-6xl font-extrabold text-white">

          Central de Eventos   
        </h1>
        <p className="text-gray-600 mt-2 max-w-md"></p>
      </div>
       

      {/* Cuadro blanco con el formulario */}
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-5 w-[370px]">
        <div className="flex mb-4 justify-center gap-4">
          <button
            onClick={() => cambiarModo("login")}
            className={`py-2 px-5 rounded-xl font-semibold text-lg transition ${
              modo === "login"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => cambiarModo("register")}
            className={`py-2 px-5 rounded-xl font-semibold text-lg transition ${
              modo === "register"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Regístrate
          </button>
        </div>
        
        {modo === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <h3 className="text-center font-bold mt-8 mb-8 text-red-500 text-2xl sm:text-3xl md:text-3xl">Acceso seguro</h3>
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
              className="bg-red-500 hover:bg-red-600 text-white text-xl px-5 py-2 mt-10 mb-30 rounded-xl transition"

            >
              Iniciar sesión
            </button>
            
            <div className="mb-1 text-center">
              <a href="http://localhost:3003/" className="hover:scale-110 transition" title="Ir al chat">
                <h1 className="text-4xl sm:text-6xl md:text-40xl font-extrabold text-red-500">
                  🗪
                </h1>
              </a>
            </div>


          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <h3 className="text-center font-bold mt-8 mb-8 text-red-500 text-2xl sm:text-3xl md:text-3xl">Registro</h3>

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

            {mensaje && <div className="text-center text-red-600">{mensaje}</div>}
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg transition font-bold"
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





