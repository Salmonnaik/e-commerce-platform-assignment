import { Link, Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';
import { canAccessAdminDashboard } from '../utils/permissions';

const adminNavItems = [
  { label: 'Dashboard', to: ROUTES.admin.dashboard },
  { label: 'Orders', to: ROUTES.orders },
  { label: 'Products', to: ROUTES.products },
  { label: 'Categories', to: ROUTES.categories },
];

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);

  if (!canAccessAdminDashboard(user?.role)) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Console</h1>
          <Link to={ROUTES.home} className="text-sm text-gray-300 hover:text-white">
            Exit Admin
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="bg-gray-800 rounded-lg p-4 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
