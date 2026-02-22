import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { isOnline } from '../store/data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

function formatChartTime(ts: number) {
  return new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatFullTime(ts: number) {
  return new Date(ts).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const { devices, darkMode } = useApp();
  const navigate = useNavigate();

  const device = devices.find(d => d.id === id);
  if (!device) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Device not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-primary-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const online = isOnline(device.lastUpdate);
  const chartData = device.history.map(h => ({
    time: formatChartTime(h.timestamp),
    timestamp: h.timestamp,
    temperature: h.temperature,
    humidity: h.humidity,
  }));

  const maxTemp = Math.max(...device.history.map(h => h.temperature));
  const minTemp = Math.min(...device.history.map(h => h.temperature));
  const maxHum = Math.max(...device.history.map(h => h.humidity));
  const minHum = Math.min(...device.history.map(h => h.humidity));

  const recentLogs = [...device.history].reverse().slice(0, 20);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back button + header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/')}
          className="mt-1 p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {device.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                online
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
              }`}
            >
              {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">{device.id}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Temp"
          value={`${device.temperature}°C`}
          icon={<Thermometer className="w-5 h-5" />}
          bgColor="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Current Humidity"
          value={`${device.humidity}%`}
          icon={<Droplets className="w-5 h-5" />}
          bgColor="bg-sky-100 dark:bg-sky-900/30"
          iconColor="text-sky-600 dark:text-sky-400"
        />
        <StatCard
          label="Temp Range"
          value={`${minTemp}° — ${maxTemp}°`}
          icon={<TrendingUp className="w-5 h-5" />}
          bgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          label="Humidity Range"
          value={`${minHum}% — ${maxHum}%`}
          icon={<TrendingDown className="w-5 h-5" />}
          bgColor="bg-cyan-100 dark:bg-cyan-900/30"
          iconColor="text-cyan-600 dark:text-cyan-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Temperature chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Temperature Trend (24h)
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  domain={['auto', 'auto']}
                  unit="°C"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: darkMode ? '#e5e7eb' : '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Humidity Trend (24h)
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  domain={['auto', 'auto']}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: darkMode ? '#e5e7eb' : '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Combined chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Combined Overview (24h)
        </h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                interval={Math.floor(chartData.length / 6)}
              />
              <YAxis
                yAxisId="temp"
                tick={{ fontSize: 10, fill: '#f59e0b' }}
                domain={['auto', 'auto']}
                unit="°C"
              />
              <YAxis
                yAxisId="hum"
                orientation="right"
                tick={{ fontSize: 10, fill: '#0ea5e9' }}
                domain={['auto', 'auto']}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: darkMode ? '#e5e7eb' : '#111827',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280' }}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="hum"
                type="monotone"
                dataKey="humidity"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical logs table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Recent Readings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Humidity
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentLogs.map((log, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-3 text-xs font-mono text-gray-600 dark:text-gray-400">
                    {formatFullTime(log.timestamp)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <Thermometer className="w-3 h-3" />
                      {log.temperature}°C
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
                      <Droplets className="w-3 h-3" />
                      {log.humidity}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.temperature > 35
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : log.temperature > 30
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {log.temperature > 35 ? 'High' : log.temperature > 30 ? 'Warm' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  bgColor,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
