import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import NotFoundPage from '../pages/NotFoundPage';

// Admin Pages
import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import BrandsPage from '../pages/admin/BrandsPage';
import AdminProductsPage from '../pages/admin/ProductsPage';
import ProductFormPage from '../pages/admin/ProductFormPage';
import OrdersPage from '../pages/admin/OrdersPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Public pages (Placeholders for now)
import HomePage from '../pages/public/HomePage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import FavouritesPage from '../pages/public/FavouritesPage';
import CartPage from '../pages/public/CartPage';

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'favourites', element: <FavouritesPage /> },
    ],
  },
  
  // Admin Login (No Layout)
  {
    path: '/admin/login',
    element: <LoginPage />,
  },

  // Protected Admin Routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'brands', element: <BrandsPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <ProductFormPage /> },
          { path: 'products/edit/:id', element: <ProductFormPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);

export default router;
