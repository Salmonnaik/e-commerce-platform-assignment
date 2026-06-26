import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellersApi } from '../api/sellers';
import { useAuthStore } from '../store/useAuthStore';
import Loader from '../components/Loader';
import Button from '../components/Button';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [balanceRes] = await Promise.all([
        sellersApi.getSellerBalance(),
      ]);
      setBalance(balanceRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-green-600">
            ${balance ? Number(balance.available).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${balance ? Number(balance.pending).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${balance ? Number(balance.paid).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/seller/products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => navigate('/seller/orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => navigate('/seller/ledger')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ledger'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ledger
            </button>
            <button
              onClick={() => navigate('/seller/payouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payouts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payouts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/seller/products/new')} className="w-full">
                      Add New Product
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/seller/payouts')} className="w-full">
                      Request Payout
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Account Status</h3>
                  <p className="text-sm text-gray-600">
                    Your seller account is active and ready to receive orders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
