import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';

const SETTINGS_STORAGE_KEY = 'userSettings';

const defaultSettings = {
  emailNotifications: true,
  orderUpdates: true,
  promotionalEmails: false,
  smsNotifications: false,
  language: 'en',
  currency: 'USD',
};

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Order Updates</span>
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={(e) => setSettings({ ...settings, orderUpdates: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Promotional Emails</span>
              <input
                type="checkbox"
                checked={settings.promotionalEmails}
                onChange={(e) => setSettings({ ...settings, promotionalEmails: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border rounded-md px-3 py-2 bg-gray-50"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
            >
              Manage Profile
            </Button>
          </div>
        </div>

        <div className="flex justify-end items-center space-x-3">
          {saved && (
            <span className="text-sm text-green-600">Settings saved successfully.</span>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
