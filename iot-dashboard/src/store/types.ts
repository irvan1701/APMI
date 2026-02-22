export interface SensorReading {
  timestamp: number;
  temperature: number;
  humidity: number;
}

export interface DeviceNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  lastUpdate: number;
  history: SensorReading[];
}

export interface AppState {
  devices: DeviceNode[];
  darkMode: boolean;
}
