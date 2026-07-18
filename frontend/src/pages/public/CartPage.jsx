import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Loader2, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../config/axios';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      setError(t('cart.error_fill', 'Please fill in your name and phone number.'));
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.product.color
        }))
      };

      const response = await api.post('/orders', payload);
      
      if (response.data.success) {
        // Construct WhatsApp Message
        let message = `*New Order - ${response.data.data.orderNumber}*%0A%0A`;
        message += `*Customer:* ${formData.customerName}%0A`;
        message += `*Phone:* ${formData.customerPhone}%0A`;
        if (formData.note) {
          message += `*Note:* ${formData.note}%0A`;
        }
        message += `%0A*Items:*%0A`;
        
        cartItems.forEach(item => {
          const name = i18n.language === 'ar' ? item.product.nameAr : item.product.nameFr;
          const price = item.product.discountPrice || item.product.price;
          message += `- ${item.quantity}x ${name} (${price} MRU)%0A`;
        });
        
        message += `%0A*Total:* ${cartTotal} MRU`;

        // Clear cart
        clearCart();
        
        // Open WhatsApp
        const waNumber = '213555555555'; // REPLACE with dynamic store setting later
        const waLink = `https://wa.me/${waNumber}?text=${message}`;
        window.open(waLink, '_blank');
        
        toast.success('Order placed successfully! Redirecting to WhatsApp...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center fade-in">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8 border border-primary-200">
          <ShoppingBag className="w-10 h-10 text-primary-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-primary-900 mb-4 tracking-wide">
          {t('cart.empty_title', 'Your Cart is Empty')}
        </h1>
        <p className="text-primary-600 mb-10 max-w-md font-light">
          {t('cart.empty_desc', 'Looks like you haven\'t added any items to the cart yet. Explore our collections and find something you love!')}
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center gap-3 bg-primary-900 text-white px-10 py-4 rounded-none text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary-800 transition-colors"
        >
          {t('cart.start_shopping', 'Start Shopping')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 md:py-16 fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-primary-900 mb-4 tracking-wide">
          {t('cart.title', 'Shopping Cart')}
        </h1>
        <div className="w-12 h-0.5 bg-primary-300"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Cart Items List */}
        <div className="lg:w-3/5 flex flex-col gap-6">
          <div className="bg-transparent border-t border-primary-200">
            {cartItems.map((item, index) => {
              const product = item.product;
              const name = i18n.language === 'ar' ? product.nameAr : product.nameFr;
              const image = product.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image';
              const price = product.discountPrice || product.price;

              return (
                <div key={product._id} className="py-8 flex flex-col sm:flex-row gap-8 border-b border-primary-200">
                  <Link to={`/products/${product._id}`} className="shrink-0">
                    <img 
                      src={image} 
                      alt={name} 
                      className="w-28 h-36 object-cover bg-primary-100"
                    />
                  </Link>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/products/${product._id}`} className="block mb-1">
                          <h3 className="font-serif text-xl text-primary-900 hover:text-primary-600 transition-colors line-clamp-2">
                            {name}
                          </h3>
                        </Link>
                        {product.color && (
                          <p className="text-[11px] uppercase tracking-[0.1em] text-primary-500 mt-2">Color: {product.color}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromCart(product._id)}
                        className="text-primary-400 hover:text-accent-700 transition-colors p-2 -mr-2 -mt-2"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6 sm:mt-0">
                      <div className="text-lg text-primary-900">
                        {price} MRU
                      </div>
                      
                      <div className="flex items-center gap-4 border border-primary-300 px-3 py-1.5">
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-primary-500 hover:text-primary-900 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-primary-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-primary-500 hover:text-primary-900 transition-colors disabled:opacity-50"
                          disabled={item.quantity >= product.quantity}
                        >
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={clearCart}
            className="self-end text-[11px] uppercase tracking-[0.1em] font-medium text-primary-500 hover:text-primary-900 transition-colors mt-4"
          >
            {t('cart.clear_cart', 'Clear Cart')}
          </button>
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="lg:w-2/5">
          <div className="bg-primary-50 p-8 md:p-10 sticky top-28 border border-primary-200">
            <h2 className="text-2xl font-serif text-primary-900 mb-8 tracking-wide">{t('cart.order_summary', 'Order Summary')}</h2>
            
            <div className="flex justify-between items-center mb-6 text-primary-700 text-sm">
              <span>{t('cart.subtotal', 'Subtotal')}</span>
              <span>{cartTotal} MRU</span>
            </div>
            
            <div className="border-t border-primary-200 my-6 pt-6 flex justify-between items-end mb-10">
              <span className="text-sm uppercase tracking-[0.1em] text-primary-900">{t('cart.total', 'Total')}</span>
              <span className="font-serif text-3xl text-primary-900">{cartTotal} MRU</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-accent-50 text-accent-700 text-[13px] p-4 flex items-start gap-3 border border-accent-200">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-primary-600 mb-2">
                  {t('cart.full_name', 'Full Name *')}
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3.5 bg-white border border-primary-200 focus:outline-none focus:border-primary-500 transition-colors text-primary-900 placeholder:text-primary-300"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-primary-600 mb-2">
                  {t('cart.phone_number', 'Phone Number *')}
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 0555 55 55 55"
                  className="w-full px-4 py-3.5 bg-white border border-primary-200 focus:outline-none focus:border-primary-500 transition-colors text-primary-900 placeholder:text-primary-300"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-primary-600 mb-2">
                  {t('cart.order_note', 'Order Note (Optional)')}
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Any special requests?"
                  rows="3"
                  className="w-full px-4 py-3.5 bg-white border border-primary-200 focus:outline-none focus:border-primary-500 transition-colors text-primary-900 placeholder:text-primary-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-900 text-white py-4 mt-8 flex items-center justify-center gap-3 hover:bg-primary-800 disabled:bg-primary-300 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                ) : (
                  <>
                    <span className="text-[12px] uppercase tracking-[0.15em] font-medium">{t('cart.send_order', 'Send Order via WhatsApp')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-primary-500 mt-4 leading-relaxed px-4">
                {t('cart.redirect_note', 'You will be redirected to WhatsApp to confirm your order directly with the store owner.')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
