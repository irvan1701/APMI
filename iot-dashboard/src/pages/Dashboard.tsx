import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { isOnline } from '../store/data';
import {
  Thermometer,
  Droplets,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function timeSince(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function Dashboard() {
  const { devices } = useApp();
  const navigate = useNavigate();

  const onlineDevices = devices.filter(d => isOnline(d.lastUpdate));
  const offlineDevices = devices.filter(d => !isOnline(d.lastUpdate));
  const avgTemp = +(devices.reduce((s, d) => s + d.temperature, 0) / devices.length).toFixed(1);
  const avgHumidity = +(devices.reduce((s, d) => s + d.humidity, 0) / devices.length).toFixed(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Real-time monitoring for Perumahan Peruri IoT network
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Nodes"
          value={devices.length}
          icon={<Activity className="w-5 h-5" />}
          color="primary"
        />
        <SummaryCard
          label="Online"
          value={onlineDevices.length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
        />
        <SummaryCard
          label="Avg Temperature"
          value={`${avgTemp}°C`}
          icon={<Thermometer className="w-5 h-5" />}
          color="amber"
        />
        <SummaryCard
          label="Avg Humidity"
          value={`${avgHumidity}%`}
          icon={<Droplets className="w-5 h-5" />}
          color="sky"
        />
      </div>

      {/* Offline alert */}
      {offlineDevices.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {offlineDevices.length} node{offlineDevices.length > 1 ? 's' : ''} offline
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {offlineDevices.map(d => d.name).join(', ')} — no data received in the last 5 minutes.
            </p>
          </div>
        </div>
      )}

      {/* Device grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Device Nodes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {devices.map(device => {
            const online = isOnline(device.lastUpdate);
            return (
              <button
                key={device.id}
                onClick={() => navigate(`/device/${device.id}`)}
                className={`
                  group relative text-left p-5 rounded-2xl border transition-all duration-200
                  hover:shadow-lg hover:-translate-y-0.5 cursor-pointer
                  ${online
                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
                    : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800'
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500">{device.id}</p>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      {device.name}
                    </h3>
                  </div>
                  <span
                    className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${online
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                      }
                    `}
                  >
                    {online ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    {online ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Readings */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                        {device.temperature}°
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Celsius</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                        {device.humidity}%
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Humidity</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{online ? formatTime(device.lastUpdate) : timeSince(device.lastUpdate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Pulse indicator for online */}
                {online && (
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
