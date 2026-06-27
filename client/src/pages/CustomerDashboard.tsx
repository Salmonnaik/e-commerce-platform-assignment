import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== 'CUSTOMER') {
      navigate(ROUTES.login, { replace: true });
    }
  }, [navigate, user]);

  if (!user || user.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage your shopping experience, orders, payments, and profile from one place.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { title: 'Browse Products', description: 'Explore the catalog and discover new items.', to: ROUTES.products },
          { title: 'My Orders', description: 'Track your recent purchases and order progress.', to: ROUTES.orders },
          { title: 'Payments', description: 'Review payment history and secure checkout activity.', to: ROUTES.payments },
          { title: 'Wishlist', description: 'Keep products you want to buy later.', to: ROUTES.wishlist },
          { title: 'Profile', description: 'Update your account details and contact information.', to: ROUTES.profile },
          { title: 'Settings', description: 'Adjust your preference and account settings.', to: ROUTES.settings },
        ].map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.to)}
            className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:border-primary-500 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
