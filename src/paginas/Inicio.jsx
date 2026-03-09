import React, { useEffect, useRef, useState } from "react";
import Banner from "../componentes/layout/Banner";
import BannerAuspiciantes from "../componentes/layout/BannerAuspiciantes";
import InfoActual from "../componentes/layout/InfoActual";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Carousel } from "flowbite-react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../config";
import ImgReclamo from "../imagenes/imgAccesos/reclamo.png";
//import ImgCamara from "../imagenes/imgAccesos/camara.png";
import ImgYouTube from "../imagenes/imgAccesos/youtube.png";
import ImgRevista from "../imagenes/imgAccesos/revista.png";
import ImgMpf from "../imagenes/imgAccesos/mpf.png";
import ImgRadio from "../imagenes/imgAccesos/radio.png";
import ImgMascota from "../imagenes/imgLogo/logoMascota.png";
import { FaPaperPlane } from "react-icons/fa";

const Inicio = () => {
  const [novedades, setNovedades] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [lightboxActive, setLightboxActive] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [chatMaximizado, setChatMaximizado] = useState(false);

  const limpiarChat = () => {
    setHistorial([{ from: "bot", text: "👋 ¡Hola! ¿En qué puedo ayudarte?" }]);
  };

  const [historial, setHistorial] = useState([
    { from: "bot", text: "👋 ¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const chatRef = useRef(null);

  // Preguntas frecuentes precargadas
  const preguntasFrecuentes = [
    "¿Cuál es la dirección del Centro Vecinal de Santa Isabel 2ª Sección?",
    "¿Qué actividades se realizan en el Centro Vecinal de Santa Isabel 2ª Sección?",
    "¿Cómo puedo participar en el Centro Vecinal de Santa Isabel 2ª Sección?",
    "¿Cuál es el horario de atención del Centro Vecinal?",
    "¿Qué servicios ofrece el Centro Vecinal?",
    "¿Cómo contactar al Centro Vecinal de Santa Isabel 2ª Sección?",
    "¿Qué beneficios tiene estar involucrado en el Centro Vecinal?",
  ];

  // Función para enviar pregunta frecuente como mensaje
  const enviarMensajeConTexto = async (texto) => {
    if (!texto.trim()) return;

    setHistorial((prev) => [...prev, { from: "user", text: texto }]);

    try {
      const response = await axios.post(`${API_URL}/ai/ask`, {
        question: texto,
      });

      const respuesta = response.data.answer;
      setHistorial((prev) => [...prev, { from: "bot", text: respuesta }]);
    } catch (error) {
      setHistorial((prev) => [
        ...prev,
        { from: "bot", text: "Error al conectar con el servidor" },
      ]);
    }

    setMensaje("");
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setHistorial((prev) => [...prev, { from: "user", text: mensaje }]);

    try {
      const response = await axios.post(`${API_URL}/ai/ask`, {
        question: mensaje,
      });

      const respuesta = response.data.answer;

      setHistorial((prev) => [...prev, { from: "bot", text: respuesta }]);
    } catch (error) {
      setHistorial((prev) => [
        ...prev,
        { from: "bot", text: "Error al conectar con el servidor" },
      ]);
    }

    setMensaje("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [historial]);

  // useEffect(() => {
  //   const cargarNovedades = async () => {
  //     try {
  //       //const res = await axios.get("http://localhost:3000/api/novedades");
  //       const res = await axios.get(`${API_URL}/novedades`);
  //       setNovedades(res.data.body);
  //     } catch (error) {
  //       console.error("Error al cargar novedades:", error);
  //     }
  //   };
  //   cargarNovedades();
  // }, []);

  useEffect(() => {
    const cargarNovedades = async () => {
      try {
        const res = await axios.get(`${API_URL}/novedades`);
        const novedadesOrdenadas = [...res.data.body].reverse(); // 🔄 invertimos ANTES
        setNovedades(novedadesOrdenadas);
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      }
    };
    cargarNovedades();
  }, []);

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

  useEffect(() => {
    const cargarImagenes = async () => {
      try {
        //const res = await axios.get("http://localhost:3000/api/imagenes");
        const res = await axios.get(`${API_URL}/imagenes`);
        setImagenes(res.data.body);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      }
    };
    cargarImagenes();
  }, []);

  // Función helper para agrupar en chunks
  const agruparTarjetas = (array, tamañoGrupo) => {
    const grupos = [];
    for (let i = 0; i < array.length; i += tamañoGrupo) {
      grupos.push(array.slice(i, i + tamañoGrupo));
    }
    return grupos;
  };

  // Función para definir cuántos items por slide según el ancho de pantalla
  const getItemsPerSlide = () => {
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 640) return 2; // Tablets
    return 1; // Mobile
  };

  // Estado para items por slide
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  // Escuchar cambios de tamaño de ventana
  useEffect(() => {
    const onResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Generar grupos responsivos
  const gruposTarjetas = React.useMemo(
    () => agruparTarjetas(novedades, itemsPerSlide),
    [novedades, itemsPerSlide]
  );

  const openLightbox = (imageSrc) => {
    setCurrentImage(imageSrc);
    setLightboxActive(true);
  };

  const closeLightbox = () => {
    setLightboxActive(false);
  };

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const BASE_IMG_URL = "http://localhost:3000";

  return (
    <div>
      <Banner />
      <InfoActual />

      {/* Flecha flotante para subir */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-4 sm:left-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
          aria-label="Subir al inicio"
        >
          <FaArrowUp size={20} />
        </button>
      )}

      {/* ACCESOS */}
      <section className="max-w-6xl mx-auto px-5 py-10 text-center">
        <h2 className="text-3xl font-black mb-10 text-[#00527A] text-center border-b-2 border-[#00527A] pb-4 pt-10 uppercase">
          Todos tus accesos, <span className="text-cyan-500">están acá.</span>
        </h2>

        {/* <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-8"> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center"> */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6 justify-items-center">
          <Link
            to="/reclamos"
            className="bg-[#00a8e6] rounded-xl p-4 text-white 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-[#008cc4] transition 
                 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2"
          >
            <img
              src={ImgReclamo}
              alt="Reclamos"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-white sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">
                Reclamos
              </div>
              <div className="text-sm">Denuncias o quejas</div>
            </div>
          </Link>

          <Link
            to="/revistas"
            className="bg-[#4CAF50] rounded-xl p-4 text-white 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-[#388E3C] transition 
                 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2"
          >
            <img
              src={ImgRevista}
              alt="Revista"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-white sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">
                Revista
              </div>
              <div className="text-sm">Nuestro Barrio</div>
            </div>
          </Link>
          
          <Link
            to="/mascotas"
            className="bg-white rounded-xl p-4 text-black
            w-11/12 h-28
            sm:w-44 sm:h-44
            hover:bg-gray-50 transition
            flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2"
          >
            <img
              src={ImgMascota}
              alt="Mascotas"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-black sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">
                Portal
              </div>
              <div className="text-sm">Mi Mascota</div>
            </div>
          </Link>

          <a
            href="https://denunciasmpf.mpfcordoba.gob.ar/publicpages/PortalDenuncias"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-300 hover:bg-gray-400 rounded-xl p-4 text-gray-800 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 transition flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2 shadow-md"
          >
            <img
              src={ImgMpf}
              alt="Ícono de denuncia"
              className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0"
            />
            <div className="pl-4 border-l border-black sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">
                Portal
              </div>
              <div className="text-sm">MPF</div>
            </div>
          </a>

          <Link
            to="/radio"
            className="bg-orange-500 rounded-xl p-4 text-white 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-orange-600 transition 
                 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2"
          >
            <img
              src={ImgRadio}
              alt="Radio en Vivo"
              className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
            />
            <div className="pl-4 border-l border-white sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">Radio</div>
              <div className="text-sm">En vivo</div>
            </div>
          </Link>

          <Link
            to="/camara/vivo"
            className="bg-[#e91e63] rounded-xl p-4 text-white 
                 w-11/12 h-28
                 sm:w-44 sm:h-44
                 hover:bg-[#d81b60] transition 
                 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center space-x-4 sm:space-x-0 sm:space-y-2"
          >
            <img
              src={ImgYouTube}
              alt="Cámara en Vivo"
              className="w-14 h-12 sm:w-16 sm:h-16 flex-shrink-0"
            />
            <div className="pl-4 border-l border-white sm:border-0 sm:pl-0 sm:mt-2">
              <div className="text-base font-semibold leading-tight">
                Transmisión en linea
              </div>
              <div className="text-sm">Ver de contenido</div>
            </div>
          </Link>
        </div>
      </section>

      {/* NOVEDADES */}

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-black text-[#00527A] text-center border-b-2 border-[#00527A] pt-10 uppercase">
          Novedades
        </h2>

        <div className="h-[35rem]">
          <Carousel
            pauseOnHover
            slide
            leftControl={
              <button className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 text-[#00527A]">
                <FaChevronLeft size={24} />
              </button>
            }
            rightControl={
              <button className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 text-[#00527A]">
                <FaChevronRight size={24} />
              </button>
            }
            className="rounded-lg"
          >
            {gruposTarjetas.length === 0 ? (
              <p>Cargando novedades...</p>
            ) : (
              gruposTarjetas.map((grupo, i) => (
                <div key={i} className="flex justify-start gap-6 px-4">
                  {grupo.map((novedad) => (
                    <Link
                      to={`/novedades/${novedad.id}`}
                      key={novedad.id}
                      className="block flex-shrink-0 w-80"
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all h-[28rem] flex flex-col">
                        <img
                          src={novedad.imagen_url}
                          alt={novedad.titulo}
                          className="object-cover w-full h-64"
                        />

                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold mb-2 text-[#00527A]">
                            {novedad.titulo}
                          </h3>
                          <p className="text-gray-600">{novedad.descripcion}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </Carousel>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="max-w-6xl mx-auto px-4 py-16" id="galeria">
        <h2 className="text-3xl font-black mb-8 text-[#00527A] text-center border-b-2 border-[#00527A] pb-4 uppercase">
          Galería
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {imagenes.map((img, index) => (
            <img
              key={index}
              src={img.imagen_url} // URL completa usando la constante
              alt={`Galería ${index + 1}`}
              className="w-full max-w-xs sm:max-w-none h-48 sm:h-64 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openLightbox(img.imagen_url)}
            />
          ))}
        </div>
      </section>

      {lightboxActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-6xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-2 right-2 text-white text-3xl font-bold z-50"
            >
              ×
            </button>
            <img
              src={currentImage}
              alt="Imagen ampliada"
              className="w-full max-h-[90vh] object-contain rounded shadow-lg"
            />
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-8 text-[#00527A] text-center border-b-2 border-[#00527A] pb-10 uppercase">
          Empresas que nos acompañan
        </h2>
        <BannerAuspiciantes />
      </section>

      {/* NÚMEROS ÚTILES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-8 text-[#00527A] text-center border-b-2 border-[#00527A] pb-4 uppercase">
          Números Útiles
        </h2>
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 w-full max-w-5xl">
            <a className="flex flex-col justify-start items-center gap-2 text-[#00527A] hover:scale-[1.02] focus:outline-none focus:ring-4 p-2 rounded-xl transition-all">
              <span className="text-xs font-semibold italic uppercase leading-7">
                Bomberos
              </span>
              <span className="font-black text-4xl sm:text-5xl leading-[72px] sm:leading-[84px]">
                100
              </span>
            </a>
            <a className="flex flex-col justify-start items-center gap-2 text-[#00527A] hover:scale-[1.02] focus:outline-none focus:ring-4 p-2 rounded-xl transition-all">
              <span className="text-xs font-semibold italic uppercase leading-7">
                Defensa Civil
              </span>
              <span className="font-black text-4xl sm:text-5xl leading-[72px] sm:leading-[84px]">
                103
              </span>
            </a>
            <a className="flex flex-col justify-start items-center gap-2 text-[#00527A] hover:scale-[1.02] focus:outline-none focus:ring-4 p-2 rounded-xl transition-all">
              <span className="text-xs font-semibold italic uppercase leading-7">
                Urgencias
              </span>
              <span className="font-black text-4xl sm:text-5xl leading-[72px] sm:leading-[84px]">
                107
              </span>
            </a>
            <a className="flex flex-col justify-start items-center gap-2 text-[#00527A] hover:scale-[1.02] focus:outline-none focus:ring-4 p-2 rounded-xl transition-all">
              <span className="text-xs font-semibold italic uppercase leading-7">
                Emergencias
              </span>
              <span className="font-black text-4xl sm:text-5xl leading-[72px] sm:leading-[84px]">
                911
              </span>
            </a>

            <a className="flex flex-col justify-start items-center gap-2 text-[#00527A] col-span-2 lg:col-auto hover:scale-[1.02] focus:outline-none focus:ring-4 p-2 rounded-xl transition-all">
              <span className="text-xs font-semibold italic uppercase leading-7">
                EPEC
              </span>
              <span className="font-black text-lg sm:text-2xl leading-[40px] sm:leading-[56px]">
                0800 777 0000
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* CHAT FLOTANTE */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => setMostrarChat(!mostrarChat)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg"
          aria-label="Abrir chat"
        >
          <i className="fas fa-comments"></i>
        </button>
      </div>

      {mostrarChat && (
        <div
          className={`fixed bottom-20 right-4 sm:right-6 bg-[#1f1f1f] text-white rounded-lg shadow-xl p-4 z-50 border border-blue-500 flex flex-col
          ${
            chatMaximizado
              ? "w-full max-w-[800px] h-[500px]"
              : "w-72 sm:w-80 h-auto"
          }`}
          style={{ maxHeight: chatMaximizado ? "500px" : "auto" }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-blue-300 uppercase">
              Asistente Virtual
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={limpiarChat}
                className="text-blue-300 hover:text-yellow-400"
                title="Limpiar chat"
              >
                <i className="fas fa-trash-alt"></i>
              </button>

              <button
                onClick={() => setChatMaximizado(!chatMaximizado)}
                className="text-blue-300 hover:text-green-500"
                title={chatMaximizado ? "Minimizar" : "Maximizar"}
              >
                <i
                  className={
                    chatMaximizado
                      ? "fas fa-window-restore"
                      : "fas fa-expand-arrows-alt"
                  }
                ></i>
              </button>

              <button
                onClick={() => setMostrarChat(false)}
                className="text-blue-300 hover:text-red-500"
                title="Cerrar chat"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div
            className="flex-grow overflow-y-auto bg-[#2b2b2b] p-2 rounded text-sm text-yellow-200 space-y-2"
            style={{ height: chatMaximizado ? "calc(100% - 128px)" : "15rem" }}
            ref={chatRef}
          >
            {/* Preguntas frecuentes */}
            <div className="mb-2 p-2 bg-[#333] rounded text-xs text-white leading-relaxed">
              <strong>PREGUNTAS FRECUENTES:</strong>
              <ul className="mt-1 max-h-24 overflow-y-auto space-y-2">
                {preguntasFrecuentes.map((pregunta, i) => (
                  <li
                    key={i}
                    onClick={() => enviarMensajeConTexto(pregunta)}
                    className="cursor-pointer hover:underline hover:text-blue-400"
                    title="Haz click para enviar esta pregunta"
                  >
                    {pregunta}
                  </li>
                ))}
              </ul>
            </div>

            {/* Historial de mensajes */}
            {historial.map((msg, i) => (
              <p
                key={i}
                className={
                  msg.from === "user" ? "text-right text-white" : "text-left"
                }
              >
                {msg.text}
              </p>
            ))}
          </div>

          <div className="relative mt-2 max-w-full">
            <textarea
              rows={2}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="w-full p-2 pr-12 rounded bg-[#1f1f1f] text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <button
              onClick={enviarMensaje}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center justify-center"
              aria-label="Enviar mensaje"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
