import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellersApi } from '../api/sellers';
import { useAuthStore } from '../store/useAuthStore';
import Loader from '../components/Loader';
import Button from '../components/Button';

export default function SellerAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      navigate('/');
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await sellersApi.getSellerAnalytics(period);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${analytics?.totalRevenue ? Number(analytics.totalRevenue).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.totalOrders || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Items Sold</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics?.totalItems || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${analytics?.averageOrderValue ? Number(analytics.averageOrderValue).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Balance Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">
                ${analytics?.balance ? Number(analytics.balance.available).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                ${analytics?.balance ? Number(analytics.balance.pending).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Locked</span>
              <span className="font-semibold text-orange-600">
                ${analytics?.balance ? Number(analytics.balance.locked).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-semibold text-blue-600">
                ${analytics?.balance ? Number(analytics.balance.paid).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Chart</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics?.revenueChart && analytics.revenueChart.length > 0 ? (
              analytics.revenueChart.map((item: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{
                      height: `${(item.revenue / (Math.max(...analytics.revenueChart.map((r: any) => r.revenue)) || 1)) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{item.date.slice(5)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>

      <Button variant="secondary" onClick={() => navigate('/seller')}>
        Back to Dashboard
      </Button>
    </div>
  );
}
