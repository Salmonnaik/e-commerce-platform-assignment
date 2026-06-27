import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tracking from './pages/Tracking';
import SellerDashboard from './pages/SellerDashboard';
import SellerAnalytics from './pages/SellerAnalytics';
import SellerProducts from './pages/SellerProducts';
import SellerAddProduct from './pages/SellerAddProduct';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Payments from './pages/Payments';
import Wishlist from './pages/Wishlist';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './constants/routes';

function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Routes>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<SellerLayout />}>
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/seller/analytics" element={<SellerAnalytics />} />
                  <Route path="/seller/products" element={<SellerProducts />} />
                  <Route path="/seller/products/new" element={<SellerAddProduct />} />
                </Route>

                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route element={<CustomerLayout />}>
                  <Route path={ROUTES.customer.dashboard} element={<CustomerDashboard />} />
                  <Route path={ROUTES.wishlist} element={<Wishlist />} />
                  <Route path={ROUTES.payments} element={<Payments />} />
                </Route>

                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/tracking/:trackingNumber" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
                </Route>
              </Routes>
            </NotificationProvider>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
