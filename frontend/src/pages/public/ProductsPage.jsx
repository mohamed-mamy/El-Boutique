import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import ProductCard from '../../components/public/ProductCard';
import { Search, Filter, Loader2, X } from 'lucide-react';

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (brandRes.data.success) setBrands(brandRes.data.data);
      } catch (error) {
        console.error('Failed to fetch filters', error);
      }
    };
    fetchFilters();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
      });
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);

      const response = await api.get(`/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, selectedBrand]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPage(1);
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-10 fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-primary-900 mb-2 tracking-wide">
            {t('products.title', 'Our Collection')}
          </h1>
          <div className="w-12 h-0.5 bg-primary-300"></div>
        </div>
        <div className="w-full md:w-auto flex gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('products.search', 'Search products...')}
              className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-none focus:outline-none focus:border-primary-500 transition-colors text-sm text-primary-900 placeholder:text-primary-400"
            />
            <Search className="absolute left-3 top-3 text-primary-400 w-5 h-5" strokeWidth={1.5} />
          </form>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden p-3 bg-primary-900 text-white rounded-none"
          >
            <Filter className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters (Desktop + Mobile Drawer) */}
        <aside className={`${
          isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block w-64 flex-shrink-0'
        }`}>
          {isFilterOpen && (
            <div className="flex justify-between items-center mb-8 md:hidden">
              <h2 className="text-xl font-serif text-primary-900">{t('products.filters', 'Filters')}</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-primary-50 text-primary-900 rounded-none border border-primary-200">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          )}

          <div className="space-y-10 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-primary-900 border-b border-primary-300 inline-block pb-2">
                {t('products.filters', 'Filters')}
              </h3>
              {(selectedCategory || selectedBrand) && (
                <button onClick={clearFilters} className="text-[11px] uppercase tracking-[0.1em] text-accent-600 hover:text-accent-800 transition-colors">
                  {t('products.clear', 'Clear')}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-5 text-[12px] uppercase tracking-widest text-primary-600">{t('products.categories', 'Categories')}</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => { setSelectedCategory(''); setPage(1); }}
                    className="w-4 h-4 text-primary-900 focus:ring-primary-900 border-primary-300"
                  />
                  <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">{t('products.all_categories', 'All Categories')}</span>
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat._id}
                      onChange={() => { setSelectedCategory(cat._id); setPage(1); }}
                      className="w-4 h-4 text-primary-900 focus:ring-primary-900 border-primary-300"
                    />
                    <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">
                      {i18n.language === 'ar' ? cat.nameAr : cat.nameFr}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="font-medium mb-5 text-[12px] uppercase tracking-widest text-primary-600">{t('products.brands', 'Brands')}</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === ''}
                    onChange={() => { setSelectedBrand(''); setPage(1); }}
                    className="w-4 h-4 text-primary-900 focus:ring-primary-900 border-primary-300"
                  />
                  <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">{t('products.all_brands', 'All Brands')}</span>
                </label>
                {brands.map(brand => (
                  <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand._id}
                      onChange={() => { setSelectedBrand(brand._id); setPage(1); }}
                      className="w-4 h-4 text-primary-900 focus:ring-primary-900 border-primary-300"
                    />
                    <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">
                      {i18n.language === 'ar' ? brand.nameAr : brand.nameFr}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {isFilterOpen && (
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-primary-900 text-white py-3.5 rounded-none mt-8 text-[11px] uppercase tracking-widest font-medium md:hidden"
              >
                {t('products.apply', 'Apply Filters')}
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="animate-spin w-10 h-10 text-primary-900" strokeWidth={1.5} />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-3">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx + 1)}
                      className={`w-10 h-10 rounded-none border flex items-center justify-center font-medium transition-colors ${
                        page === idx + 1 
                          ? 'bg-primary-900 border-primary-900 text-white' 
                          : 'bg-transparent border-primary-200 text-primary-600 hover:border-primary-400 hover:text-primary-900'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-primary-50 rounded-none border border-primary-200 fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-primary-200 mb-6">
                <Search className="w-8 h-8 text-primary-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-primary-900 mb-3">{t('products.no_products', 'No Products Found')}</h3>
              <p className="text-primary-600 max-w-md mx-auto font-light leading-relaxed">
                {t('products.no_products_desc', 'We couldn\'t find any products matching your current filters. Try removing some filters or searching for something else.')}
              </p>
              <button 
                onClick={clearFilters}
                className="mt-8 px-8 py-3 bg-primary-900 text-white rounded-none text-[11px] uppercase tracking-widest font-medium hover:bg-primary-800 transition-colors"
              >
                {t('products.clear_all', 'Clear all filters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
