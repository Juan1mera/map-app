// functions/connectWebSocket.ts
import { LatLng } from 'react-native-maps';
import { Position } from '@/utils/interfaces';
import { Dispatch, SetStateAction } from 'react';

export const connectWebSocket = (
  setLastPosition: (position: Position | null) => void,
  setRouteCoordinates: Dispatch<SetStateAction<LatLng[]>> 
) => {
  const wsUrl = 'wss://demo.traccar.org/api/socket';
  
  // Crear la conexión WebSocket sin headers (React Native no lo soporta directamente)
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('Conexión WebSocket establecida');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Mensaje recibido del WebSocket:', data);

    if (data.positions && data.positions.length > 0) {
      const newPosition: Position = {
        latitude: data.positions[0].latitude,
        longitude: data.positions[0].longitude,
      };
      
      // Actualizar la última posición
      setLastPosition(newPosition);

      setRouteCoordinates((prevCoordinates: LatLng[]) => {
        const updatedCoordinates: LatLng[] = [
          ...prevCoordinates,
          { latitude: newPosition.latitude, longitude: newPosition.longitude },
        ];
        if (updatedCoordinates.length > 100) {
          updatedCoordinates.shift();
        }
        return updatedCoordinates;
      });
    }
  };

  socket.onerror = (error) => {
    console.error('Error en WebSocket:', error);
  };

  socket.onclose = (event) => {
    console.log('Conexión WebSocket cerrada:', event);
    // Intentar reconectar después de 2 segundos
    setTimeout(() => connectWebSocket(setLastPosition, setRouteCoordinates), 2000);
  };

  return () => {
    socket.close();
  };
};