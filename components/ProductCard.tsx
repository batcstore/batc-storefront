import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onPreOrder?: (variant?: ProductVariant) => void;
  onViewDetails?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPreOrder, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="space-y-6 animate-fade-up group h-full">
      {/* Product Image Carousel */}
      <div
        className="h-64 md:h-72 lg:h-80 overflow-hidden border-0 relative bg-transparent cursor-pointer"
        onClick={onViewDetails}
      >
        <img
          src={productImages[currentImageIndex]}
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 mix-blend-multiply"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        
        {/* Navigation Arrows - Only show if multiple images */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-obsidian/80 text-paper rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-obsidian z-10"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-obsidian/80 text-paper rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-obsidian z-10"
              aria-label="Next image"
            >
              →
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-gold w-4' : 'bg-obsidian/30'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-4 text-center">
        <h3 
          className="text-base font-sans font-semibold tracking-wide text-obsidian uppercase cursor-pointer hover:text-gold transition-colors"
          onClick={onViewDetails}
        >
          {product.name}
        </h3>
        <p className="text-sm text-obsidian/60 font-light">{product.price}</p>
        
        {/* Options indicator */}
        {product.variants && product.variants.length > 1 && (
          <p className="text-xs text-obsidian/40">
            {product.variants.length} options available
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => onPreOrder?.(product.variants?.[0])}
          className="w-full py-4 bg-obsidian text-paper font-sans text-xs font-semibold uppercase tracking-wider hover:bg-obsidian/90 transition-all"
        >
          {product.tags?.includes('Pre-Order') ? 'Pre-Order' : 'Add to Cart'}
        </button>
        <button 
          onClick={onViewDetails}
          className="w-full text-xs text-obsidian/60 hover:text-obsidian uppercase tracking-wider transition-colors py-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};