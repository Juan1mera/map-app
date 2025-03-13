import { Image, StyleSheet, Platform, View } from 'react-native';
import { useState } from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // Estado para la región inicial del mapa
  const [region, setRegion] = useState({
    latitude: 37.78825, // Latitud inicial (ejemplo: San Francisco)
    longitude: -122.4324, // Longitud inicial
    latitudeDelta: 0.0922, // Nivel de zoom (vertical)
    longitudeDelta: 0.0421, // Nivel de zoom (horizontal)
  });

  // Coordenadas para dibujar una ruta simple
  const routeCoordinates = [
    { latitude: 37.78825, longitude: -122.4324 }, // Punto de inicio
    { latitude: 37.78600, longitude: -122.4224 }, // Zig: hacia la derecha
    { latitude: 37.78200, longitude: -122.4324 }, // Zag: hacia la izquierda
    { latitude: 37.77800, longitude: -122.4224 }, // Zig: hacia la derecha otra vez
    { latitude: 37.77400, longitude: -122.4324 }, // Zag: hacia la izquierda
    { latitude: 37.77000, longitude: -122.4224 }, // Zig: hacia la derecha
    { latitude: 37.76600, longitude: -122.4324 }, // Zag: hacia la izquierda
    { latitude: 37.76200, longitude: -122.4224 }, // Punto final con zig
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region} // Región inicial del mapa
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Actualiza la región al mover el mapa
      >
        {/* Marcadores en los puntos de inicio y fin */}
        <Marker coordinate={routeCoordinates[0]} title="Inicio" />
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Fin" />

        {/* Dibujar la ruta con Polyline */}
        <Polyline
          coordinates={routeCoordinates} // Lista de coordenadas para la ruta
          strokeColor="#FF0000"
          strokeWidth={2} 
        />
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