// src/components/AdopcionesList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/api";

const AdopcionesList = () => {
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const cargarAdopciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/adopciones`);
      setAdopciones(res.data.body || []);
    } catch (error) {
      console.error("Error al cargar adopciones:", error);
      setAdopciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAdopciones();
  }, []);

  const borrarAdopcion = async (id) => {
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
        await axios.delete(`${API_URL}/adopciones/${id}`);
        cargarAdopciones();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Adopción eliminada correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al borrar adopción", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la adopción",
        });
      }
    }
  };

  // Paginación
  const totalPages = Math.ceil(adopciones.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdopciones = adopciones.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <p className="text-white">Cargando adopciones...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#0059b3] rounded-2xl border border-white/20 p-6 sm:p-10 w-full max-w-6xl shadow-xl backdrop-blur-md">
        <h2 className="text-center mb-6 sm:mb-8 text-2xl font-bold text-white">
          LISTADO DE ADOPCIONES
        </h2>

        <div className="overflow-x-auto">
          {currentAdopciones.length === 0 ? (
            <p className="text-center text-white/60">
              No hay adopciones registradas
            </p>
          ) : (
            <table className="min-w-full text-white text-sm divide-y divide-white/20">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-4 py-3 text-left uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {currentAdopciones.map((a) => (
                  <tr className="hover:bg-white/10 transition" key={a.id}>
                    <td className="px-4 py-4 font-semibold">{a.nombre}</td>
                    <td className="px-4 py-4">{a.telefono}</td>
                    <td className="px-4 py-4">{a.direccion}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className="text-white p-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => borrarAdopcion(a.id)}
                        title="Borrar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Paginación */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 bg-[#002c73] text-white rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-[#002c73] text-white rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdopcionesList;
