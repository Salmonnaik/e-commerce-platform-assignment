import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-6">
        <div className="max-w-md mx-auto text-center">
          <Link to={ROUTES.home} className="text-2xl font-bold text-primary-600">
            EnterpriseShop
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
