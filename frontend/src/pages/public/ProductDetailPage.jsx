import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import { useCart } from '../../context/CartContext';
import { useFavourites } from '../../context/FavouritesContext';
import ProductCard from '../../components/public/ProductCard';
import { ShoppingBag, Heart, Minus, Plus, Loader2, Share2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data.product);
          setSimilarProducts(response.data.data.similarProducts);
          if (response.data.data.product.images?.length > 0) {
            setActiveImage(response.data.data.product.images[0].url);
          }
          // Increment view count quietly
          api.patch(`/products/${id}/view`).catch(() => {});
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setQuantity(1); // Reset quantity on route change
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin w-10 h-10 text-primary-900" strokeWidth={1.5} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4 fade-in">
        <AlertCircle className="w-12 h-12 text-primary-400 mb-6" strokeWidth={1.5} />
        <h2 className="text-2xl font-serif text-primary-900 mb-3">Product Not Found</h2>
        <p className="text-primary-600 mb-8 font-light">{error || 'This product might be out of stock or removed.'}</p>
        <Link to="/products" className="bg-primary-900 text-white px-8 py-3 rounded-none text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary-800 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const name = i18n.language === 'ar' ? product.nameAr : product.nameFr;
  const description = i18n.language === 'ar' ? product.descriptionAr : product.descriptionFr;
  const categoryName = i18n.language === 'ar' ? product.category?.nameAr : product.category?.nameFr;
  const brandName = i18n.language === 'ar' ? product.brand?.nameAr : product.brand?.nameFr;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isFav = isFavourite(product._id);
  const outOfStock = product.quantity <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing', err);
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 fade-in">
      <div className="flex flex-col lg:flex-row gap-16 mb-24">
        
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="bg-primary-100 rounded-none overflow-hidden aspect-[4/5] relative">
            <img 
              src={activeImage || 'https://placehold.co/800x1000?text=No+Image'} 
              alt={name} 
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-6 left-6 bg-primary-900 text-white text-[10px] uppercase tracking-widest font-medium px-4 py-1.5">
                Sale
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-6 right-6 bg-accent-200 text-primary-900 text-[10px] uppercase tracking-widest font-medium px-4 py-1.5">
                Hot
              </span>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`snap-start flex-shrink-0 w-24 h-32 rounded-none overflow-hidden border-b-2 transition-colors ${
                    activeImage === img.url ? 'border-primary-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2 text-[10px] uppercase tracking-[0.15em] text-primary-500">
              <Link to={`/products?category=${product.category?._id}`} className="hover:text-primary-900 transition-colors">{categoryName}</Link>
              {brandName && (
                <>
                  <span>•</span>
                  <Link to={`/products?brand=${product.brand?._id}`} className="hover:text-primary-900 transition-colors">{brandName}</Link>
                </>
              )}
            </div>
            
            <button onClick={handleShare} className="text-primary-400 hover:text-primary-900 transition-colors" title="Share">
              <Share2 size={18} strokeWidth={1.5} />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-6 leading-[1.15] tracking-tight">
            {name}
          </h1>

          <div className="flex items-end gap-5 mb-10">
            {hasDiscount ? (
              <>
                <span className="text-2xl md:text-3xl font-light text-primary-900">{product.discountPrice} MRU</span>
                <span className="text-lg md:text-xl text-primary-400 line-through mb-1">{product.price} MRU</span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-light text-primary-900">{product.price} MRU</span>
            )}
          </div>

          <p className="text-primary-700 mb-10 whitespace-pre-wrap leading-relaxed font-light text-base md:text-lg">
            {description}
          </p>

          {/* Color & Stock Info */}
          <div className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-primary-200">
            {product.color && (
              <div>
                <span className="block text-[11px] uppercase tracking-[0.1em] text-primary-500 mb-2">Color</span>
                <span className="text-base text-primary-900 font-medium">{product.color}</span>
              </div>
            )}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.1em] text-primary-500 mb-2">Availability</span>
              <span className={`text-base font-medium ${outOfStock ? 'text-primary-400' : 'text-primary-900'}`}>
                {outOfStock ? 'Out of Stock' : `${product.quantity} In Stock`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            {!outOfStock && (
              <div className="flex items-center justify-between border border-primary-300 rounded-none px-6 py-4 sm:w-1/3">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-primary-500 hover:text-primary-900 transition-colors"
                >
                  <Minus size={18} strokeWidth={1.5} />
                </button>
                <span className="font-medium text-lg text-primary-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                  className="text-primary-500 hover:text-primary-900 transition-colors"
                >
                  <Plus size={18} strokeWidth={1.5} />
                </button>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 bg-primary-900 text-white rounded-none py-4 flex items-center justify-center gap-3 hover:bg-primary-800 disabled:bg-primary-300 disabled:text-primary-100 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="text-[12px] uppercase tracking-[0.15em] font-medium">
                {outOfStock ? t('products.out_of_stock') : t('products.add_to_cart')}
              </span>
            </button>

            <button 
              onClick={() => toggleFavourite(product)}
              className={`flex items-center justify-center rounded-none border transition-colors sm:w-20 h-14 sm:h-auto ${
                isFav 
                  ? 'border-accent-600 text-accent-600 bg-accent-50' 
                  : 'border-primary-300 text-primary-600 hover:border-primary-900 hover:text-primary-900'
              }`}
            >
              <Heart size={20} strokeWidth={1.5} className={isFav ? 'fill-current' : ''} />
            </button>
          </div>

        </div>
      </div>

      {/* Similar Products */}
      {similarProducts && similarProducts.length > 0 && (
        <section className="pt-16 border-t border-primary-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif tracking-wide text-primary-900 mb-4">
              You might also like
            </h2>
            <div className="w-12 h-0.5 bg-primary-300 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {similarProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailPage;
