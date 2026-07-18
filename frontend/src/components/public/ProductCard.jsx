import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useFavourites } from '../../context/FavouritesContext';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const isFav = isFavourite(product._id);
  const name = i18n.language === 'ar' ? product.nameAr : product.nameFr;
  const image = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://placehold.co/400x500?text=No+Image';

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group relative bg-transparent flex flex-col h-full fade-in">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-100 mb-4 group-hover:opacity-95 transition-opacity">
        <Link to={`/products/${product._id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-primary-900 text-white text-[10px] uppercase tracking-widest font-medium px-3 py-1">
              Sale
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-accent-200 text-primary-900 text-[10px] uppercase tracking-widest font-medium px-3 py-1">
              Hot
            </span>
          )}
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); toggleFavourite(product); }}
            className={`p-2.5 bg-white/90 backdrop-blur-sm transition-colors hover:bg-primary-50 ${
              isFav ? 'text-accent-600' : 'text-primary-800'
            }`}
          >
            <Heart size={16} strokeWidth={1.5} className={isFav ? 'fill-current' : ''} />
          </button>
        </div>
        
        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            disabled={product.quantity <= 0}
            className="w-full bg-primary-900/95 backdrop-blur-sm text-white py-3.5 flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span className="font-medium text-[11px] uppercase tracking-[0.1em]">
              {product.quantity > 0 ? t('products.add_to_cart') : t('products.out_of_stock')}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow items-center text-center px-2">
        <div className="text-[10px] uppercase tracking-[0.15em] text-primary-500 mb-2">
          {i18n.language === 'ar' ? product.category?.nameAr : product.category?.nameFr}
        </div>
        <Link to={`/products/${product._id}`} className="block mb-2 flex-grow">
          <h3 className="font-serif text-[16px] text-primary-900 leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-[14px] text-primary-900">{product.discountPrice} MRU</span>
              <span className="text-[12px] text-primary-400 line-through">{product.price} MRU</span>
            </>
          ) : (
            <span className="text-[14px] text-primary-900">{product.price} MRU</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
