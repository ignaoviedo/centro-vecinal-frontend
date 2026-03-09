import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../../config";

function Novedades() {
  const [loading, setLoading] = useState(true);
  const [novedades, setNovedades] = useState([]);
  const navigate = useNavigate();

  const cargarNovedades = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/novedades`);

      if (respuesta.status === 200 && respuesta.data?.body) {
        setNovedades(respuesta.data.body);
      } else {
        console.error("Error en la estructura de la respuesta");
        setNovedades([]);
      }
    } catch (error) {
      console.error("Error al cargar novedades", error);
      setNovedades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNovedades();
  }, []);

  const borrarNovedad = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        await axios.delete(`${API_URL}/novedades/${id}`);
        await cargarNovedades();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Novedad eliminada correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al borrar novedad", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al intentar borrar la novedad.",
        });
      }
    }
  };

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#0059b3] rounded-2xl border border-white/20 p-6 sm:p-10 w-full max-w-6xl shadow-xl backdrop-blur-md">
        <h2 className="text-center mb-6 sm:mb-8 text-2xl font-bold text-white">
          GESTOR DE NOVEDADES
        </h2>

        <div className="flex justify-end mb-6">
          <button
            className="text-white px-4 py-2 bg-[#002c73] hover:bg-[#002c73]/90 rounded-lg font-semibold shadow-md flex items-center gap-2"
            onClick={() => navigate("/adminpanel/formnovedad")}
            title="Agregar nueva novedad"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 mt-6 text-center text-white bg-orange-500 rounded-md font-medium">
              Cargando novedades...
            </div>
          ) : (
            <table className="min-w-full text-sm divide-y divide-white/20 text-white">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Título
                  </th>
                  {/* <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Descripción
                  </th> */}
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {novedades.length > 0 ? (
                  novedades.map((novedad) => (
                    <tr
                      className="hover:bg-white/10 transition"
                      key={novedad.id}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        {novedad.imagen_url ? (
                          <img
                            src={novedad.imagen_url}
                            alt={novedad.titulo}
                            className="h-16 w-16 object-cover rounded-lg border border-white/20"
                          />
                        ) : (
                          <span className="italic text-white/60">
                            Sin imagen
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {novedad.titulo}
                      </td>
                      {/* <td className="px-4 py-4">{novedad.descripcion}</td> */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          className="text-white p-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => borrarNovedad(novedad.id)}
                          title="Borrar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-white/60">
                      No hay novedades cargadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Novedades;
