import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const RevistaDetalle = () => {
  const { id } = useParams();
  const [revista, setRevista] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevista = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/revistas/${id}`);
        const revistaData = data.body;

        if (!revistaData) {
          setError("Revista no encontrada");
          return;
        }

        setRevista(revistaData);
      } catch (err) {
        console.error("Error al cargar la revista:", err);
        setError("Error al cargar la revista");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRevista();
    else setError("ID inválido");
  }, [id]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      revista && prev < revista.imagenes.length - 1 ? prev + 1 : prev
    );
  };

  if (loading) return <p className="text-center py-10">Cargando revista...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!revista || !revista.imagenes || revista.imagenes.length === 0)
    return <p className="text-center py-10">No hay imágenes para mostrar.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-start">
      {/* <h1 className="text-xl sm:text-3xl font-bold text-[#00527A] mb-6 ml-2 sm:ml-10 font-sans">
        Revista Nuestro Barrio - Mes de{" "}
        {revista.mes.charAt(0).toUpperCase() + revista.mes.slice(1)}
      </h1> */}

      {/* 🔹 Página actual */}
      <div className="mb-4">
        <img
          src={`http://localhost:3000${revista.imagenes[currentPage]}`}
          alt={`Página ${currentPage + 1}`}
          className="w-full shadow-lg rounded-lg"
        />
      </div>

      {/* 🔹 Paginación */}
      <div className="flex justify-between items-center max-w-xs mx-auto mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="text-white font-semibold px-4 py-2 rounded disabled:opacity-50 bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#66a3ff]"
        >
          Anterior
        </button>
        <span>
           {currentPage + 1} / {revista.imagenes.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === revista.imagenes.length - 1}
          className="text-white font-semibold px-4 py-2 rounded disabled:opacity-50 bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#66a3ff]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default RevistaDetalle;
