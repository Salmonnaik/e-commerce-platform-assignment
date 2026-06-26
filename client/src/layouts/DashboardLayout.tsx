import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface DashboardLayoutProps {
  title: string;
  navItems: Array<{ label: string; to: string }>;
}

export default function DashboardLayout({ title, navItems }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{title}</h2>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to={ROUTES.home}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Back to Store
                </Link>
              </nav>
            </div>
          </aside>
          <section className="lg:col-span-3">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
