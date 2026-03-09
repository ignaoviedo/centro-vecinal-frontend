import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import axios from "axios";

import { API_URL } from "../../config";

const BannerAuspiciantes = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners/all`);

        if (res.status === 200 && res.data.body) {
          const auspiciantes = res.data.body.filter(
            (b) => b.tipo && b.tipo.trim().toLowerCase() === "auspiciantes"
          );
          setBanners(auspiciantes);
        }
      } catch (error) {
        console.error("Error al cargar banners de auspiciantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const BASE_IMG_URL = "http://localhost:3000";

  if (loading) {
    return <div>Cargando banners de auspiciantes...</div>;
  }

  if (banners.length === 0) {
    return <div>No hay banners de auspiciantes para mostrar</div>;
  }

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] h-52 sm:h-64 xl:h-80 2xl:h-96 -mt-6">
      <Carousel pauseOnHover>
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link?.trim() || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full block"
          >
            <div className="w-full h-full bg-white">
              <img
                src={banner.imagen_url}
                alt={banner.descripcion || "Auspiciantes"}
                className="w-full h-full object-cover"
              />
            </div>
          </a>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerAuspiciantes;
