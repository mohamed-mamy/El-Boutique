import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { SettingsProvider } from './context/SettingsContext';
import './config/i18n'; // Ensure i18n is initialized

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <FavouritesProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={router} />
          </FavouritesProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
