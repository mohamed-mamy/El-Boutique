import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowRight } from 'lucide-react';
import { useFavourites } from '../../context/FavouritesContext';
import ProductCard from '../../components/public/ProductCard';

const FavouritesPage = () => {
  const { t } = useTranslation();
  const { favourites } = useFavourites();

  if (favourites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('favourites.empty_title', 'Your Wishlist is Empty')}
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('favourites.empty_desc', "Looks like you haven't added any products to your favourites yet. Discover our latest collections!")}
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          {t('favourites.start_shopping', 'Start Shopping')}
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('favourites.title', 'Your Favourites')}
        </h1>
        <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
          {favourites.length} {favourites.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {favourites.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;
