import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">¿Quién eres?</h2>
        {/* Si quieres, puedes dejar los botones de roles aquí solo visuales */}
        {/* <div className="flex gap-8 mb-6">
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            disabled
          >
            Organizador
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            disabled
          >
            Usuario
          </button>
        </div> */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition mt-8"
          onClick={() => navigate("/auth")}
        >
          Iniciar sesión / Registrarse
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

