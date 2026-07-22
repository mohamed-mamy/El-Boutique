import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ScrollToTop from '../components/common/ScrollToTop';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const { logout, admin } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const navLinks = [
    { to: '/admin/dashboard', label: t('admin.dashboard', 'Dashboard') },
    { to: '/admin/categories', label: t('admin.categories', 'Categories') },
    { to: '/admin/brands', label: t('admin.brands', 'Brands') },
    { to: '/admin/products', label: t('admin.products', 'Products') },
    { to: '/admin/orders', label: t('admin.orders', 'Orders') },
    { to: '/admin/settings', label: t('admin.settings', 'Settings') },
  ];

  return (
    <div className="flex h-screen bg-primary-50 overflow-hidden font-sans">
      <ScrollToTop />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 start-0 z-50 w-64 bg-white border-e border-primary-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 rtl:lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
      }`}>
        <div className="p-6 border-b border-primary-200 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-primary-900 tracking-wide">{t('admin.panel', 'Admin Panel')}</h2>
          <button onClick={closeSidebar} className="lg:hidden text-primary-500 hover:text-primary-900">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={closeSidebar}
                className={`p-3 rounded-none text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-900 text-white' 
                    : 'text-primary-700 hover:bg-primary-100 hover:text-primary-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-primary-200">
          <div className="mb-3 px-3 text-[11px] uppercase tracking-widest text-primary-500 font-medium">{admin?.name}</div>
          <button 
            onClick={logout}
            className="w-full text-left p-3 text-accent-600 hover:bg-accent-50 rounded-none transition-colors rtl:text-right text-sm font-medium"
          >
            {t('admin.logout', 'Logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-primary-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-primary-600 hover:text-primary-900 me-2"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleLanguage}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600 hover:text-primary-900 transition-colors px-3 py-2"
            >
              {i18n.language === 'ar' ? 'FR' : 'AR'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
