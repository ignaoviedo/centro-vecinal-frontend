import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { API_URL } from "../config";

const Novedades = () => {
  const [novedades, setNovedades] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const novedadesPorPagina = 5;

  useEffect(() => {
    const cargarNovedades = async () => {
      try {
        const res = await axios.get(`${API_URL}/novedades`);
        // Ordena por fecha descendente
        const novedadesOrdenadas = res.data.body.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setNovedades(novedadesOrdenadas);
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      }
    };

    cargarNovedades();
  }, []);

  const indiceUltimaNovedad = paginaActual * novedadesPorPagina;
  const indicePrimeraNovedad = indiceUltimaNovedad - novedadesPorPagina;
  const novedadesPaginadas = novedades.slice(
    indicePrimeraNovedad,
    indiceUltimaNovedad
  );

  const totalPaginas = Math.ceil(novedades.length / novedadesPorPagina);

  const handlePagina = (num) => {
    if (num >= 1 && num <= totalPaginas) {
      setPaginaActual(num);
    }
  };

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#00527A] mb-6 text-center sm:text-left uppercase">
        Novedades
      </h1>

      {novedades.length === 0 ? (
        <p className="text-center">Cargando novedades...</p>
      ) : (
        <>
          <ul className="space-y-6 sm:space-y-8">
            {novedadesPaginadas.map(
              ({ id, titulo, descripcion, fecha, imagen_url }) => (
                <Link
                  to={`/novedades/${id}`}
                  key={id}
                  // className="block bg-white rounded-xl shadow-md flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 hover:shadow-xl transition-shadow hover:scale-[1.01] transition-transform"
                  className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md gap-4 sm:gap-6 p-4 sm:p-5 hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                  <img
                    src={imagen_url}
                    alt={titulo}
                    className="w-full sm:w-36 h-48 sm:h-24 object-cover rounded-md flex-shrink-0"
                  />

                  <div className="flex flex-col justify-between">
                    <h2 className="text-xl font-semibold text-[#00527A] mb-2">
                      {titulo}
                    </h2>
                    <p className="text-gray-700 line-clamp-3 mb-3">
                      {descripcion}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(fecha).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </Link>
              )
            )}
          </ul>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => handlePagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-4 py-1 border rounded disabled:opacity-50 hover:bg-[#00527A] hover:text-white transition"
            >
              Anterior
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePagina(i + 1)}
                className={`px-4 py-1 border rounded ${
                  paginaActual === i + 1
                    ? "bg-[#00527A] text-white"
                    : "hover:bg-gray-200"
                } transition`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-1 border rounded disabled:opacity-50 hover:bg-[#00527A] hover:text-white transition"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Novedades;
