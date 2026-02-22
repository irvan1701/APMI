import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { DeviceNode } from './types';
import { initialDevices, simulateUpdate } from './data';

interface AppContextType {
  devices: DeviceNode[];
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateDeviceMeta: (id: string, name: string, lat: number, lng: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<DeviceNode[]>(initialDevices);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulate real-time updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => simulateUpdate(d)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(p => !p), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);

  const updateDeviceMeta = useCallback((id: string, name: string, lat: number, lng: number) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === id ? { ...d, name, latitude: lat, longitude: lng } : d
      )
    );
  }, []);

  return (
    <AppContext.Provider
      value={{ devices, darkMode, sidebarOpen, toggleDarkMode, toggleSidebar, updateDeviceMeta }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
