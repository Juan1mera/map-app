export interface Position {
  latitude: number;
  longitude: number;
}

export interface TraccarPosition {
  latitude: number;
  longitude: number;
  speed?: number;
  deviceId: number;
  [key: string]: any;
}