
import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { createCheckout } from '../services/shopifyService';

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}


const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    setCheckoutUrl(null);
    try {
      const lineItems = cartItems.map(item => ({
        variantId: item.selectedVariant?.id || item.product.shopifyVariantId,
        quantity: item.quantity,
      })).filter(li => li.variantId);
      if (lineItems.length === 0) {
        setError('No valid products in cart.');
        return;
      }
      const url = await createCheckout(lineItems);
      if (url && typeof url === 'string' && url.startsWith('http')) {
        onClose();
        // small delay to ensure modal state updates before navigation
        setTimeout(() => { window.location.href = url; }, 50);
      } else {
        setError('Unable to create checkout. Please check your product setup and Shopify credentials.');
      }
    } catch (err) {
      setError('Checkout failed. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.product.price;
    return sum + (parseFloat(price.replace('$', '')) * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-paper max-w-2xl w-full my-8 shadow-2xl relative border border-obsidian/10 p-8 rounded-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-obsidian/60 hover:text-gold transition-colors"
          aria-label="Close Cart Modal"
        >
          ×
        </button>
        <h2 className="text-3xl font-serif italic font-bold text-center mb-8">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-obsidian/60 py-12">Your cart is empty.</div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center font-mono text-sm">{error}</div>
            )}
            {cartItems.map((item, idx) => (
              <div key={item.product.id + (item.selectedVariant?.id || '')} className="flex items-center gap-4 border-b border-obsidian/10 pb-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-bold text-obsidian">{item.product.name}</div>
                  {item.selectedVariant && <div className="text-xs text-obsidian/60">{item.selectedVariant.title}</div>}
                  <div className="text-xs text-obsidian/60">{item.product.category}</div>
                  <div className="text-xs text-obsidian/60">{item.selectedVariant?.price || item.product.price}</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => onUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-obsidian/20 rounded text-center"
                />
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 text-xl px-2"
                  aria-label="Remove from cart"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <div className="font-bold text-lg">Total</div>
              <div className="font-bold text-lg">${total.toFixed(2)}</div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-gold text-obsidian font-bold text-lg rounded hover:bg-yellow-400 transition disabled:opacity-60"
            >
              {isLoading ? 'Loading checkout...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
