import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ROUTES } from '../constants/routes';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={ROUTES.home} className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">EnterpriseShop</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to={ROUTES.products} className="border-transparent text-gray-900 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Products
              </Link>
              {user?.role === 'CUSTOMER' && (
                <Link to={ROUTES.customer.dashboard} className="border-transparent text-gray-900 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Customer Dashboard
                </Link>
              )}
              {user?.role === 'SELLER' && (
                <Link to={ROUTES.seller.dashboard} className="border-transparent text-gray-900 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Seller Dashboard
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to={ROUTES.admin.dashboard} className="border-transparent text-gray-900 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <Link to={ROUTES.cart} className="relative p-2 text-gray-900 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            ) : null}
            {user ? (
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex space-x-4">
                <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-sm text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
