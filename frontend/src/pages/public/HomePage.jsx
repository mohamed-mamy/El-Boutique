import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import HeroSection from '../../components/public/HeroSection';
import CategoryPills from '../../components/public/CategoryPills';
import ProductCard from '../../components/public/ProductCard';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=20') // Fetch more to filter locally by category for now
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setProducts(prodRes.data.data.products);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);
  const latestProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  const displayedProducts = selectedCategory 
    ? products.filter(p => p.category?._id === selectedCategory)
    : latestProducts;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin w-10 h-10 text-primary-900" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-8 fade-in">
      <HeroSection />

      {/* Featured Section */}
      {featuredProducts.length > 0 && !selectedCategory && (
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary-900 tracking-wide mb-4">
              {t('home.featured', 'Featured Collection')}
            </h2>
            <div className="w-16 h-0.5 bg-primary-300 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories & Latest Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-primary-900 tracking-wide mb-4">
            {selectedCategory ? t('home.category_products', 'Category Products') : t('home.latest', 'New Arrivals')}
          </h2>
          <div className="w-16 h-0.5 bg-primary-300 mx-auto mb-10"></div>
          
          <div className="flex justify-center">
            <CategoryPills 
              categories={categories} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {displayedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-primary-50 rounded-none border border-primary-200 fade-in">
            <h3 className="font-serif text-2xl text-primary-900 mb-3">{t('products.no_products', 'No Products Found')}</h3>
            <p className="text-primary-600 font-light">{t('products.no_products_desc', 'We couldn\'t find any products matching your current filters. Try removing some filters or searching for something else.')}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
