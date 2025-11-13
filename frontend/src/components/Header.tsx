import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LogOut, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-xl font-bold">Task Master</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>

            <div className="hidden sm:block text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-600 dark:text-gray-400">{user?.email}</div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
