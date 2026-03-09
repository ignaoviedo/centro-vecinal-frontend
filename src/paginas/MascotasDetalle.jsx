import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ImgAdoptar from "../imagenes/imgAccesos/adopcion.png";
import ImgDonar from "../imagenes/imgAccesos/donar.png";
import { API_URL } from "../config";

const MascotaDetalle = () => {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);

  useEffect(() => {
    const obtenerMascota = async () => {
      try {
        const res = await axios.get(`${API_URL}/mascotas/${id}`);
        setMascota(res.data.body);
      } catch (error) {
        console.error("Error al obtener la mascota:", error);
      }
    };
    obtenerMascota();
  }, [id]);

  if (!mascota) return <p className="text-center mt-10">Cargando mascota...</p>;

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <>
      <h2 className="text-3xl font-bold text-[#002c73] text-start mb-10 uppercase px-4">
        Portal Mascotas
      </h2>
      <p className="mb-6 text-gray-900 text-base md:text-lg leading-relaxed mx-[5%] italic text-justify font-semibold">
        Si encontrás una mascota perdida en el barrio, acercate al Centro
        Vecinal o contactá a algún miembro de la comisión. De esta manera
        podremos asegurarnos de que el animal vuelva a su hogar de manera rápida
        y segura, en caso de no tener dueño, nos encargaremos de buscarle un
        nuevo hogar seguro y responsable.
      </p>

      {/* Accesos principales arriba */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {/* Adoptar */}
          <Link
            to="/mascotas/formulario/adopcion"
            className="bg-white rounded-xl p-4 text-black 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-gray-50 transition
                 flex flex-row sm:flex-col items-center sm:justify-center 
                 text-left sm:text-center 
                 space-x-4 sm:space-x-0 sm:space-y-2 shadow-md"
          >
            <img
              src={ImgAdoptar}
              alt="Adoptar mascota"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-black sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold">Adoptar</div>
              <div className="text-sm">Dale un hogar a {mascota.nombre}</div>
            </div>
          </Link>

          {/* Donar */}
          <Link
            to="/mascotas/formulario/donacion"
            className="bg-gray-300 rounded-xl p-4 text-black 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-gray-400 transition
                 flex flex-row sm:flex-col items-center sm:justify-center 
                 text-left sm:text-center 
                 space-x-4 sm:space-x-0 sm:space-y-2 shadow-md"
          >
            <img
              src={ImgDonar}
              alt="Donar"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-white sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold">Donar</div>
              <div className="text-sm">Apoya a {mascota.nombre}</div>
            </div>
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 justify-center">
        {/* Contenido principal */}
        <div className="md:w-2/3 bg-white shadow-xl rounded-2xl p-6 md:p-8 animate-fade-in">
          {/* Nombre */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#002c73] mb-6 text-center leading-relaxed uppercase">
            {mascota.nombre || "Sin nombre"}
          </h1>

          {/* Imagen */}
          <div className="flex justify-center mb-6">
            <img
              src={mascota.imagen_url}
              alt={mascota.nombre || "Mascota"}
              className="w-full max-w-3xl h-auto rounded-xl shadow-md object-cover"
            />
          </div>

          {/* Información detallada */}
          <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
            <p>
              <strong>Tipo:</strong> {mascota.tipo}{" "}
              {mascota.raza && `(${mascota.raza})`}
            </p>
            <p>
              <strong>Sexo:</strong> {mascota.sexo}
            </p>
            <p>
              <strong>Tamaño:</strong> {mascota.tamano}
            </p>
            <p>
              <strong>Condición:</strong> {mascota.condicion}
            </p>
            <p>
              <strong>Ubicación:</strong> {mascota.lugar}
            </p>
            <p>
              <strong>Contacto:</strong> {mascota.contacto_nombre} -{" "}
              {mascota.contacto_telefono}
            </p>
          </div>

          {/* Botón para volver */}
          <div className="mt-10 text-center">
            <Link
              to="/mascotas"
              className="inline-block px-6 py-2 bg-gradient-to-b from-[#002c73] via-[#004c99] to-[#66a3ff] text-white rounded-full hover:bg-[#003f5c] transition"
            >
              Volver a Mascotas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MascotaDetalle;
