import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';
import { canAccessSellerDashboard } from '../utils/permissions';
import { Navigate } from 'react-router-dom';

const sellerNavItems = [
  { label: 'Dashboard', to: ROUTES.seller.dashboard },
  { label: 'Analytics', to: ROUTES.seller.analytics },
  { label: 'Orders', to: ROUTES.orders },
  { label: 'Profile', to: ROUTES.profile },
];

export default function SellerLayout() {
  const user = useAuthStore((state) => state.user);

  if (!canAccessSellerDashboard(user?.role)) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-600">Seller Portal</h1>
          <Link to={ROUTES.home} className="text-sm text-gray-600 hover:text-gray-900">
            View Storefront
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-md p-4 space-y-1">
              {sellerNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
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
