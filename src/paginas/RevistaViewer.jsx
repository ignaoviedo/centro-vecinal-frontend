import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // backend local

const RevistaViewer = () => {
  const [revistas, setRevistas] = useState([]);

  useEffect(() => {
    const fetchRevistas = async () => {
      try {
        const res = await axios.get(`${API_URL}/revistas`);
        console.log("📌 Respuesta del backend:", res.data);

        const revistasArray = Array.isArray(res.data.body) ? res.data.body : [];
        console.log("📌 Revistas extraídas:", revistasArray);

        setRevistas(revistasArray);
      } catch (error) {
        console.error("❌ Error al traer revistas:", error);
      }
    };
    fetchRevistas();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Revistas del Barrio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revistas.map((revista) => (
          <div
            key={revista.id}
            className="p-4 border rounded-lg shadow bg-white"
          >
            <h3 className="text-xl font-semibold capitalize">{revista.mes}</h3>
            <p className="text-gray-600">{revista.descripcion}</p>

            {/* Cargar imágenes */}
            <div className="mt-4 space-y-2">
              {[...Array(10)].map((_, i) => {
                const num = i + 1;
                const imgUrl = `${API_URL.replace("/api", "")}${
                  revista.paginas_carpeta
                }/${num}_${revista.mes}_pages-to-jpg-000${num}.jpg`;
                console.log("📌 URL de imagen generada:", imgUrl);

                return (
                  <img
                    key={num}
                    src={imgUrl}
                    alt={`Página ${num} de ${revista.mes}`}
                    className="w-full rounded shadow"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevistaViewer;
