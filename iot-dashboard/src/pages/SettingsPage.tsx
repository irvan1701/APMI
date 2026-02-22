import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { isOnline } from '../store/data';
import {
  Save,
  Pencil,
  X,
  Check,
  MapPin,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface EditState {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}

export default function SettingsPage() {
  const { devices, updateDeviceMeta } = useApp();
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function startEdit(id: string) {
    const d = devices.find(dev => dev.id === id);
    if (!d) return;
    setEditing({
      id: d.id,
      name: d.name,
      latitude: d.latitude.toString(),
      longitude: d.longitude.toString(),
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  function saveEdit() {
    if (!editing) return;
    const lat = parseFloat(editing.latitude);
    const lng = parseFloat(editing.longitude);
    if (isNaN(lat) || isNaN(lng)) return;
    updateDeviceMeta(editing.id, editing.name, lat, lng);
    setSaved(editing.id);
    setEditing(null);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage device metadata — building names and GPS coordinates
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Node ID
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Building Name
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Longitude
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {devices.map(device => {
                const online = isOnline(device.lastUpdate);
                const isEditing = editing?.id === device.id;

                return (
                  <tr
                    key={device.id}
                    className={`transition-colors ${
                      isEditing
                        ? 'bg-primary-50/50 dark:bg-primary-950/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                    } ${saved === device.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
                        {device.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editing.name}
                          onChange={e => setEditing({ ...editing, name: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editing.latitude}
                          onChange={e => setEditing({ ...editing, latitude: e.target.value })}
                          className="w-28 px-3 py-1.5 text-sm font-mono rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {device.latitude.toFixed(4)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editing.longitude}
                          onChange={e => setEditing({ ...editing, longitude: e.target.value })}
                          className="w-28 px-3 py-1.5 text-sm font-mono rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {device.longitude.toFixed(4)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
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
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {saved === device.id && (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Save className="w-3 h-3" />
                              Saved
                            </span>
                          )}
                          <button
                            onClick={() => startEdit(device.id)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
