import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  Bed
} from 'lucide-react';
import { Button } from '../ui/button';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Bed Management', href: '/admin/beds', icon: Bed },
    { name: 'Guests', href: '/admin/guests', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden w-full max-w-[100vw]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#006b24] text-white p-4 flex items-center justify-between z-50">
        <h2 className="text-white">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#006b24] text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-white">Albergue Admin</h2>
            <p className="text-sm text-white/70 mt-1">Carrascalejo</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#00AB39] text-white'
                    : 'text-white/80 hover:bg-[#008c2f] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Admin User</p>
                <p className="text-xs text-white/60">admin@albergue.com</p>
              </div>
            </div>
            <Link to="/">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#008c2f] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-20 mt-16 lg:mt-0">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <h3>Welcome back, Admin</h3>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}