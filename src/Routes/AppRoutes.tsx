import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { ProducerRoute } from './ProducerRoute';
import { AdminRoute } from './AdminRoute';
import { AdminLayout } from '../layouts/AdminLayout';


const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Categories = lazy(() => import('../pages/Categories'));
const Farms = lazy(() => import('../pages/Farms'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Profile = lazy(() => import('../pages/Profile'));

const ProducerDashboard = lazy(() => import('../pages/producer/Dashboard'));
const ProducerProducts = lazy(() => import('../pages/producer/Products'));
const ProducerFarms = lazy(() => import('../pages/producer/Farms'));
const ProducerOrders = lazy(() => import('../pages/producer/Orders'));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));

const AdminProducers = lazy(() => import('../pages/admin/Producers'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
import { ProducerLayout } from '../layouts/ProducerLayout';

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* <Route path="/producer" element={<ProducerRoute />}>
          <Route path="dashboard" element={<ProducerDashboard />} />
          <Route path="products" element={<ProducerProducts />} />
          <Route path="farms" element={<ProducerFarms />} />
          <Route path="orders" element={<ProducerOrders />} />
        </Route> */}

        <Route path="/producer" element={<ProducerRoute />}>
          <Route element={<ProducerLayout />}>
            <Route path="dashboard" element={<ProducerDashboard />} />
            <Route path="products" element={<ProducerProducts />} />
            <Route path="farms" element={<ProducerFarms />} />
            <Route path="orders" element={<ProducerOrders />} />
          </Route>
        </Route>

        {/* <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="producers" element={<AdminProducers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route> */}

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="producers" element={<AdminProducers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page introuvable</div>} />
      </Routes>
    </Suspense>
  );
}