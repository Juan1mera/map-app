// HomeScreen.tsx
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Polyline, Marker, Region, LatLng } from 'react-native-maps';
import { Position } from '@/utils/interfaces';
import { getLastPosition } from '@/functions/getLastPosition';
import { getRouteHistory } from '@/functions/getRouteHistory';
import { getDevices } from '@/functions/getDevices';
import { connectWebSocket } from '@/functions/connectWebSocket';

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

  useEffect(() => {
    let cleanupWebSocket: (() => void) | undefined;

    const fetchData = async () => {
      // Autenticación inicial para establecer la cookie
      const authResponse = await fetch('https://demo.traccar.org/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=clienteApi2@equipoiot.com&password=clienteApi2',
      });

      if (authResponse.ok) {
        console.log('Sesión iniciada con éxito');
        const devices = await getDevices();
        if (devices.length > 0) {
          const deviceId = devices[0].id;
          console.log('Usando deviceId:', deviceId);
          await getLastPosition(deviceId, setLastPosition, setRegion);

          // Iniciar la conexión WebSocket
          cleanupWebSocket = connectWebSocket(setLastPosition, setRouteCoordinates);
        } else {
          console.log('No se encontraron dispositivos disponibles.');
        }
      } else {
        console.error('Error al iniciar sesión:', authResponse.status);
      }
    };

    fetchData();

    return () => {
      if (cleanupWebSocket) {
        cleanupWebSocket();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion: Region) => setRegion(newRegion)}
      >
        {lastPosition && (
          <Marker
            coordinate={lastPosition}
            title="Última Ubicación"
            pinColor="red"
          />
        )}
        {routeCoordinates.length > 1 && (
          <>
            <Marker coordinate={routeCoordinates[0]} title="Inicio" />
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Fin" />
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF0000"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});