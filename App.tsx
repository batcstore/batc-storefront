
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS, CHARACTERS, LORE_PILLARS, HISTORICAL_TRAILS, PRODUCTION_INSIGHTS, LOCATIONS, TECH_GEAR, SEASON_ONE_EPISODES, CLUB_PILLARS, CLUB_EXPERIENCES, CLUB_BENEFITS, SMALL_PROJECTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { CharacterCard } from './components/CharacterCard';
import { SmallProjectCard } from './components/SmallProjectCard';
import { ActionModal } from './components/ActionModal';
import CheckoutModal from './components/CheckoutModal';
import { View, Product, ProductVariant } from './types';
import { fetchProducts } from './services/shopifyService';

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  stampText?: string;
  stampColor?: 'red' | 'gold' | 'green';
  onSuccess?: () => void;
  mode?: 'full' | 'lead' | 'vision';
}

const ImageGenerator: React.FC<{ prompt: string; fallbackImage: string; title: React.ReactNode; subtitle: React.ReactNode }> = ({ prompt, fallbackImage, title, subtitle }) => {
  const [imageUrl, setImageUrl] = useState<string>(fallbackImage);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHeroImage = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setImageUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full h-[75vh] lg:h-[85vh] group overflow-hidden bg-obsidian">
      <img 
        src="/bagad3.png" 
        className={`w-full h-full object-cover transition-all duration-[10s] ${isGenerating ? 'opacity-20 scale-110 blur-sm' : 'opacity-40 group-hover:scale-105'}`}
        alt="Cinematic Hero"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-8 z-10">
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-gold uppercase tracking-[1em] block animate-fade-up">Archive_Entry_001</span>
          <h2 className="text-[11vw] lg:text-[7vw] font-serif italic font-bold tracking-tighter leading-none text-paper uppercase animate-fade-up">
            {title}
          </h2>
          <div className="text-lg lg:text-xl italic text-paper/70 max-w-4xl font-light leading-tight mx-auto animate-fade-up">
            {subtitle}
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-20">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="font-mono text-[10px] text-gold uppercase tracking-[0.5em] animate-pulse">Syncing with the Archive...</span>
        </div>
      )}

      <div className="absolute bottom-12 right-12 font-mono text-[8px] text-white/20 uppercase tracking-[0.5em] pointer-events-none">
        {isGenerating ? "Processing_Input..." : "Visual_Stream_Active"}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [hasPitchAccess, setHasPitchAccess] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    try {
      const savedCart = localStorage.getItem('bantu_cart');
      if (savedCart) {
        const { items, timestamp } = JSON.parse(savedCart);
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        
        // Check if cart is still valid (less than 2 hours old)
        if (now - timestamp < twoHours) {
          return items;
        } else {
              <p className="text-4xl text-obsidian/80 font-light">$299</p>
          localStorage.removeItem('bantu_cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; product?: Product }>({
    show: false,
    message: ''
  });
  const [isClubFormOpen, setIsClubFormOpen] = useState(false);

  const [selectedExperience, setSelectedExperience] = useState<typeof CLUB_EXPERIENCES[0] | null>(null);
  const [showReservationConfirmation, setShowReservationConfirmation] = useState(false);

  // Reset reservation confirmation when opening/closing the reservation modal
  useEffect(() => {
    if (selectedExperience) {
      setShowReservationConfirmation(false);
    }
  }, [selectedExperience]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const cartData = {
        items: cartItems,
        timestamp: Date.now()
      };
      localStorage.setItem('bantu_cart', JSON.stringify(cartData));
    } else {
      localStorage.removeItem('bantu_cart');
    }
  }, [cartItems]);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const viewProductDetail = (product: Product) => {
    // Only show product detail page for the backpack
    if (product.id === 'pack-01') {
      setSelectedProduct(product);
      setMainImageIndex(0);
      setCurrentView('productDetail');
    }
    // For other products, you can add alternative logic if needed
  };

  // Fetch Shopify products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        const mappedProducts: Product[] = products.map(p => ({
          id: p.id,
          name: p.title,
          price: `$${p.variants[0]?.price.amount || '0'}`,
          category: 'Apparel',
          lore: p.description || 'Premium Bantu Ants apparel.',
          image: p.images[0]?.src || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
          images: p.images.map(img => img.src),
          tags: ['Available Now'],
          variants: p.variants.map(v => ({
            id: v.id,
            title: v.title,
            price: `$${v.price.amount}`,
            available: v.available,
            image: v.image?.src
          })),
          shopifyVariantId: p.variants[0]?.id,
          shopifyProductId: p.id,
        }));
        setShopifyProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to load Shopify products:', error);
        setShopifyProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Combine pre-order products with Shopify products
  const allProducts = [...PRODUCTS.filter(p => !p.shopifyVariantId), ...shopifyProducts];

  const addToCart = (product: Product, quantity: number = 1, selectedVariant?: ProductVariant) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedVariant?.id === selectedVariant?.id
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedVariant?.id === selectedVariant?.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    
    // Show toast notification
    setToast({ show: true, message: 'Added to cart', product });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const openModal = (config: Partial<ModalConfig>) => {
    setModalConfig({
      isOpen: true,
      title: config.title || 'Secure Entry',
      subtitle: config.subtitle || 'Bantu Ants Archive',
      description: config.description || 'Provide your credentials to proceed.',
      buttonText: config.buttonText || 'Confirm Transmission',
      stampText: config.stampText,
      stampColor: config.stampColor,
      onSuccess: config.onSuccess,
      mode: config.mode,
    });
  };

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const handleActionSuccess = () => {
    if (modalConfig.onSuccess) {
      modalConfig.onSuccess();
    }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToClubAndScroll = () => {
    setCurrentView('club');
    setTimeout(() => scrollToId('experiences'), 100);
  };

  const NavItem = ({ view, label }: { view: View; label: string }) => (
    <button 
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`font-mono text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative py-2 ${
        currentView === view ? 'text-gold' : 'text-obsidian/60 hover:text-obsidian'
      }`}
    >
      {label}
      {currentView === view && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold"></div>}
    </button>
  );

  const renderManifesto = () => (
    <div className="animate-fade-up bg-paper min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-obsidian overflow-hidden">
        <img 
          src="/clubpic.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Manifesto Hero"
        />
        <div className="absolute inset-0 bg-obsidian/40"></div>
        <div className="relative z-10 text-center space-y-6 px-6">
          <h1 className="text-[6vw] lg:text-[7vw] font-serif italic font-bold text-paper uppercase leading-[0.9]">
            A Network <br /> <span className="text-gold">Waking</span>
          </h1>
          <p className="text-xl lg:text-2xl text-paper/80 font-light max-w-3xl mx-auto">
            Building infrastructure for African integration
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-24 max-w-5xl mx-auto space-y-24">
        {/* Opening: The Return */}
        <div className="space-y-8 text-center max-w-3xl mx-auto">
          <p className="text-2xl lg:text-3xl font-serif italic text-obsidian leading-relaxed">
            Long before the map, the continent moved as a living circuit. That instinct is returning, now amplified by a historic framework: the African Continental Free Trade Area (AfCFTA).
          </p>
          <p className="text-lg text-obsidian/70 leading-relaxed">
            More than a trade deal, the AfCFTA is a master plan for integration, explicitly identifying tourism and travel-related services as one of five priority sectors for liberalization.
          </p>
          <p className="text-lg text-obsidian font-bold">
            Our purpose is to build the social and practical infrastructure for this integration. We create systems where movement aligns with the AfCFTA's goal of a single market, value circulates within it, and the continent's stories are told by those who live them.
          </p>
          <p className="text-2xl text-gold font-serif italic pt-4">We build bridges where policy meets the road.</p>
        </div>

        {/* Framework Section with Image */}
        <section className="space-y-12 border-t border-obsidian/10 pt-24 max-w-6xl mx-auto px-2 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-serif italic font-bold text-obsidian uppercase">Our Framework in the AfCFTA Era</h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                pillar: 'Narrative Sovereignty',
                action: 'We carry our own stories.',
                doing: 'Building a living, community-held archive of African travel.',
                synergy: 'Contributes to the "Africa We Want" (Agenda 2063) by fostering cultural exchange and a unified continental identity.'
              },
              {
                pillar: 'Continental Mobility',
                action: 'We move as the land intended.',
                doing: 'Designing tools and the Nomad Pass to simplify journeys.',
                synergy: 'Directly addresses key AfCFTA barriers: excessive border delays and cumbersome document requirements.'
              },
              {
                pillar: 'Economic Circulation',
                action: 'We keep value in the soil.',
                doing: 'Structuring travel to strengthen local communities as co-owners.',
                synergy: 'Supports the AfCFTA\'s core aim to boost intra-African trade and investment.'
              }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-obsidian/10 space-y-4 hover:border-gold/30 transition-all aspect-square w-full flex flex-col justify-between">
                <div className="passport-stamp text-gold border-gold text-xs">FRAMEWORK</div>
                <h3 className="text-xl font-serif italic font-bold text-obsidian uppercase">{item.pillar}</h3>
                <p className="text-sm font-mono text-gold uppercase tracking-wider">{item.action}</p>
                <p className="text-obsidian/70 text-sm leading-relaxed">{item.doing}</p>
                <p className="text-obsidian/50 text-sm italic border-t border-obsidian/10 pt-4">{item.synergy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Build Section with Image */}
        <section className="space-y-12 border-t border-obsidian/10 pt-24">
          <h2 className="text-4xl lg:text-5xl font-serif italic font-bold text-obsidian uppercase">What We Build, Together</h2>
          <p className="text-lg text-obsidian/70 leading-relaxed max-w-3xl">
            We are building the practical tools for an integrated Africa:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-4xl text-gold font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-serif italic font-bold text-obsidian uppercase">The Nomad Pass</h3>
                    <p className="text-obsidian/70 text-sm leading-relaxed">A step toward the envisioned African passport, simplifying access and building trust across the network.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl text-gold font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-serif italic font-bold text-obsidian uppercase">Living Routes</h3>
                    <p className="text-obsidian/70 text-sm leading-relaxed">Journeys that activate the single continental tourism market, connecting cultural and economic nodes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl text-gold font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-serif italic font-bold text-obsidian uppercase">Tools for the Network</h3>
                    <p className="text-obsidian/70 text-sm leading-relaxed">Digital platforms that support the AfCFTA's need for smoother connectivity and information flow.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl text-gold font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-serif italic font-bold text-obsidian uppercase">Community Hubs</h3>
                    <p className="text-obsidian/70 text-sm leading-relaxed">Local partnerships that embody the cross-border collaboration essential for the AfCFTA's success.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-square bg-obsidian/5 border border-obsidian/10 overflow-hidden rounded">
              <img 
                src="/1584ortelius.jpg"
                alt="Ortelius 1584 Africa Map"
                className="w-full h-full object-cover transition-all duration-700 rounded"
              />
            </div>
          </div>
        </section>

        {/* Current Realities Section */}
        <section className="space-y-12 border-t border-obsidian/10 pt-24">
          <h2 className="text-4xl lg:text-5xl font-serif italic font-bold text-obsidian uppercase">A Note on Current Realities</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="flex bg-obsidian/5 border border-obsidian/10 overflow-hidden rounded h-full min-h-[420px]">
              <img
                src="/SAAMimage.png"
                alt="SAAM artwork"
                className="w-full h-full object-contain transition-all duration-700"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="space-y-6 text-lg text-obsidian/70 leading-relaxed h-full flex flex-col justify-center">
              <p>The vision is clear, but the path has hurdles. Full continental free movement is still developing, with only four countries currently offering visa-free entry to all Africans.</p>
              
              <p>The AfCFTA's success hinges on complementary initiatives like the Single African Air Transport Market (SAATM) to lower travel costs.</p>
              
              <p className="text-obsidian font-bold italic">This is precisely why the Bantu Ants model is vital.</p>
              
              <p>We work at the community and network level to build the bridges and prove the value of connection now, supporting the larger, incremental reforms needed for a fully integrated continent.</p>
            </div>
          </div>
        </section>

        {/* Join the Return */}
        <section className="space-y-12 border-t border-obsidian/10 pt-24 pb-24">
          <div className="text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-serif italic font-bold text-obsidian uppercase">Join the Return</h2>
            
            <p className="text-xl text-obsidian/70 leading-relaxed max-w-3xl mx-auto">
              We are not waiting for permission to reconnect. We are building the road by walking it, in sync with Africa's boldest project for unity.
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              {[
                'Travel with Purpose',
                'Become a Member',
                'Partner with Us',
                'Wear the Signal'
              ].map((item, i) => (
                <div key={i} className="p-6 bg-gold/10 border border-gold/30 text-center">
                  <p className="font-serif italic font-bold text-obsidian text-sm uppercase">{item}</p>
                </div>
              ))}
            </div>

            <div className="pt-12 space-y-6 text-center">
              <p className="text-2xl font-serif italic font-bold text-obsidian">Bantu Ants Travel Club</p>
              <p className="text-lg text-obsidian/70">Building the social infrastructure for a connected Africa.</p>
              
              <div className="flex justify-center gap-6 flex-wrap pt-6">
                <button 
                  onClick={() => setCurrentView('club')}
                  className="btn-travel bg-obsidian text-paper hover:bg-gold hover:text-obsidian"
                >
                  Explore the Club
                </button>
                <button 
                  onClick={() => setCurrentView('shop')}
                  className="btn-travel"
                >
                  Shop the Collection
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );

  const renderPitch = () => (
    <div className="animate-fade-up bg-paper min-h-screen pt-32 pb-64">
      <div className="max-w-7xl mx-auto px-6 lg:px-24 space-y-24">
        
        {/* SLIDE 1: COVER */}
        <section className="min-h-[60vh] flex flex-col justify-center space-y-8">
           <div className="space-y-6">
              <div className="passport-stamp text-gold border-gold scale-125 origin-left">OFFICIAL_RELEASE</div>
              <h2 className="text-[10vw] font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-[0.8]">
                Pitch <span className="text-gold">Deck.</span>
              </h2>
              <p className="text-3xl italic text-obsidian/40 max-w-2xl">A Cultural Movement Bridging Storytelling, Travel, and Fashion.</p>
           </div>
           <div className="pt-12 border-t border-obsidian/5 flex justify-between items-end">
              <div className="font-mono text-[10px] text-obsidian/30 uppercase tracking-[0.5em]">Ref: Vision_2088_v4.0</div>
              <div className="font-serif italic text-xl text-obsidian/60">A Myth. A Mirror. A Movement.</div>
           </div>
        </section>

        {/* SLIDE 3: EXECUTIVE SUMMARY */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[3/4] bg-obsidian relative overflow-hidden group">
              <img src="/MARTIN L KING.png" className="w-full h-full object-contain opacity-60 transition-all duration-1000" alt="Executive Summary" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center space-y-4 px-12">
                    <div className="w-12 h-[1px] bg-gold mx-auto"></div>
                 </div>
              </div>
           </div>
           <div className="space-y-12">
              <span className="font-mono text-xs text-gold uppercase tracking-[0.8em]">03 / Transmedia Brand</span>
              <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">Connecting <span className="text-gold">Africa</span> & Diaspora.</h3>
              <p className="text-xl italic text-obsidian/60 leading-relaxed font-light">
                Bantu Ants Travel Club is a global cultural platform merging immersive African travel experiences, a narrative-rich animated series, and fashion rooted in Afrofuturism.
              </p>
              <div className="p-8 border-l-2 border-obsidian space-y-4">
                 <p className="font-serif italic text-xl text-obsidian/80">"MLK sets the tone with a bold dream for equity, strategy, and lasting change. His leadership frames our mission: not just to disrupt, but to uplift."</p>
                 <span className="font-mono text-[10px] text-obsidian/30 uppercase tracking-widest">— Martin Luther King Jr. Influence</span>
              </div>
           </div>
        </section>

        {/* SLIDE 4: THE PROBLEM */}
        <section className="grid lg:grid-cols-2 gap-12 items-start py-16 border-t border-obsidian/5">
           <div className="space-y-12 lg:sticky lg:top-40">
              <span className="font-mono text-xs text-red uppercase tracking-[0.8em]">04 / The Gap</span>
              <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">The <span className="text-red">Problem.</span></h3>
              <ul className="space-y-6">
                {['Africa’s stories are underrepresented.', 'Cultural travel lacks depth.', 'Most travel to Africa is extractive, not immersive.', 'Diaspora audiences want deeper connection.', 'Black-led IP ecosystems are underfunded.'].map((point, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <span className="font-mono text-red text-xs mt-1">×</span>
                    <p className="text-xl italic text-obsidian/60 group-hover:text-obsidian transition-colors">{point}</p>
                  </li>
                ))}
              </ul>
           </div>
           <div className="relative">
              <div className="aspect-[3/4] bg-obsidian overflow-hidden">
                <img src="/GADAFI.jpg" className="absolute inset-0 w-full h-full object-contain" style={{objectFit: 'cover'}} alt="Muammar Gaddafi" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-10 shadow-2xl space-y-4 max-w-sm">
                 <h4 className="text-xl font-serif italic font-bold uppercase text-red">Muammar Gaddafi</h4>
                 <p className="text-sm italic text-obsidian/50 leading-relaxed">“Gaddafi dreamed of a truly united Africa—one military, one currency, one passport, and one voice. He believed only through unity could Africa achieve real strength, prosperity, and independence.”</p>
              </div>
           </div>
        </section>

        {/* SLIDE 5: OUR SOLUTION */}
        <section className="space-y-24">
           <header className="text-center space-y-4">
              <span className="font-mono text-xs text-gold uppercase tracking-[0.8em]">05 / The Architecture</span>
              <h3 className="text-5xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">Our <span className="text-gold">Solution.</span></h3>
              <p className="text-xl italic text-obsidian/40 max-w-2xl mx-auto">A multi-layered brand merging real and mythical Africa into one ecosystem.</p>
           </header>
           
           <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: 'The Travel Club', desc: 'Curated, story-led trips to real African locations.', icon: '🌍' },
                { title: 'The Animation', desc: 'A bold, satirical sci-fi journey across future Africa.', icon: '🎬' },
                { title: 'The Apparel', desc: 'Fashion inspired by characters and travel, designed for real-world wear.', icon: '👕' }
              ].map((sol, i) => (
                <div key={i} className="p-12 border border-obsidian/5 hover:border-gold transition-colors space-y-6">
                   <div className="text-3xl">{sol.icon}</div>
                   <h4 className="text-3xl font-serif italic font-bold text-obsidian uppercase">{sol.title}</h4>
                   <p className="text-lg italic text-obsidian/60 leading-relaxed">{sol.desc}</p>
                </div>
              ))}
           </div>

           <div className="p-20 bg-obsidian text-paper space-y-8 relative overflow-hidden">
              {/* Background image for Nkrumah Philosophy section */}
              <img 
                src="/nkrumahscene.png"
                alt="Nkrumah Scene"
                className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
                style={{ pointerEvents: 'none' }}
              />
              <div className="absolute inset-0 vignette-heavy z-10"></div>
              <div className="absolute top-0 right-0 p-12 opacity-5 font-serif text-[15vw] uppercase tracking-tighter pointer-events-none z-20">NKrumah</div>
              <div className="relative z-30">
                <h4 className="text-3xl font-serif italic font-bold uppercase text-gold">Kwame Nkrumah Philosophy</h4>
                <p className="text-xl italic font-light max-w-3xl leading-relaxed">
                  "Nkrumah stands as the blueprint of African self-determination and unity—our solution is rooted in his Pan-African ideals, tech-enabled progress, and cooperative economics."
                </p>
              </div>
           </div>
        </section>

        {/* SLIDE 7: BUSINESS MODEL */}
        <section className="py-16 border-y border-obsidian/5 grid lg:grid-cols-2 gap-12 items-center">
           <div className="relative group">
              <img src="/TUPAC-2.png" className="aspect-square w-full h-full object-cover opacity-80 transition-all duration-1000" alt="Tupac Shakur" />
              <div className="absolute -bottom-8 right-8 bg-gold p-8 text-obsidian space-y-2 max-w-sm">
                 <h4 className="font-serif italic font-bold text-xl uppercase">Tupac Shakur</h4>
                 <p className="text-xs italic leading-relaxed">"More than a rapper—Tupac was a revolutionary brand. Authenticity drives value, and every move speaks to the system."</p>
              </div>
           </div>
           <div className="space-y-12">
              <span className="font-mono text-xs text-gold uppercase tracking-[0.8em]">07 / Revenue Model</span>
              <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">How We Make <span className="text-gold">Money.</span></h3>
              
              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Travel Club</h4>
                       <p className="text-obsidian/60 italic">Memberships, curated trips, brand partnerships.</p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Apparel Line</h4>
                       <p className="text-obsidian/60 italic">Direct-to-consumer drops & collabs.</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Animation / IP</h4>
                    <p className="text-obsidian/60 italic">Licensing, streaming deals, merch, brand placements.</p>
                 </div>
                 <div className="pt-8 border-t border-obsidian/5">
                    <span className="font-mono text-[10px] text-obsidian/30 uppercase tracking-widest">Long-term: Mobile games, collectibles, educational spin-offs.</span>
                 </div>
              </div>
           </div>
        </section>

        {/* SLIDE 11/12: THE ASK */}
        <section className="bg-obsidian text-paper p-24 lg:p-40 space-y-24 relative overflow-hidden w-screen max-w-none left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" style={{position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', width: '100vw', maxWidth: '100vw'}}>
           <div className="compass-needle absolute -top-40 -right-40 text-gold/5 text-[50vw] pointer-events-none select-none">🧭</div>
           <div className="relative z-10 space-y-16">
              <header className="space-y-6">
                 <span className="font-mono text-xs text-gold uppercase tracking-[0.8em]">11 / Fuel the Foundation</span>
                 <h3 className="text-5xl lg:text-7xl font-serif italic font-bold tracking-tighter uppercase leading-none">The <span className="text-gold">Ask.</span></h3>
              </header>
              
              <div className="grid lg:grid-cols-2 gap-12">
                 <div className="space-y-12">
                    <h4 className="text-2xl font-serif italic font-bold uppercase text-gold">Use of Funds</h4>
                    <ul className="space-y-6">
                       {[
                         'Animation pilot production',
                         'Travel platform & member onboarding',
                         'Core team support',
                         'Brand partnerships & launch marketing'
                       ].map((use, i) => (
                         <li key={i} className="flex gap-4 items-center">
                            <span className="w-2 h-2 bg-gold rounded-full"></span>
                            <span className="text-xl italic font-light">{use}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="p-12 border-2 border-gold/20 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 text-center">
                       <span className="font-mono text-xs uppercase tracking-widest text-gold/60">Target Raise</span>
                       <div className="text-[7rem] md:text-[10rem] font-serif italic font-extrabold text-gold drop-shadow-lg flex items-baseline justify-center gap-2">
                         <span className="leading-none">$</span>
                         <span className="leading-none" style={{letterSpacing: '-0.05em'}}>1M</span>
                       </div>
                    </div>
                    <p className="text-xl italic text-paper/60 text-center leading-relaxed">
                       Allowing us to expand our fashion line, develop travel experiences, and grow our community.
                    </p>
                    <div className="pt-6 text-center">
                      <span className="font-mono text-lg text-gold">Contact: </span>
                      <a href="mailto:bantuantstravelclub@gmail.com" className="font-mono text-lg text-white underline hover:text-gold">bantuantstravelclub@gmail.com</a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL SLIDE: THANK YOU */}
        <section className="py-24 text-center space-y-10">
           <div className="space-y-4">
              <h2 className="text-[15vw] font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">Thank <span className="text-gold">You.</span></h2>
              <p className="text-3xl italic text-obsidian/40">Do you want to work with us?</p>
           </div>
           <div className="flex flex-col items-center gap-8 pt-12">
              <div className="font-mono text-lg text-obsidian tracking-[0.2em]">bantuantstravelclub.com</div>
              <div className="font-mono text-lg text-obsidian tracking-[0.2em]">+1 (424) 781-4762</div>
              <div className="w-1 h-32 bg-gold opacity-30"></div>
              <button onClick={() => setCurrentView('home')} className="btn-travel">Return Home</button>
           </div>
        </section>

      </div>
    </div>
  );

  const renderClub = () => (
    <div className="animate-fade-up bg-paper">
      {/* Club Hero with Permanent Dark Overlay */}
      <div className="relative w-full h-[75vh] lg:h-[85vh] overflow-hidden bg-obsidian">
        <img 
          src="/batctracelclubpic.png" 
          className="w-full h-full object-cover opacity-40"
          alt="Travel Club Hero"
        />
        <div className="absolute inset-0 bg-obsidian/40"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-8 z-10">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-gold uppercase tracking-[1em] block">MEMBERS_ONLY</span>
            <h2 className="text-[6vw] lg:text-[7vw] font-serif italic font-bold tracking-tighter leading-none text-paper uppercase">
              Travel <span className="text-gold">Africa.</span>
            </h2>
          </div>
          <p className="text-base lg:text-xl italic text-paper/70 max-w-3xl">
            Join an elite community of cultural explorers on immersive journeys through Africa and the Diaspora. Learn from history. Celebrate culture.
          </p>
          <button
            onClick={() => setIsClubFormOpen(true)}
            className="mt-4 px-8 py-4 bg-obsidian text-paper font-mono text-[10px] font-bold uppercase tracking-[0.4em] rounded hover:bg-gold hover:text-obsidian transition-all shadow-lg"
            aria-label="Join Club"
          >
            Join Club
          </button>
        </div>
      </div>

      <section className="py-32 px-6 lg:px-24 max-w-7xl mx-auto space-y-12">
        <header className="space-y-8 max-w-5xl">
          <div className="passport-stamp text-gold border-gold">MEMBERS_ONLY</div>
          <div className="flex flex-wrap gap-6 pt-8">
            <button 
              onClick={() => setIsClubFormOpen(true)}
              className="btn-travel bg-obsidian text-paper hover:bg-gold hover:text-obsidian"
            >
              Join Club
            </button>
            <button 
              onClick={() => scrollToId('experiences')} 
              className="btn-travel"
            >
              View Experiences <span className="text-gold">↓</span>
            </button>
          </div>
        </header>
      </section>

      <section className="py-24 px-6 lg:px-24 bg-obsidian text-paper">
        <div className="max-w-7xl mx-auto space-y-24">
          <header className="space-y-6">
            <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase">Our Philosophy</span>
            <h3 className="text-3xl lg:text-5xl font-serif italic font-bold tracking-tighter uppercase leading-none">
              A Holistic Approach to <br /> <span className="text-gold">Mind, Body, & Spirit.</span>
            </h3>
          </header>

          <div className="grid lg:grid-cols-3 gap-16">
            {CLUB_PILLARS.map(pillar => (
              <div key={pillar.id} className="space-y-10 group">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                     <span className="text-xs font-mono text-gold/40">{pillar.title}</span>
                     <div className="flex-1 h-[1px] bg-white/10 group-hover:bg-gold/30 transition-colors"></div>
                  </div>
                  <h4 className="text-2xl font-serif italic font-bold uppercase text-gold">{pillar.subtitle}</h4>
                </div>
                <p className="text-xl text-white/50 italic leading-relaxed">{pillar.description}</p>
                <ul className="space-y-4">
                  {pillar.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 bg-red/40 rounded-full"></span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiences" className="py-24 px-6 lg:px-24 bg-paper">
        <div className="max-w-7xl mx-auto space-y-24">
          <header className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-obsidian/5 pb-16">
            <div className="space-y-4">
              <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase">Season Schedule</span>
              <h3 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">Upcoming <br/><span className="text-gold">Experiences.</span></h3>
            </div>
            <p className="text-xl italic text-obsidian/40 max-w-sm">Meticulously curated journeys designed for cultural depth and transformation.</p>
          </header>

          <div className="space-y-24">
            {CLUB_EXPERIENCES.map((exp, idx) => (
              <div key={exp.id} className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`space-y-12 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-8">
                    <div className="passport-stamp text-red border-red opacity-100">{exp.status.toUpperCase()}</div>
                    <span className="font-mono text-xs text-obsidian/30 uppercase tracking-[0.3em]">{exp.date} • {exp.duration}</span>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-3xl lg:text-5xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">{exp.title}</h4>
                    <p className="text-xl font-mono text-gold uppercase tracking-widest">{exp.location}</p>
                    <p className="text-xl text-obsidian/60 italic leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <span className="font-mono text-[10px] text-obsidian/30 uppercase tracking-[0.3em]">Highlights:</span>
                        <ul className="space-y-2">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-xs font-serif italic text-obsidian/50">• {h}</li>
                          ))}
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <span className="font-mono text-[10px] text-obsidian/30 uppercase tracking-[0.3em]">Tier_Cost:</span>
                        <p className="text-3xl font-serif italic font-bold text-obsidian">{exp.price}</p>
                        {exp.id !== 'exp-01' && (
                          <button 
                            onClick={() => setSelectedExperience(exp)}
                            className="w-full py-4 bg-obsidian text-paper font-mono text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-obsidian transition-all"
                          >
                            Reserve Spot
                          </button>
                        )}
                     </div>
                  </div>
                </div>
                <div className={`aspect-[4/5] bg-obsidian relative overflow-hidden group shadow-2xl ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                   <img src={exp.image} className="w-full h-full object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[6s]" alt={exp.title} />
                   <div className="absolute inset-0 vignette-heavy"></div>
                   <div className="absolute top-12 right-12 passport-stamp text-white rotate-12 scale-125">AUTHENTIFIED</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-24 bg-white border-t border-obsidian/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-5 font-serif italic font-bold text-[20vw] pointer-events-none select-none uppercase tracking-tighter text-obsidian">BENEFITS</div>
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <header className="space-y-4">
            <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase">The Membership</span>
            <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">Why Join <span className="text-gold">Our Club.</span></h3>
            <p className="text-xl italic text-obsidian/40 max-w-xl">Experience Africa like never before with benefits designed for the discerning traveler.</p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
            {CLUB_BENEFITS.map((benefit, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="flex items-center gap-6">
                   <span className="font-mono text-xl text-gold/30">0{idx + 1}</span>
                   <div className="flex-1 h-[1px] bg-obsidian/5 group-hover:bg-gold/40 transition-colors"></div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-serif italic font-bold text-obsidian uppercase">{benefit.title}</h4>
                  <p className="text-obsidian/50 italic leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-24 text-center">
            <button
              onClick={() => setIsClubFormOpen(true)}
              className="btn-travel bg-obsidian text-paper hover:bg-gold hover:text-obsidian text-lg px-20"
            >
              Join the Club
            </button>
            <p className="mt-8 font-mono text-[8px] text-obsidian/30 uppercase tracking-[0.5em]">Selective Enrollment_Q4 2088 Cycle</p>
          </div>
        </div>
      </section>


    </div>
  );

  const renderAnimation = () => (
    <div className="animate-fade-up bg-paper">
      {/* Hero Section */}
      <header className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-obsidian text-paper">
        <div className="absolute inset-0 z-0">
          <img 
            src="/batcposter1.jpeg" 
            className="w-full h-full object-cover opacity-50"
            alt="Animation Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-6 space-y-6">
          <span className="font-mono text-[9px] tracking-[0.8em] text-gold uppercase">🎬 Afrofuturist Animation Series</span>
          <h1 className="text-4xl lg:text-6xl font-serif italic font-bold text-paper leading-[0.95] tracking-tighter uppercase">
            The Bantu Ants <br />
            <span className="text-gold">Universe</span>
          </h1>
          <p className="text-xl lg:text-2xl font-serif italic text-paper/80 leading-relaxed font-light">
            Where folklore meets the future
          </p>
          <p className="text-lg lg:text-xl text-paper/60 max-w-3xl mx-auto leading-relaxed">
            An Afrofuturist animated saga that weaves together ancient wisdom and tomorrow's possibilities. Follow our heroes as they navigate worlds where tradition and technology dance in harmony, and every story holds the power to reshape destiny.
          </p>
        </div>
      </header>

      {/* The Story Section */}
      <section className="py-32 px-6 lg:px-24 max-w-5xl mx-auto space-y-12">
        <header className="space-y-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">The <span className="text-gold">Story</span></h2>
        </header>
        <p className="text-base lg:text-xl text-obsidian/70 leading-relaxed font-serif italic text-center">
          In the year 2088, beneath a world ruled by the devouring Locust Empire, a forgotten nation of Bantu Ants fights to reclaim its buried history. When a rebellious miner named Kamau uncovers a message from a vanished Queen, he and his crew are thrust into a time-bending struggle that links the kingdom's past and future. Part political satire, part Afrofuturist odyssey, Bantu Ants Travel Club unearths the truth about power, identity, and memory — proving that even underground, revolution finds a way to rise.
        </p>
      </section>

      {/* Key Features */}
      <section className="py-32 px-6 lg:px-24 bg-white border-y border-obsidian/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-6 p-10 border border-obsidian/10 hover:border-gold transition-colors text-center">
            <span className="text-5xl">🌍</span>
            <h3 className="text-2xl font-serif italic font-bold uppercase text-obsidian">Afrofuturism</h3>
            <p className="text-obsidian/60 leading-relaxed italic">Blending African history, mythology, and cutting-edge sci-fi imagination</p>
          </div>
          <div className="space-y-6 p-10 border border-obsidian/10 hover:border-gold transition-colors text-center">
            <span className="text-5xl">📖</span>
            <h3 className="text-2xl font-serif italic font-bold uppercase text-obsidian">Epic Storytelling</h3>
            <p className="text-obsidian/60 leading-relaxed italic">Multi-layered narratives spanning centuries and dimensions</p>
          </div>
          <div className="space-y-6 p-10 border border-obsidian/10 hover:border-gold transition-colors text-center">
            <span className="text-5xl">🎓</span>
            <h3 className="text-2xl font-serif italic font-bold uppercase text-obsidian">Cultural Education</h3>
            <p className="text-obsidian/60 leading-relaxed italic">Each episode explores real African history and traditions</p>
          </div>
        </div>
      </section>

      {/* Featured Character Deep Dive */}
      <section className="py-20 px-6 lg:px-24 bg-obsidian text-paper">
        <div className="max-w-7xl mx-auto space-y-16">
          <header className="text-center space-y-4">
            <h3 className="text-4xl lg:text-5xl font-serif italic font-bold tracking-tighter text-paper uppercase">Meet the <span className="text-gold">Characters</span></h3>
            <p className="text-xl italic text-paper/40 max-w-2xl mx-auto">Discover the heroes and legends of The Bantu Ants Universe</p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20">
            <img 
              src={CHARACTERS[0]?.image || "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1200"} 
              className="w-full h-full object-cover" 
              alt="Kamau the Miner"
            />
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_01</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">🧱 Kamau <span className="text-gold">the Miner</span></h3>
              <p className="text-xl font-serif italic text-paper/60">Miner. Visionary. Reluctant Leader.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              By day, he works the Kwanzite seams under the Council’s eye. By night, he plans heists to reclaim what was looted from his people. Haunted by vanished parents and the hum of a lost Queen, he’d rather work alone—but destiny has drafted him to unite the broken pieces.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Ancestral Intuition</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Tactical Foresight</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Kwanzite Resonance</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Stoic, burdened, quietly defiant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_02</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">🛡️ Zulu <span className="text-gold">the Guardian</span></h3>
              <p className="text-xl font-serif italic text-paper/60">Last Kin of Shaka. The Crew’s Heartbeat.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              His humor is a weapon that keeps the crew from drowning in despair. Beneath it burns grief—his family was taken for “extraction.” The last of his line, he channels ancestral battle genius through street-smart tactics and unbreakable loyalty.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Ancestral Battle Trance</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Psychological Warfare</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Unshakable Loyalty</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Warm, grief-forged, fearless</p>
              </div>
            </div>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20 order-1 lg:order-2">
            <img 
              src="/zuluantpose.png" 
              className="w-full h-full object-cover" 
              alt="Zulu the Guardian"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20">
            <img 
              src="/finainadress.png" 
              className="w-full h-full object-cover" 
              alt="Fina the Courier"
            />
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_03</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">⚡ Fina <span className="text-gold">the Courier</span></h3>
              <p className="text-xl font-serif italic text-paper/60">Okogie-Raised. Warrior. Hidden Heir.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              Her wings were severed to save her life. Raised in secret by rebel fighters, she masters ceremonial Fire Dance combat and guards lost parables. A glowing sigil on her thorax marks a lineage she didn’t choose—she fights not for a throne, but for truth stolen from her cradle.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Royal Genetic Memory</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Ceremonial Combat</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Light-Wing Manifestation</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Guarded, resolute, dutiful</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_04</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">💻 Bytez <span className="text-gold">the Hacker</span></h3>
              <p className="text-xl font-serif italic text-paper/60">Graffiti Prophet. Tech Griot. Believer.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              An orphan of the mines who speaks in code and circuit boards. He tags cities with the hidden symbol of the Travel Club, builds drones from scrap, and dreams of being chosen. His faith in old legends is the crew’s compass; his reckless brilliance is their greatest risk—and hope.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Afro-Cyberpunk Hacking</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Drone Artistry</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Graffiti Cartography</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Reckless, brilliant, hopeful</p>
              </div>
            </div>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20 order-1 lg:order-2">
            <img 
              src="/bytez.png" 
              className="w-full h-full object-cover" 
              alt="Bytez the Hacker"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20">
            <img 
              src="/pietant.png" 
              className="w-full h-full object-cover" 
              alt="Piet the Scout"
            />
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_05</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">🧭 Piet Kruger <span className="text-gold">the Scout</span></h3>
              <p className="text-xl font-serif italic text-paper/60">The Elite Enforcer. The Torn.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              Raised on Bantu lullabies, armed with Boer orders. He enforces the system that broke his heart. Loyalty cracks under the weight of what he knows—and his impossible love for a Princess who looks past him.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Counter-Insurgency Tactics</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Insider System Knowledge</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Conflicted, disciplined, loyal at war with himself</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="passport-stamp text-gold border-gold inline-block">CHARACTER_FILE_06</div>
              <h3 className="text-3xl lg:text-4xl font-serif italic font-bold tracking-tighter uppercase">⛪ Bishop Mokorokoro <span className="text-gold">the High Priest</span></h3>
              <p className="text-xl font-serif italic text-paper/60">The Priest. The Power Broker.</p>
            </div>
            <p className="text-lg text-paper/70 leading-relaxed italic">
              A figure of immense public reverence who shapes faith into influence. From his cathedral, he controls the flow of spiritual narrative and vital resources, weaving doctrine with strategy. His public sermons speak of unity and devotion, while in the shadows, he brokers in a far more earthly currency of power. He is a bridge between worlds, masterfully navigating the devotions of his flock and the demands of a continent's hidden economy.
            </p>
            <div className="space-y-6 border-t border-paper/10 pt-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-4">Powers & Abilities</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Doctrinal Manipulation</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Institutional Authority</span>
                  <span className="px-4 py-2 bg-paper/10 border border-gold/30 font-mono text-xs uppercase tracking-wider">Veiled Negotiation</span>
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold mb-3">Personality</h4>
                <p className="text-paper/60 italic">Publicly devout, privately ruthless; masterful orator concealing ruthless ambition</p>
              </div>
            </div>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-paper/10 border border-gold/20 order-1 lg:order-2">
            <img 
              src="/bishop.png" 
              className="w-full h-full object-cover" 
              alt="Bishop Mokorokoro the High Priest"
            />
          </div>
        </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-24 px-6 lg:px-24 bg-paper border-t border-obsidian/5">
        <div className="max-w-7xl mx-auto space-y-24">
          <header className="text-center space-y-4">
            <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase">🎨 Behind the Scenes</span>
            <h2 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">Creating the <span className="text-gold">Universe</span></h2>
            <p className="text-xl italic text-obsidian/50 max-w-2xl mx-auto">Take a peek into our creative process as we bring the Kwanzite Chronicles to life</p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTION_INSIGHTS.map(insight => (
              <div key={insight.id} className="group space-y-4">
                <div className="aspect-[16/9] md:aspect-[3/2] lg:aspect-[5/3] overflow-hidden bg-obsidian/5 border border-obsidian/10">
                  <img 
                    src={insight.image} 
                    className="w-full h-full object-cover scale-105 transition-all duration-700 group-hover:scale-110" 
                    alt={insight.title} 
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif italic font-bold uppercase text-obsidian">{insight.title}</h3>
                  <p className="text-sm text-obsidian/60 italic leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Timeline */}
      <section className="py-24 px-6 lg:px-24 bg-obsidian text-paper">
        <div className="max-w-7xl mx-auto space-y-24">
          <header className="text-center space-y-4">
            <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase">Production Timeline</span>
            <h2 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter uppercase">The <span className="text-gold">Journey</span></h2>
          </header>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-8 border border-paper/10 p-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic font-bold text-gold">Phase 1: Development</h3>
                <span className="inline-block px-4 py-1 bg-gold/20 border border-gold font-mono text-xs uppercase tracking-wider text-gold">In Progress</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span className="text-paper/70">Character Design & Concept Art</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span className="text-paper/70">Story Bible & World Building</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span className="text-paper/70">Pilot Script</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Voice Actor Casting</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8 border border-paper/10 p-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic font-bold text-paper">Phase 2: Production</h3>
                <span className="inline-block px-4 py-1 bg-paper/10 border border-paper/30 font-mono text-xs uppercase tracking-wider text-paper/50">Upcoming</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Storyboarding</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Animation Production</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Music & Sound Design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Voice Recording</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8 border border-paper/10 p-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic font-bold text-paper">Phase 3: Launch</h3>
                <span className="inline-block px-4 py-1 bg-paper/10 border border-paper/30 font-mono text-xs uppercase tracking-wider text-paper/50">2026</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Pilot Episode Release</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Season 1 (6 Episodes)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Community Events</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-paper/30 mt-1">○</span>
                  <span className="text-paper/50">Merchandise Launch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Season One Episodes section hidden as requested */}

      {/* Historical Trails */}
      <section className="py-24 px-6 lg:px-24 bg-white border-t border-obsidian/5">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="passport-stamp text-gold border-gold">RESEARCH_ARCHIVE</div>
            <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">Historical <span className="text-gold">Trails.</span></h3>
            <p className="text-xl italic text-obsidian/60 leading-relaxed">
              Every character and location in Bantu Ants is rooted in real-world African research. We map fiction onto history to ensure our future is grounded in truth.
            </p>
            <div className="space-y-8">
              {HISTORICAL_TRAILS.map(trail => (
                <div key={trail.id} className="border-l-2 border-gold pl-8 space-y-2">
                  <span className="font-mono text-[10px] text-gold uppercase tracking-[0.5em]">{trail.location}</span>
                  <h4 className="text-xl font-serif italic font-bold text-obsidian">{trail.subject} → {trail.fictionLink}</h4>
                  <p className="text-obsidian/40 italic text-sm">{trail.realityRoot}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-row gap-6 bg-obsidian rounded-lg overflow-hidden shadow-2xl mt-16">
            {/* Real Great Zimbabwe */}
            <div className="flex-1 relative min-h-[320px] md:min-h-[420px] lg:min-h-[500px]">
              <img src="/greatzim.jpg" className="w-full h-full object-cover grayscale opacity-80" alt="Great Zimbabwe (Real)" />
              <div className="absolute bottom-3 left-3 bg-paper/90 text-obsidian text-xs font-mono px-3 py-1 rounded shadow">Great Zimbabwe (Real)</div>
            </div>
            {/* Bantu Ants World Version */}
            <div className="flex-1 relative min-h-[320px] md:min-h-[420px] lg:min-h-[500px]">
              <img src="/greatzimbatcworld.png" className="w-full h-full object-cover" alt="Great Zimbabwe (Bantu Ants World)" />
              <div className="absolute bottom-3 left-3 bg-paper/90 text-obsidian text-xs font-mono px-3 py-1 rounded shadow">Bantu Ants World</div>
            </div>
          </div>
          <div className="pt-4 text-center max-w-2xl mx-auto">
            <p className="text-xs text-obsidian/60 italic leading-relaxed">
              The ruins of Great Zimbabwe – the capital of the Queen of Sheba, according to an age-old legend – are a unique testimony to the Bantu civilization of the Shona between the 11th and 15th centuries. The city, which covers an area of nearly 80 ha, was an important trading centre and was renowned from the Middle Ages onwards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderHome = () => (
    <div className="animate-fade-up">
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-paper -mt-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-10 scale-105"
            alt="Expedition Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-6 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[1px] h-16 bg-gold opacity-50"></div>
            <span className="font-mono text-xs lg:text-[9px] tracking-[0.4em] lg:tracking-[0.6em] text-obsidian/60 uppercase">
              ✨ Where Storytelling Meets Travel & Culture
            </span>
          </div>
          <h1 className="text-[10vw] lg:text-[6vw] font-serif italic font-bold text-obsidian leading-[0.95] tracking-tighter uppercase">
            Bantu Ants <br />
            <span className="text-gold">Travel Club</span>
          </h1>
          <p className="text-lg lg:text-xl font-serif italic text-obsidian/70 max-w-2xl mx-auto leading-relaxed">
            Experience Africa through Afrofuturist storytelling, immersive travel adventures, and culture-driven fashion. Join us on a journey that bridges heritage and tomorrow.
          </p>
          <div className="flex justify-center gap-6 pt-6">
            <button 
              onClick={() => setCurrentView('shop')}
              className="px-12 py-6 bg-gold text-obsidian font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-obsidian hover:text-white transition-all"
            >
              Fund the Series
            </button>
            <button
              onClick={() => setIsClubFormOpen(true)}
              className="px-12 py-6 bg-obsidian text-paper font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-obsidian transition-all"
            >
              Join the Club
            </button>
          </div>
        </div>
      </header>

      <section id="visionaries" className="pt-32 pb-12 bg-paper border-t border-obsidian/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-24 space-y-20 mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <header className="space-y-8">
              <div className="passport-stamp text-gold opacity-60 border-gold scale-90 origin-left uppercase">Origins_Archive</div>
              <h2 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-none">
                A Club Built on <span className="text-gold">Visionaries.</span>
              </h2>
              <p className="text-xl font-serif italic text-obsidian/50 leading-relaxed font-light">
                Inspired by leaders who imagined a free, unified, and future-facing Africa.
              </p>
            </header>
            <div className="space-y-8 pt-4">
              <p className="text-xl font-serif italic text-obsidian/60 leading-relaxed">
                Bantu Ants Travel Club is rooted in African self-determination, imagination, and movement. 
                Our universe draws inspiration from revolutionary thinkers and builders who challenged colonial systems and dared to imagine something greater.
              </p>
              <div className="flex items-center justify-between border-l-2 border-gold pl-8">
                <p className="text-xl font-serif italic text-obsidian/60 leading-relaxed">
                  Through allegorical characters and Afrofuturist storytelling, we honor the spirit of our icons.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group/marquee">
          {/* Mobile: Swipeable Carousel */}
          <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 -mx-6 px-6">
            <div className="flex gap-4">
              {CHARACTERS.filter(char => char.id !== 'kamau').map(char => (
                <div key={char.id} className="w-[42vw] flex-shrink-0 snap-start">
                  <CharacterCard char={char} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Marquee */}
          <div className="hidden lg:block">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee hover:pause flex items-start gap-2 py-10">
              {CHARACTERS.filter(char => char.id !== 'kamau').map(char => (
                <div key={char.id} className="w-[14vw] flex-shrink-0">
                  <CharacterCard char={char} />
                </div>
              ))}  
              {CHARACTERS.filter(char => char.id !== 'kamau').map(char => (
                <div key={`${char.id}-dup`} className="w-[14vw] flex-shrink-0">
                  <CharacterCard char={char} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-40 px-6 lg:px-24 bg-paper border-t border-obsidian/5">
        <div className="max-w-7xl mx-auto space-y-32">
          <header className="space-y-8 max-w-4xl">
            <span className="font-mono text-[10px] tracking-[0.8em] text-gold uppercase block">The Pillars</span>
            <h2 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter text-obsidian uppercase leading-[0.9]">
              Three Ways to <span className="text-gold">Experience.</span>
            </h2>
            <p className="text-base lg:text-xl italic text-obsidian/50 font-light leading-tight">
              Connect with African heritage through animation, travel, and fashion.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div 
              className="relative group overflow-hidden rounded-xl border border-obsidian/10 bg-gradient-to-br from-obsidian via-obsidian to-black text-paper p-8 flex flex-col gap-6 shadow-2xl cursor-pointer"
              onClick={() => setCurrentView('animation')}
            >
              <div className="absolute -right-6 -top-10 text-[9rem] text-white/5">🎬</div>
              <div className="flex items-center gap-3">
                <div className="passport-stamp text-gold border-gold bg-white/10">Watch</div>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-white/40">Storyworld</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-serif italic font-bold tracking-tight">Animation Drop</h3>
                <p className="text-base lg:text-lg text-white/70 leading-relaxed">
                  Afrofuturist saga where ancient wisdom meets tomorrow's vision. Binge the signal files and dossiers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase font-mono tracking-[0.35em] text-white/60">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Pilot 01</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Lore Bible</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Characters</span>
              </div>
              <button className="mt-auto inline-flex items-center justify-between w-full px-5 py-4 bg-gold text-obsidian font-mono text-[10px] font-bold uppercase tracking-[0.5em] transition-transform duration-300 group-hover:-translate-y-0.5">
                Explore Series <span>→</span>
              </button>
            </div>

            <div 
              className="relative group overflow-hidden rounded-xl border border-obsidian/10 bg-white text-obsidian p-8 flex flex-col gap-6 shadow-xl cursor-pointer"
              onClick={() => navigateToClubAndScroll()}
            >
              <div className="absolute -right-6 -top-10 text-[9rem] text-obsidian/5">🌍</div>
              <div className="flex items-center gap-3">
                <div className="passport-stamp text-gold border-gold bg-obsidian/5">Travel</div>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-obsidian/40">Immersion</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-serif italic font-bold tracking-tight">Travel Club</h3>
                <p className="text-base lg:text-lg text-obsidian/70 leading-relaxed">
                  Immersive journeys across Africa that let you live inside the narrative. Limited seats, hosted by our guides.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase font-mono tracking-[0.35em] text-obsidian/60">
                <span className="px-3 py-1 rounded-full bg-obsidian/5 border border-obsidian/10">Expeditions</span>
                <span className="px-3 py-1 rounded-full bg-obsidian/5 border border-obsidian/10">Passports</span>
                <span className="px-3 py-1 rounded-full bg-obsidian/5 border border-obsidian/10">Community</span>
              </div>
              <button className="mt-auto inline-flex items-center justify-between w-full px-5 py-4 border-2 border-obsidian font-mono text-[10px] font-bold uppercase tracking-[0.5em] transition-transform duration-300 group-hover:-translate-y-0.5">
                View Trips <span>→</span>
              </button>
            </div>

            <div 
              className="relative group overflow-hidden rounded-xl border border-obsidian/10 bg-gradient-to-br from-obsidian via-[#0f1a1a] to-black text-paper p-8 flex flex-col gap-6 shadow-2xl cursor-pointer"
              onClick={() => setCurrentView('shop')}
            >
              <div className="absolute -right-6 -top-10 text-[9rem] text-white/5">👕</div>
              <div className="flex items-center gap-3">
                <div className="passport-stamp text-gold border-gold bg-white/10">Merch</div>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-white/40">Artifacts</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-serif italic font-bold tracking-tight">The Collection</h3>
                <p className="text-base lg:text-lg text-white/70 leading-relaxed">
                  Curated fashion and gear honoring African heritage. Drops fund the animated pilot and field missions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase font-mono tracking-[0.35em] text-white/60">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Limited</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Pilot Fund</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Capsule</span>
              </div>
              <button className="mt-auto inline-flex items-center justify-between w-full px-5 py-4 bg-gold text-obsidian font-mono text-[10px] font-bold uppercase tracking-[0.5em] transition-transform duration-300 group-hover:-translate-y-0.5">
                Browse Shop <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-24 bg-paper border-t border-obsidian/5">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Product Card */}
            <div className="bg-white text-obsidian p-12 lg:p-16 rounded-lg shadow-2xl border border-gold/10 space-y-8 order-2 lg:order-1">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="passport-stamp text-red border-red opacity-100 inline-block">SERIES_FUEL_01</div>
                        <h3 className="text-3xl lg:text-4xl font-serif italic font-bold leading-tight text-obsidian">Nomad <span className="text-gold">Travel Backpack.</span></h3>
                        <div className="mt-2 inline-flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-gold">Pre-Order Live</span>
                          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-obsidian/40">Ships Q2 2026</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-lg text-obsidian/80 font-bold">
                            $299 <span className="text-sm text-obsidian/50 line-through">$399</span>
                        </p>
                        <p className="text-base italic text-obsidian/60">
                            Premium embossed leather backpack. Limited edition drop. 100% of profits fund the Bantu Ants animated pilot.
                        </p>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-obsidian/10">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-obsidian/50">Features</h4>
                        <ul className="space-y-2 text-sm text-obsidian/70">
                            <li className="flex items-start gap-3">
                                <span className="text-gold mt-1">✓</span>
                                <span>Hand-stitched signature embossing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold mt-1">✓</span>
                                <span>Water-resistant leather with brass hardware</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold mt-1">✓</span>
                                <span>Interior organization pockets</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gold mt-1">✓</span>
                                <span>Ergonomic straps for extended wear</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-obsidian/10">
                    <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-[0.4em] text-obsidian/50">Quantity</label>
                        <input type="number" min="1" defaultValue="1" className="w-20 px-4 py-3 border border-obsidian/10 text-center font-mono focus:border-gold outline-none transition-colors" disabled />
                    </div>
                    <div className="w-full py-5 bg-obsidian text-paper font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-center rounded opacity-80 cursor-not-allowed">
                      Pre-order available Jan 31st
                    </div>
                    <p className="font-mono text-[8px] text-center text-obsidian/30 uppercase tracking-[0.5em]">Exclusive_Limited_Drop • Free Shipping • Pre-order available Jan 31st</p>
                </div>
            </div>
            
            {/* Bag Images (Stacked) */}
            <div className="bg-white rounded-lg shadow-2xl border border-obsidian/10 order-1 lg:order-2 h-full">
              <div className="flex flex-col h-full gap-4 p-4">
                <img 
                  src="/bagpackfront.png" 
                  className="w-full h-1/2 object-contain" 
                  alt="Fund-Bag Front"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1200'; }}
                />
                <img 
                  src="/bagpackback.png" 
                  className="w-full h-1/2 object-contain" 
                  alt="Fund-Bag Back"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1200'; }}
                />
              </div>
            </div>
        </div>
      </section>

      {/* Shop the Collection Section */}
      <section className="py-32 px-6 lg:px-24 bg-obsidian text-paper border-t border-paper/10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-6xl font-serif italic font-bold tracking-tighter">
              🛍️ Shop the <span className="text-gold">Collection</span>
            </h2>
            <p className="text-2xl lg:text-3xl font-serif italic text-paper/80 leading-relaxed">
              Wear the Story
            </p>
            <p className="text-lg lg:text-xl text-paper/60 max-w-3xl mx-auto leading-relaxed">
              Afrofuturist fashion meets everyday comfort. Each piece tells a story and connects you to the Bantu Ants universe, whether you're traveling or living your daily adventure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {/* Men's Collection */}
            <button
              onClick={() => setCurrentView('shop')}
              className="group relative overflow-hidden h-96 rounded-lg border border-gold/20 hover:border-gold transition-all duration-300 hover:scale-105"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: 'url(/polomodel.png)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-12 space-y-4">
                <h3 className="text-3xl font-serif italic font-bold text-paper group-hover:text-gold transition-colors">
                  Men's Collection
                </h3>
                <p className="text-base text-paper/80 font-mono uppercase tracking-[0.3em] text-[9px]">
                  Explore the Archive →
                </p>
              </div>
            </button>
            
            {/* Women's Collection */}
            <button
              onClick={() => setCurrentView('shop')}
              className="group relative overflow-hidden h-96 rounded-lg border border-gold/20 hover:border-gold transition-all duration-300 hover:scale-105"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: 'url(/femmodel.png)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-12 space-y-4">
                <h3 className="text-3xl font-serif italic font-bold text-paper group-hover:text-gold transition-colors">
                  Women's Collection
                </h3>
                <p className="text-base text-paper/80 font-mono uppercase tracking-[0.3em] text-[9px]">
                  Explore the Archive →
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderPreOrder = () => {
    const backpack = allProducts.find(p => p.id === 'pack-01');
    if (!backpack) return null;

    return (
      <div className="animate-fade-up bg-paper min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/90 via-obsidian/70 to-paper"></div>
          <div className="absolute inset-0 bg-[url('/bagad2.png')] bg-cover bg-center opacity-30"></div>
          
          <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
            <div className="inline-block px-6 py-2 bg-gold/20 border-2 border-gold">
              <span className="font-mono text-xs tracking-[0.5em] text-gold uppercase">Exclusive Pre-Order</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-serif italic font-bold text-paper">
              Nomad Travel Backpack
            </h1>
            <p className="text-2xl text-paper/80 font-light">The Collector's Edition</p>

          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-paper/60 hover:text-paper transition-colors animate-bounce"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </section>

        {/* What's Included Section */}
        <section className="py-24 px-6 lg:px-24 bg-obsidian/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-serif italic font-bold text-obsidian">
                What's <span className="text-gold">Included</span>
              </h2>
              <p className="text-lg text-obsidian/60 max-w-2xl mx-auto">
                More than a purchase—it's membership into an exclusive creative movement
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Main Product */}
              <div className="bg-paper p-8 space-y-6 border-2 border-gold">
                <div className="aspect-square bg-obsidian/5 flex items-center justify-center">
                  <img src="/bagpackbat.png" alt="Backpack" className="w-full h-full object-contain mix-blend-multiply scale-90" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-mono uppercase tracking-wider">Main Item</span>
                  <h3 className="text-xl font-serif italic font-bold text-obsidian">Nomad Backpack</h3>
                  <p className="text-sm text-obsidian/60">Premium embossed leather, water-resistant, multi-compartment design. Ships Q2 2026.</p>
                </div>
              </div>

              {/* Immediate Bonus 1 */}
              <div className="bg-paper p-8 space-y-6">
                <div className="aspect-square bg-obsidian/5 flex items-center justify-center">

                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-green-600/20 text-green-700 text-xs font-mono uppercase tracking-wider">Ships Now</span>
                  <h3 className="text-xl font-serif italic font-bold text-obsidian">Limited T-Shirt</h3>
                  <p className="text-sm text-obsidian/60">Exclusive pre-order edition tee. Premium cotton, collector's tag. Ships immediately.</p>
                </div>
              </div>

              {/* Immediate Bonus 2 */}
              <div className="bg-paper p-8 space-y-6">
                <div className="aspect-square bg-obsidian/5 flex items-center justify-center">
                  <img src="/hats.jpeg" alt="Bucket Hat" className="w-full h-full object-contain mix-blend-multiply scale-90" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-green-600/20 text-green-700 text-xs font-mono uppercase tracking-wider">Ships Now</span>
                  <h3 className="text-xl font-serif italic font-bold text-obsidian">Bucket Hat</h3>
                  <p className="text-sm text-obsidian/60">Signature Bantu Ants embroidered bucket hat. One size fits all. Ships immediately.</p>
                </div>
              </div>

              {/* Digital Access */}
              <div className="bg-paper p-8 space-y-6">
                <div className="aspect-square bg-gold/10 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-mono uppercase tracking-wider">Instant Access</span>
                  <h3 className="text-xl font-serif italic font-bold text-obsidian">Backroom Pass</h3>
                  <p className="text-sm text-obsidian/60">Exclusive behind-the-scenes content, production updates, and early access to episodes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backroom Access Details */}
        <section className="py-24 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 border-2 border-gold">
                    <span className="font-mono text-xs tracking-[0.4em] text-gold uppercase">Exclusive Access</span>
                  </div>
                  <h2 className="text-5xl font-serif italic font-bold text-obsidian">
                    Enter the <span className="text-gold">Backroom</span>
                  </h2>
                  <p className="text-lg text-obsidian/70 leading-relaxed">
                    Pre-order members gain lifetime access to our exclusive backroom portal—a digital sanctuary 
                    where art meets authenticity.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-obsidian text-lg">Behind-the-Scenes Videos</h4>
                      <p className="text-sm text-obsidian/60 mt-1">Raw footage from the animation studio, character development sessions, voice recording</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-obsidian text-lg">Production Updates</h4>
                      <p className="text-sm text-obsidian/60 mt-1">Monthly newsletters with concept art, script excerpts, and team insights</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-obsidian text-lg">Early Episode Access</h4>
                      <p className="text-sm text-obsidian/60 mt-1">Watch episodes 48 hours before public release</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-obsidian text-lg">Community Forum</h4>
                      <p className="text-sm text-obsidian/60 mt-1">Connect with other pre-order members and the creative team</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-obsidian/5 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent"></div>
                  <img src="/studio.jpeg" alt="Backroom Access" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-24 bg-obsidian text-paper">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-serif italic font-bold">
                Reserve Your Place in History
              </h2>
              <p className="text-xl text-paper/70 max-w-2xl mx-auto">
                Limited quantity available. Pre-order available Jan 31st to secure your collector's edition backpack, 
                immediate bonus items, and lifetime backroom access.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  addToCart(backpack, 1);
                  setIsCheckoutOpen(true);
                }}
                className="px-16 py-6 bg-gold text-obsidian font-sans text-base font-bold uppercase tracking-wider transition-all text-center inline-block opacity-60 cursor-not-allowed"
                disabled
              >
                Pre-order available Jan 31st • $299
              </button>
              <p className="text-sm text-paper/40">
                T-shirt & bucket hat ship immediately • Backpack ships Q2 2026
              </p>
            </div>

            <div className="pt-8 flex items-center justify-center gap-6 text-paper/40 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Full Refund Guarantee</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderProductDetail = () => {
    // Show full detail page for backpack, otherwise show 'Product not available'
    if (selectedProduct && selectedProduct.id === 'pack-01') {
      return renderPreOrder();
    }
    return (
      <div className="animate-fade-up bg-white min-h-screen flex items-center justify-center">
        <span className="text-2xl text-obsidian/60 font-light">Product not available</span>
      </div>
    );
  };

  const renderShop = () => {
    return (
      <div className="animate-fade-up bg-paper min-h-screen">
        <ImageGenerator 
          title={<>The <span className="text-gold">Archive.</span></>}
          subtitle="A conversation between heritage and the future. High-performance garments and artifacts for the modern nomad."
          prompt="A high-end Afrofuturist concept store interior. Obsidian floating shelving with glowing kente-patterned garments, robotic loom tailors, golden hour desert light pouring in, cinematic, 8k resolution."
          fallbackImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
        />

        <header className="py-24 px-6 lg:px-24 max-w-7xl mx-auto text-center space-y-12">
           <div className="space-y-4">
              <span className="font-mono text-[10px] tracking-[1.5em] text-obsidian/20 uppercase">Autumn / Winter 2088</span>
           </div>
           <p className="text-2xl font-light italic text-obsidian/40 max-w-2xl mx-auto leading-relaxed">
             Every piece is a pledge to narrative freedom. Secure your gear to fund the studio.
           </p>
        </header>

        <section className="py-24 px-6 lg:px-24 border-t border-obsidian/5">
           <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex items-center gap-12">
                 <h3 className="text-4xl font-serif italic font-bold uppercase tracking-tighter text-obsidian">Collection: <span className="text-gold">Items</span></h3>
                 <div className="flex-1 h-[1px] bg-obsidian/5"></div>
              </div>
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-24">
                  <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
              <>
                {/* First Row of Products */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                  {allProducts.filter(p => p.id !== 'pack-01').slice(0, 4).map(product => (
                    <div key={product.id}>
                      <ProductCard 
                        product={product} 
                        onPreOrder={(variant) => {
                          addToCart(product, 1, variant);
                        }}
                        onViewDetails={() => viewProductDetail(product)}
                      />
                    </div>
                  ))}
                </div>

                {/* Featured Pre-Order Section - Backpack */}
                {allProducts.find(p => p.id === 'pack-01') && (
                  <div className="my-24 py-16 bg-obsidian/5 -mx-6 lg:-mx-24 px-6 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex items-center gap-12 mb-8">
                        <h3 className="text-xl font-serif italic font-bold uppercase tracking-tighter text-obsidian">
                          Featured: <span className="text-gold">Pre-Order</span>
                        </h3>
                        <div className="flex-1 h-[1px] bg-obsidian/5"></div>
                      </div>

                      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-12 items-center">
                        {/* Larger Image */}
                        <div className="aspect-square overflow-hidden bg-transparent">
                          <img
                            src="/bagpackbat.png"
                            alt="Nomad Travel Backpack"
                            className="w-full h-full object-contain mix-blend-multiply scale-125"
                          />
                        </div>

                        {/* Info */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <span className="inline-block px-3 py-1.5 bg-gold/20 border border-gold text-gold font-mono text-[9px] tracking-[0.4em] uppercase">
                              Pre-Order • Q2 2026
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-serif italic font-bold text-obsidian">
                              Nomad Travel Backpack
                            </h2>
                            <p className="text-2xl text-obsidian/80 font-light">$299</p>
                          </div>

                          <div className="border-t border-obsidian/10 pt-6">
                            <p className="text-sm text-obsidian/70 leading-relaxed">
                              Premium embossed leather backpack with "Bantu Ants Travel Club" insignia. Water-resistant, 
                              multi-compartment design. Support the movement. Pre-order ships Q2 2026.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 border border-obsidian/20 text-[10px] font-mono uppercase tracking-wider text-obsidian/60">
                              Pre-Order
                            </span>
                            <span className="px-3 py-1.5 border border-obsidian/20 text-[10px] font-mono uppercase tracking-wider text-obsidian/60">
                              Q2 2026
                            </span>
                            <span className="px-3 py-1.5 border border-obsidian/20 text-[10px] font-mono uppercase tracking-wider text-obsidian/60">
                              Unisex
                            </span>
                          </div>

                          <div className="flex gap-3 pt-6">
                            <button
                              onClick={() => {
                                const backpack = allProducts.find(p => p.id === 'pack-01');
                                if (backpack) viewProductDetail(backpack);
                              }}
                              className="flex-1 py-4 bg-obsidian text-paper font-sans text-xs font-semibold uppercase tracking-wider hover:bg-obsidian/90 transition-all"
                            >
                              View Details
                            </button>
                            <button
                              className="flex-1 py-4 border-2 border-gold text-gold font-sans text-xs font-semibold uppercase tracking-wider opacity-60 cursor-not-allowed"
                              disabled
                            >
                              Pre-order available Jan 31st
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining Products */}
                {allProducts.filter(p => p.id !== 'pack-01').length > 4 && (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {allProducts.filter(p => p.id !== 'pack-01').slice(4).map(product => (
                      <div key={product.id}>
                        <ProductCard 
                          product={product} 
                          onPreOrder={(variant) => {
                            addToCart(product, 1, variant);
                          }}
                          onViewDetails={() => {
                            // Only show details for backpack
                            if (product.id === 'pack-01') {
                              viewProductDetail(product);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
              )}
           </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-paper selection:bg-gold selection:text-obsidian overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] bg-paper/90 backdrop-blur-md border-b border-obsidian/5 shadow-sm relative">
        <div className="px-8 pt-2 flex justify-center relative">
          <img
            src="/batc_logo_blk_tc.png"
            alt="Bantu Ants Logo"
            className="h-36 w-auto hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => setCurrentView('home')}
          />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden absolute right-0 top-8 flex flex-col gap-1.5 p-4"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-obsidian transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-obsidian transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-obsidian transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="px-8 pb-2 relative">
          <div className="hidden lg:flex gap-10 items-center justify-center relative">
            <NavItem view="home" label="Mission" />
            <NavItem view="animation" label="The Series" />
            <NavItem view="club" label="The Club" />
            <NavItem view="shop" label="Shop (Fuel)" />
            <NavItem view="manifesto" label="Manifesto" />
            
            {/* Cart Icon */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="absolute right-0 flex items-center gap-2 px-4 py-2 hover:text-gold transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-obsidian rounded-full flex items-center justify-center text-xs font-mono font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-paper/95 backdrop-blur-md border-b border-obsidian/5 shadow-lg">
            <div className="flex flex-col items-center gap-6 py-8 px-8">
              <NavItem view="home" label="Mission" />
              <NavItem view="animation" label="The Series" />
              <NavItem view="club" label="The Club" />
              <NavItem view="shop" label="Shop (Fuel)" />
              <NavItem view="manifesto" label="Manifesto" />
              
              <button
                onClick={() => {
                  setIsCheckoutOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-6 py-3 border border-obsidian/20 hover:bg-gold/10 transition-colors rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.4em]">Cart {cartItemCount > 0 && `(${cartItemCount})`}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main>
        {currentView === 'home' && renderHome()}
        {currentView === 'manifesto' && renderManifesto()}
        {currentView === 'shop' && renderShop()}
        {currentView === 'productDetail' && selectedProduct && renderProductDetail()}
        {currentView === 'preOrder' && renderPreOrder()}
        {currentView === 'animation' && renderAnimation()}
        {currentView === 'club' && renderClub()}
        {currentView === 'pitch' && renderPitch()}
      </main>

      <ActionModal 
        {...modalConfig}
        onClose={closeModal}
        onSuccess={handleActionSuccess}
      />

      {/* To use Shopify checkout, pass a real checkout URL here, or set up dynamic logic. */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-[150] animate-fade-up">
          <div className="bg-obsidian text-paper px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[320px]">
            {toast.product && (
              <img 
                src={toast.product.image} 
                alt={toast.product.name}
                className="w-12 h-12 object-contain mix-blend-multiply bg-paper"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-sans font-semibold">{toast.message}</p>
              {toast.product && (
                <p className="text-xs text-paper/60 font-mono mt-1">{toast.product.name}</p>
              )}
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="text-gold hover:text-gold/80 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Club Membership Form Modal */}
      {isClubFormOpen && (
        <div className="fixed inset-0 bg-obsidian/95 backdrop-blur-sm flex items-center justify-center z-[150] p-2 sm:p-6 animate-fade-up overflow-y-auto">
          <div className="bg-paper max-w-2xl w-full my-8 shadow-2xl relative flex flex-col" style={{ minHeight: '80vh', maxHeight: '95vh' }}>
            {/* Header */}
            <div className="bg-obsidian text-paper px-6 py-5 flex items-center justify-between sticky top-0 z-20 rounded-t-xl">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-serif italic font-bold">Join The Travel Club</h2>
                <p className="text-xs font-mono uppercase tracking-wider text-paper/60">
                  Elite Membership Application
                </p>
              </div>
              <button
                onClick={() => setIsClubFormOpen(false)}
                className="text-paper/80 hover:text-gold transition-colors text-3xl leading-none focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Close Club Membership Modal"
                style={{ zIndex: 1000, marginLeft: '1rem' }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto px-6 py-8" style={{ flex: 1, minHeight: 0 }}>
              <form
                className="p-8 space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
                  try {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Submitting Application...';
                    await fetch('https://script.google.com/macros/s/AKfycbzhsRt2_oW8Yb6VXGmMINtki46-fhJoM8NK7jxPuZ6b_d29qS_oKReF5bG_vjQZPiyb/exec', {
                      method: 'POST',
                      mode: 'no-cors',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        formType: 'early_member',
                        name: formData.get('club-name'),
                        email: formData.get('club-email'),
                        phone: formData.get('club-phone'),
                        industry: formData.get('club-industry'),
                        skills: formData.get('club-skills'),
                        africaPast: formData.get('club-africa-past'),
                        africaPresent: formData.get('club-africa-present'),
                        africaFuture: formData.get('club-africa-future'),
                        countries: formData.get('club-countries'),
                        notes: formData.get('club-notes')
                      })
                    });
                    setIsClubFormOpen(false);
                    openModal({
                      title: 'Application Received',
                      subtitle: 'Travel Club Elite',
                      description: 'Thank you for your interest in the Bantu Ants Travel Club. Our team will review your application and contact you within 5-7 business days regarding the 2026 expedition cycle.',
                      buttonText: 'Close',
                      stampText: 'APPLICATION_RECEIVED',
                      stampColor: 'gold'
                    });
                    e.currentTarget.reset();
                  } catch (error) {
                    console.error('Club form error:', error);
                    setIsClubFormOpen(false);
                    openModal({
                      title: 'Application Received',
                      subtitle: 'Travel Club Elite',
                      description: 'Thank you for your interest! We\'ll be in touch soon.',
                      buttonText: 'Close',
                      stampText: 'APPLICATION_RECEIVED',
                      stampColor: 'gold'
                    });
                    e.currentTarget.reset();
                  } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Application';
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="club-name"
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="club-email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="club-phone"
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Industry/Profession *
                    </label>
                    <input
                      type="text"
                      name="club-industry"
                      required
                      placeholder="e.g., Technology, Education, Arts..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Skills & Expertise *
                    </label>
                    <input
                      type="text"
                      name="club-skills"
                      required
                      placeholder="e.g., Photography, Writing, Cultural Research..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Africa's Past: What history interests you? *
                    </label>
                    <textarea
                      name="club-africa-past"
                      required
                      rows={2}
                      placeholder="Ancient kingdoms, colonial history, cultural traditions..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Africa's Present: What current issues matter to you? *
                    </label>
                    <textarea
                      name="club-africa-present"
                      required
                      rows={2}
                      placeholder="Innovation, arts, social movements, economic development..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Africa's Future: What possibilities excite you? *
                    </label>
                    <textarea
                      name="club-africa-future"
                      required
                      rows={2}
                      placeholder="Technology, culture, Pan-African unity, sustainability..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Countries You Want to Visit *
                    </label>
                    <input
                      type="text"
                      name="club-countries"
                      required
                      placeholder="e.g., Ghana, Senegal, Ethiopia, South Africa..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="club-notes"
                      rows={3}
                      placeholder="Anything else you'd like us to know..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian resize-none"
                    />
                  </div>
                </div>
                <div className="border-t border-obsidian/10 pt-6 space-y-4">
                  <p className="text-xs text-obsidian/60 leading-relaxed">
                    By submitting this application, you acknowledge that membership is selective and subject to 
                    availability. Our team reviews all applications carefully to ensure the right cultural fit 
                    for our intimate travel experiences.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-4 bg-obsidian text-paper font-sans text-sm font-semibold uppercase tracking-wider hover:bg-gold hover:text-obsidian transition-all"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Experience Reservation Form Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-obsidian/95 backdrop-blur-sm flex items-center justify-center z-[150] p-4 sm:p-6 animate-fade-up overflow-y-auto">
          <div className="bg-paper max-w-2xl w-full my-8 shadow-2xl">
            {/* Header */}
            <div className="bg-obsidian text-paper px-8 py-6 flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif italic font-bold">Reserve: {selectedExperience.title}</h2>
                <p className="text-xs font-mono uppercase tracking-wider text-paper/60">
                  {selectedExperience.location} • {selectedExperience.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedExperience(null)}
                className="text-paper/60 hover:text-paper transition-colors text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Form */}
            {showReservationConfirmation ? (
              <div className="space-y-8 animate-fade-up text-center py-12">
                <div className="w-24 h-24 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-gold text-4xl">✓</span>
                </div>
                <h3 className="text-3xl font-serif italic font-bold text-obsidian">Reservation Received</h3>
                <p className="text-lg font-serif italic text-obsidian/50">Thank you! We'll be in touch soon.</p>
                <button type="button" onClick={() => setSelectedExperience(null)} className="w-full py-6 bg-obsidian text-paper font-mono text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-gold hover:text-obsidian transition-all mt-8">Close</button>
              </div>
            ) : (
              <form
                className="p-4 sm:p-6 space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const submitButton = e.currentTarget.querySelector('button[type=\"submit\"]') as HTMLButtonElement;
                  try {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Submitting...';
                    await fetch('https://script.google.com/macros/s/AKfycbzhsRt2_oW8Yb6VXGmMINtki46-fhJoM8NK7jxPuZ6b_d29qS_oKReF5bG_vjQZPiyb/exec', {
                      method: 'POST',
                      mode: 'no-cors',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        formType: 'experience_reservation',
                        experienceTitle: selectedExperience.title,
                        experienceLocation: selectedExperience.location,
                        experienceDate: selectedExperience.date,
                        experiencePrice: selectedExperience.price,
                        name: formData.get('exp-name'),
                        email: formData.get('exp-email'),
                        phone: formData.get('exp-phone'),
                        travelers: formData.get('exp-travelers'),
                        notes: formData.get('exp-notes')
                      })
                    });
                    setShowReservationConfirmation(true);
                    e.currentTarget.reset();
                  } catch (error) {
                    console.error('Reservation form error:', error);
                    setShowReservationConfirmation(true);
                  } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Reserve Spot';
                  }
                }}
              >
                <button type="button" onClick={() => setSelectedExperience(null)} className="absolute top-4 right-4 text-2xl text-obsidian/60 hover:text-gold transition-colors">×</button>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="exp-name"
                      required
                      placeholder="Your full name..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="exp-email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="exp-phone"
                      required
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Number of Travelers *
                    </label>
                    <input
                      type="number"
                      name="exp-travelers"
                      required
                      min="1"
                      defaultValue="1"
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-obsidian/60 mb-2">
                      Special Requests or Questions
                    </label>
                    <textarea
                      name="exp-notes"
                      rows={3}
                      placeholder="Dietary restrictions, accessibility needs, questions..."
                      className="w-full px-4 py-3 border border-obsidian/20 focus:border-gold outline-none transition-colors text-obsidian resize-none"
                    />
                  </div>
                </div>
                <div className="border-t border-obsidian/10 pt-6 space-y-4">
                  <p className="text-sm text-obsidian/60">
                    Price: <span className="font-bold text-gold">{selectedExperience.price}</span> per person
                  </p>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gold text-obsidian font-mono text-xs font-bold uppercase tracking-wider hover:bg-obsidian hover:text-paper transition-all"
                  >
                    Reserve Spot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="py-32 px-6 lg:px-24 bg-paper border-t border-obsidian/10 text-center space-y-12">
         <img
           src="/batc_logo_blk_tc.png"
           alt="Bantu Ants Logo"
           className="h-36 w-auto mx-auto hover:opacity-80 transition-opacity cursor-pointer"
           onClick={() => setCurrentView('home')}
         />
         
         {/* Newsletter Subscription */}
         <div className="max-w-md mx-auto space-y-4 py-8">
           <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Subscribe to Newsletter and Updates</h4>
           <form className="space-y-3" onSubmit={async (e) => {
             e.preventDefault();
             const formData = new FormData(e.currentTarget);
             const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
             
             try {
               submitButton.disabled = true;
               submitButton.textContent = 'Subscribing...';
               
               const response = await fetch('https://script.google.com/macros/s/AKfycbzhsRt2_oW8Yb6VXGmMINtki46-fhJoM8NK7jxPuZ6b_d29qS_oKReF5bG_vjQZPiyb/exec', {
                 method: 'POST',
                 mode: 'no-cors',
                 headers: {
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                   formType: 'newsletter',
                   name: formData.get('newsletter-name'),
                   email: formData.get('newsletter-email')
                 })
               });
               
               alert('Thank you for subscribing to our newsletter!');
               e.currentTarget.reset();
             } catch (error) {
               console.error('Subscription error:', error);
               alert('Successfully subscribed!');
               e.currentTarget.reset();
             } finally {
               submitButton.disabled = false;
               submitButton.textContent = 'Subscribe';
             }
           }}>
             <input
               type="text"
               name="newsletter-name"
               required
               placeholder="Your name..."
               className="w-full bg-white border border-obsidian/10 px-4 py-3 font-serif italic text-base focus:border-gold outline-none transition-all text-obsidian"
             />
             <input
               type="email"
               name="newsletter-email"
               required
               placeholder="your.email@example.com"
               className="w-full bg-white border border-obsidian/10 px-4 py-3 font-serif italic text-base focus:border-gold outline-none transition-all text-obsidian"
             />
             <button
               type="submit"
               className="w-full py-3 bg-obsidian text-paper font-mono text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-obsidian transition-all"
             >
               Subscribe
             </button>
           </form>
         </div>

         {/* Supported By Section */}
         <div className="max-w-4xl mx-auto space-y-8 py-8">
           <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">Supported By</h4>
           <div className="flex justify-center items-center gap-8 flex-wrap">
             <img
               src="/smcitylogo.png"
               alt="SM City"
               className="h-16 w-auto"
             />
           </div>
         </div>

         <div className="flex justify-center gap-12 font-mono text-[9px] uppercase tracking-[0.5em] text-obsidian/30">
            <span>Archive: Rift_01</span>
            <span>Ref: Vision_2088</span>
         </div>
         <div className="pt-6">
           <button 
             onClick={() => {
               if (hasPitchAccess) {
                 setCurrentView('pitch');
               } else {
                 openModal({
                   title: 'Vision Deck Access',
                   subtitle: 'Secure Transmission',
                   description: 'Access to the full Vision Deck requires verified status. For demonstration purposes, provide your name to unlock the deck.',
                   buttonText: 'Unlock Deck',
                   stampText: 'VISION_LOCKED',
                   stampColor: 'red',
                   mode: 'vision',
                   onSuccess: () => {
                     setHasPitchAccess(true);
                     setCurrentView('pitch');
                   }
                 });
               }
             }} 
             className="font-mono text-[9px] font-bold tracking-[0.4em] bg-red text-white px-8 py-4 hover:bg-obsidian hover:text-paper transition-all uppercase shadow-lg"
           >
             Vision Deck
           </button>
         </div>
         
         <h3 className="text-4xl font-serif italic font-bold tracking-tighter text-obsidian">Bantu Ants.</h3>
      </footer>
    </div>
  );
};

export default App;
// ...existing code...
// DEPLOY TEST Fri Jan 23 17:08:17 PST 2026