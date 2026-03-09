import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../../config";

function MascotasGestor() {
  const [loading, setLoading] = useState(true);
  const [mascotas, setMascotas] = useState([]);
  const navigate = useNavigate();

  const cargarMascotas = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/mascotas`);

      if (respuesta.status === 200 && respuesta.data?.body) {
        setMascotas(respuesta.data.body);
      } else {
        console.error("Error en la estructura de la respuesta");
        setMascotas([]);
      }
    } catch (error) {
      console.error("Error al cargar mascotas", error);
      setMascotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const borrarMascota = async (id) => {
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
        await axios.delete(`${API_URL}/mascotas/${id}`);
        await cargarMascotas();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Mascota eliminada correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al borrar mascota", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al intentar borrar la mascota.",
        });
      }
    }
  };

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#0059b3] rounded-2xl border border-white/20 p-6 sm:p-10 w-full max-w-6xl shadow-xl backdrop-blur-md">
        <h2 className="text-center mb-6 sm:mb-8 text-2xl font-bold text-white">
          GESTOR DE MASCOTAS
        </h2>

        <div className="flex justify-end mb-6">
          <button
            className="text-white px-4 py-2 bg-[#002c73] hover:bg-[#002c73]/90 rounded-lg font-semibold shadow-md flex items-center gap-2"
            onClick={() => navigate("/mascotas/formulario")}
            title="Agregar nueva mascota"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 mt-6 text-center text-white bg-orange-500 rounded-md font-medium">
              Cargando mascotas...
            </div>
          ) : (
            <table className="min-w-full text-sm divide-y divide-white/20 text-white">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {mascotas.length > 0 ? (
                  mascotas.map((mascota) => (
                    <tr className="hover:bg-white/10 transition" key={mascota.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {mascota.imagen_url ? (
                          <img
                            src={mascota.imagen_url}
                            alt={mascota.nombre}
                            className="h-16 w-16 object-cover rounded-lg border border-white/20"
                          />
                        ) : (
                          <span className="italic text-white/60">
                            Sin imagen
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold">{mascota.nombre}</td>
                      <td className="px-4 py-4">{mascota.tipo}</td>
                      <td className="px-4 py-4">
                        {mascota.contacto_nombre} - {mascota.contacto_telefono}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          className="text-white p-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => borrarMascota(mascota.id)}
                          title="Borrar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-white/60">
                      No hay mascotas cargadas
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

export default MascotasGestor;
