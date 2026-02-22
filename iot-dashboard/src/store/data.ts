import { DeviceNode, SensorReading } from './types';

function generateHistory(baseTemp: number, baseHumidity: number): SensorReading[] {
  const history: SensorReading[] = [];
  const now = Date.now();
  for (let i = 96; i >= 0; i--) {
    const timestamp = now - i * 15 * 60 * 1000; // every 15 min for 24h
    history.push({
      timestamp,
      temperature: +(baseTemp + (Math.random() - 0.5) * 4).toFixed(1),
      humidity: +(baseHumidity + (Math.random() - 0.5) * 10).toFixed(1),
    });
  }
  return history;
}

export const initialDevices: DeviceNode[] = [
  {
    id: 'NODE-001',
    name: 'Gedung Utama',
    latitude: -6.3675,
    longitude: 106.6942,
    temperature: 28.5,
    humidity: 72.3,
    lastUpdate: Date.now(),
    history: generateHistory(28.5, 72),
  },
  {
    id: 'NODE-002',
    name: 'Gedung Produksi A',
    latitude: -6.3680,
    longitude: 106.6950,
    temperature: 31.2,
    humidity: 65.8,
    lastUpdate: Date.now(),
    history: generateHistory(31, 66),
  },
  {
    id: 'NODE-003',
    name: 'Gedung Produksi B',
    latitude: -6.3672,
    longitude: 106.6958,
    temperature: 29.8,
    humidity: 68.1,
    lastUpdate: Date.now(),
    history: generateHistory(30, 68),
  },
  {
    id: 'NODE-004',
    name: 'Gudang Material',
    latitude: -6.3690,
    longitude: 106.6935,
    temperature: 33.1,
    humidity: 58.4,
    lastUpdate: Date.now(),
    history: generateHistory(33, 58),
  },
  {
    id: 'NODE-005',
    name: 'Kantor Administrasi',
    latitude: -6.3668,
    longitude: 106.6945,
    temperature: 24.6,
    humidity: 55.2,
    lastUpdate: Date.now(),
    history: generateHistory(24.5, 55),
  },
  {
    id: 'NODE-006',
    name: 'Pos Keamanan',
    latitude: -6.3695,
    longitude: 106.6940,
    temperature: 30.4,
    humidity: 70.9,
    lastUpdate: Date.now() - 8 * 60 * 1000, // Offline: 8 min ago
    history: generateHistory(30, 71),
  },
  {
    id: 'NODE-007',
    name: 'Ruang Server',
    latitude: -6.3678,
    longitude: 106.6962,
    temperature: 21.3,
    humidity: 45.6,
    lastUpdate: Date.now(),
    history: generateHistory(21, 46),
  },
  {
    id: 'NODE-008',
    name: 'Workshop Teknik',
    latitude: -6.3685,
    longitude: 106.6955,
    temperature: 32.7,
    humidity: 62.3,
    lastUpdate: Date.now() - 12 * 60 * 1000, // Offline: 12 min ago
    history: generateHistory(32.5, 62),
  },
  {
    id: 'NODE-009',
    name: 'Laboratorium QC',
    latitude: -6.3670,
    longitude: 106.6952,
    temperature: 22.8,
    humidity: 50.1,
    lastUpdate: Date.now(),
    history: generateHistory(23, 50),
  },
  {
    id: 'NODE-010',
    name: 'Musholla & Kantin',
    latitude: -6.3692,
    longitude: 106.6948,
    temperature: 29.1,
    humidity: 67.5,
    lastUpdate: Date.now(),
    history: generateHistory(29, 67),
  },
];

export function isOnline(lastUpdate: number): boolean {
  return Date.now() - lastUpdate < 5 * 60 * 1000;
}

export function simulateUpdate(device: DeviceNode): DeviceNode {
  // 15% chance a device goes "offline" (stops updating)
  const goesOffline = Math.random() < 0.03;
  const now = Date.now();

  const newTemp = +(device.temperature + (Math.random() - 0.5) * 1.2).toFixed(1);
  const newHumidity = +(Math.min(100, Math.max(20, device.humidity + (Math.random() - 0.5) * 3))).toFixed(1);

  const newReading: SensorReading = {
    timestamp: now,
    temperature: newTemp,
    humidity: newHumidity,
  };

  return {
    ...device,
    temperature: newTemp,
    humidity: newHumidity,
    lastUpdate: goesOffline ? device.lastUpdate : now,
    history: [...device.history.slice(-95), newReading],
  };
}
