import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useApp } from '../store/AppContext';
import { isOnline } from '../store/data';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function MapBoundsUpdater() {
  const { devices } = useApp();
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && devices.length > 0) {
      const bounds = devices.map(d => [d.latitude, d.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      initialized.current = true;
    }
  }, [devices, map]);

  return null;
}

export default function MapView() {
  const { devices } = useApp();

  const center: [number, number] = [
    devices.reduce((s, d) => s + d.latitude, 0) / devices.length,
    devices.reduce((s, d) => s + d.longitude, 0) / devices.length,
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary-500" />
              Map View
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Geographic overview of all IoT nodes
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Online
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Offline
            </span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={16}
          className="h-full w-full z-0"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBoundsUpdater />

          {devices.map(device => {
            const online = isOnline(device.lastUpdate);
            return (
              <CircleMarker
                key={device.id}
                center={[device.latitude, device.longitude]}
                radius={12}
                pathOptions={{
                  color: online ? '#10b981' : '#ef4444',
                  fillColor: online ? '#10b981' : '#ef4444',
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="min-w-[200px] p-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-mono text-gray-500">{device.id}</p>
                        <p className="text-sm font-bold text-gray-900">{device.name}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          online
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-amber-500">🌡</span>
                        <span className="font-semibold">{device.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-sky-500">💧</span>
                        <span className="font-semibold">{device.humidity}%</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                      Last update: {new Date(device.lastUpdate).toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
