import { TRACCAR_URL, USERNAME, PASSWORD } from "@/envConfig";
import { Position, TraccarPosition } from "@/utils/interfaces";
import { Region } from "react-native-maps";


export const getLastPosition = async (
    deviceId: string,
    setLastPosition: (position: Position | null) => void,
    setRegion?: (region: Region) => void
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
        console.log('Posiciones recibidas:', positions);
        if (positions.length > 0) {
          const latest = positions[positions.length - 1];
          const newPosition: Position = {
            latitude: latest.latitude,
            longitude: latest.longitude,
          };
          setLastPosition(newPosition);
          if (setRegion) {
            setRegion({
              latitude: latest.latitude,
              longitude: latest.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        } else {
          setLastPosition(null);
          console.log('No hay posiciones disponibles para el dispositivo:', deviceId);
        }
      } else {
        const errorText = await response.text();
        console.error(`Error en getLastPosition: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching last position:", error);
    }
  };