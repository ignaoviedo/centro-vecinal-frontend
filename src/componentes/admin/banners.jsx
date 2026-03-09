import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../../config";

function Banners() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [bannersPorPagina] = useState(5);
  const navigate = useNavigate();

  const cargarBanners = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/banners/all`);

      if (respuesta.status === 200 && respuesta.data?.body) {
        setBanners(respuesta.data.body);
      } else {
        console.error("Error en la estructura de la respuesta");
        setBanners([]);
      }
    } catch (error) {
      console.error("Error al cargar banners", error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBanners();
  }, []);

  const borrarBanner = async (id) => {
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
        await axios.delete(`${API_URL}/banners/${id}`);
        await cargarBanners();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Banner eliminado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al borrar banner", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al intentar borrar el banner.",
        });
      }
    }
  };

  // Paginación
  const indiceUltimoBanner = paginaActual * bannersPorPagina;
  const indicePrimerBanner = indiceUltimoBanner - bannersPorPagina;
  const bannersPaginados = banners.slice(
    indicePrimerBanner,
    indiceUltimoBanner
  );
  const totalPaginas = Math.ceil(banners.length / bannersPorPagina);

  const cambiarPagina = (numero) => {
    if (numero < 1) numero = 1;
    else if (numero > totalPaginas) numero = totalPaginas;
    setPaginaActual(numero);
  };

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#0059b3] rounded-2xl border border-white/20 p-6 sm:p-10 w-full max-w-6xl shadow-xl backdrop-blur-md">
        <h2 className="text-center mb-6 sm:mb-8 text-2xl font-bold text-white">
          GESTOR DE BANNERS
        </h2>

        <div className="flex justify-end mb-6">
          <button
            className="text-white px-4 py-2 bg-[#002c73] hover:bg-[#002c73]/90 rounded-lg font-semibold shadow-md flex items-center gap-2"
            onClick={() => navigate("/adminpanel/formbanner")}
            title="Agregar nuevo banner"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 mt-6 text-center text-white bg-orange-500 rounded-md font-medium">
              Cargando banners...
            </div>
          ) : (
            <table className="min-w-full text-sm divide-y divide-white/20 text-white">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Vista previa
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {bannersPaginados.length > 0 ? (
                  bannersPaginados.map((banner) => (
                    <tr
                      className="hover:bg-white/10 transition"
                      key={banner.id}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <img
                          src={banner.imagen_url}
                          alt={banner.descripcion}
                          className="h-16 w-48 object-cover rounded-lg border border-white/20"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white/90">
                        {banner.descripcion}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          className="text-white p-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => borrarBanner(banner.id)}
                          title="Borrar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-white/60">
                      No hay banners cargados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {banners.length > bannersPorPagina && (
          <div className="flex justify-center gap-3 mt-6 text-white">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className={`px-3 py-1 rounded-md ${
                paginaActual === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/20"
              }`}
            >
              Anterior
            </button>
            {[...Array(totalPaginas)].map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  onClick={() => cambiarPagina(num)}
                  className={`px-3 py-1 rounded-md ${
                    num === paginaActual ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                >
                  {num}
                </button>
              );
            })}
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className={`px-3 py-1 rounded-md ${
                paginaActual === totalPaginas
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/20"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Banners;
