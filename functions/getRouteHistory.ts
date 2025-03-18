import { PASSWORD, TRACCAR_URL, USERNAME } from "@/envConfig";
import { TraccarPosition } from "@/utils/interfaces";
import { LatLng } from "react-native-maps";

export const getRouteHistory = async (
    deviceId: string,
    setRouteCoordinates: (coordinates: LatLng[]) => void
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${TRACCAR_URL}/api/positions?deviceId=${deviceId}`,
        {
          headers: {
            Authorization: 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`),
          },
        }
      );
      if (response.ok) {
        const positions: TraccarPosition[] = await response.json();
        console.log('Ruta recibida:', positions);
        const coordinates: LatLng[] = positions.map(pos => ({
          latitude: pos.latitude,
          longitude: pos.longitude,
        }));
        setRouteCoordinates(coordinates);
      } else {
        const errorText = await response.text();
        console.error(`Error en getRouteHistory: ${response.status} - ${errorText}`);
        setRouteCoordinates([]);
      }
    } catch (error) {
      console.error("Error fetching route history:", error);
      setRouteCoordinates([]);
    }
  };