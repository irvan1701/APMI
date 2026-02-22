import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../store/AppContext';
import { Menu } from 'lucide-react';

export default function Layout() {
  const { toggleSidebar } = useApp();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center h-[60px] px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-sm font-bold text-gray-900 dark:text-white">
            Peruri IoT Monitor
          </span>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
