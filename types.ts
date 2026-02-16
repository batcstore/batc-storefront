
// Add React import to resolve "Cannot find namespace 'React'" error
import React from 'react';

export type View = 'home' | 'shop' | 'club' | 'projects' | 'manifesto' | 'bible' | 'productDetail' | 'preOrder' | 'animation' | 'pitch';

export interface Character {
  id: string;
  name: string;
  role: string;
  archetype: string;
  depth: string;
  quote: string;
  inspiration: string;
  image: string;
  trail: string;
}

export interface LorePillar {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface HistoricalTrail {
  id: string;
  subject: string;
  fictionLink: string;
  realityRoot: string;
  location: string;
}

export interface ProductionInsight {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: string;
}

export interface TechItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Episode {
  id: string;
  title: string;
  summary: string;
}

export interface ClubPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  icon: string;
}

export interface ClubExperience {
  id: string;
  status: string;
  date: string;
  duration: string;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  price: string;
  image: string;
}

export interface ClubBenefit {
  title: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  lore: string;
  image: string;
  images?: string[]; // Multiple product images
  tags: string[];
  variants?: ProductVariant[]; // Available color/size variants
  shopifyVariantId?: string; // Default Shopify variant ID for checkout
  shopifyProductId?: string; // Shopify product ID
}

export interface BibleSection {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

export interface PitchSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  image?: string;
  stamp?: string;
  number: string;
}

/**
 * Added to fix the 'Module "../types" has no exported member "SmallProject"' error in SmallProjectCard.tsx
 */
export interface SmallProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}
