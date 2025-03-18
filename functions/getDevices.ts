import { TRACCAR_URL, USERNAME, PASSWORD } from "@/envConfig";

interface Device {
  id: string;
  name: string;
  [key: string]: any; 
}

export const getDevices = async (): Promise<Device[]> => {
  try {
    const url = `${TRACCAR_URL}/api/devices`;
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`),
      },
    });
    if (response.ok) {
      const devices: Device[] = await response.json();
      console.log('Dispositivos obtenidos:', devices);
      return devices;
    } else {
      const errorText = await response.text();
      console.error(`Error en getDevices: ${response.status} - ${errorText}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
};