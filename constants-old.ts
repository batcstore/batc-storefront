
import { Character, Product, BibleSection, LorePillar, HistoricalTrail, ProductionInsight, Location, TechItem, Episode, ClubPillar, ClubExperience, ClubBenefit, SmallProject } from './types';

export const SMALL_PROJECTS: SmallProject[] = [
  {
    id: 'sp-01',
    title: 'Nomad HUD Interface',
    description: 'A UI/UX concept for augmented reality glasses used by Bantu scavengers to identify "Old Signal" relics in the Rift.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tags: ['UI/UX', 'Concept Art']
  },
  {
    id: 'sp-02',
    title: 'The Great Antenna Soundscape',
    description: 'A 10-minute experimental ambient piece simulating the rhythmic interference of the 2088 Digital Blackout.',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8d488f762?auto=format&fit=crop&q=80&w=800',
    tags: ['Sound Design', 'Audio']
  },
  {
    id: 'sp-03',
    title: 'Neo-Sahelien Architecture Pack',
    description: 'A series of 3D modular assets blending adobe-brick aesthetics with futuristic solar-panel integration.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    tags: ['3D Modeling', 'Architecture']
  }
];

export const CLUB_PILLARS: ClubPillar[] = [
  {
    id: 'pillar-01',
    title: 'Learn & Party',
    subtitle: 'Immersive History',
    icon: '🏛️',
    description: 'Walk through ancient kingdoms, UNESCO sites, and living museums. Connect with local historians, griots, and cultural custodians who bring centuries of wisdom to life.',
    bullets: ['Private access to historical sites', 'Workshops with cultural experts', 'Ancestral genealogy experiences', 'Traditional ceremony participation']
  },
  {
    id: 'pillar-02',
    title: 'Talk & Party',
    subtitle: 'Deep Conversations',
    icon: '🗣️',
    description: 'Intimate gatherings with changemakers, artists, entrepreneurs, and visionaries. Share stories, build connections, and engage in meaningful dialogue about our collective future.',
    bullets: ['Fireside chats with leaders', 'Mastermind sessions', 'Community building circles', 'Cross-cultural dialogues']
  },
  {
    id: 'pillar-03',
    title: 'Party & Party',
    subtitle: 'Celebrate Culture',
    icon: '🎷',
    description: "Experience Africa's legendary nightlife, festivals, and celebrations. From Afrobeats in Lagos to jazz in Cape Town, immerse yourself in the rhythms that move the continent.",
    bullets: ['VIP festival experiences', 'Private yacht & rooftop parties', 'Underground music scenes', 'Cultural celebration access']
  }
];

export const CLUB_EXPERIENCES: ClubExperience[] = [
  {
    id: 'exp-01',
    status: 'Open',
    date: 'March 2026',
    duration: '1 Day',
    title: 'Bantu Ants Travel Club Welcome',
    location: 'Santa Monica, CA USA',
    description: 'A multi-sensory entry into our universe.',
    highlights: [
      'Afrofuturist Animation Showcase',
      'Immersive Art Installation — The Kwanzite Portal',
      'Fashion & Design Pop-up',
      'Sound & Soul Session'
    ],
    price: '$TBA',
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'exp-02',
    status: 'Limited Spots',
    date: 'April 2026',
    duration: '10 Days',
    title: 'Yasuke Immersive Experience in Kyoto',
    location: 'Kyoto, Osaka, Nara',
    description: 'A journey through Japan retracing the steps of the legendary African Samurai.',
    highlights: [
      'Yasuke cultural journey through Japan',
      'Samurai sword & tea ceremony workshops',
      'Bantu Ants Travel Club "Yasuke Ant" film screening & Q&A'
    ],
    price: '$3,500',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'exp-03',
    status: 'Limited Spots',
    date: 'December 2026',
    duration: '14 Days',
    title: 'Ghana: The Kwame Nkrumah Trail',
    location: 'Accra, Nkroful, Winneba, Kumasi',
    description: 'Walk the path of Pan-Africanism through the history of Ghana’s independence leader.',
    highlights: [
      'Kwame Nkrumah Mausoleum private tour',
      'Visit to Nkroful, Nkrumah’s birthplace',
      'Exclusive Pan-Africanism workshop at W.E.B. Du Bois Center'
    ],
    price: '$5,000',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=1200'
  }
];

export const CLUB_BENEFITS: ClubBenefit[] = [
  { title: 'Curated Itineraries', description: "Meticulously designed experiences you won't find anywhere else." },
  { title: 'Intimate Groups', description: 'Maximum 15-20 members per experience for meaningful connections.' },
  { title: 'Exclusive Access', description: 'Private tours, closed events, and behind-the-scenes cultural moments.' },
  { title: 'Expert Guides', description: 'Local cultural ambassadors and historians as your personal guides.' },
  { title: 'Luxury Accommodation', description: 'Boutique hotels and unique stays that honor local culture.' },
  { title: 'Global Network', description: 'Join a community of innovators, creators, and cultural custodians.' }
];

export const LORE_PILLARS: LorePillar[] = [
  {
    id: 'the-rift',
    title: 'The Great Rift',
    icon: '🌋',
    content: 'A geo-digital anomaly stretching from the Red Sea to Mozambique. In 2088, it serves as the only zone where the "Old Signal" still flickers, untouched by corporate firewalls.'
  },
  {
    id: 'the-blackout',
    title: 'Digital Blackout',
    icon: '🌑',
    content: 'The 2064 event that wiped the Global Cloud. Ancestral memory, preserved in physical artifacts and oral traditions, became the only way to navigate the new world.'
  },
  {
    id: 'the-ants',
    title: 'Bantu Ants',
    icon: '🐜',
    content: 'A collective of nomadic memory-keepers who use high-altitude navigation and "Relic Tech" to bridge the gap between isolated hyper-cities.'
  }
];

export const LOCATIONS: Location[] = [
  {
    id: 'loc-01',
    name: 'The Kilimanjaro Hub',
    coordinates: '3.0674° S, 37.3556° E',
    description: 'The highest point in the Rift, serving as the central antenna for the Bantu Ants. A vertical city built into the glaciers.',
    image: 'https://images.unsplash.com/photo-1589192133850-f9b675207119?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'loc-02',
    name: 'Neo-Timbuktu',
    coordinates: '16.7666° N, 3.0026° W',
    description: 'A subterranean archive where the physical manuscripts of the 14th century are being digitized using bioluminescent bacteria.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'loc-03',
    name: 'The Iron Coast',
    coordinates: '6.3350° N, 2.4274° E',
    description: 'A graveyard of massive colonial-era tankers reclaimed by "Relic Tech" engineers to build a floating trade republic.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200'
  }
];

export const TECH_GEAR: TechItem[] = [
  {
    id: 'tech-01',
    name: 'The Sundial Compass',
    icon: '🧭',
    description: 'An analog-quantum hybrid device that navigates via magnetic Ley Lines and solar position. Unhackable.'
  },
  {
    id: 'tech-02',
    name: 'Memory Shards',
    icon: '💎',
    description: 'Bio-organic storage crystals containing compressed ancestral history, retrieved from deep-earth vaults.'
  },
  {
    id: 'tech-03',
    name: 'The Weaver Cloak',
    icon: '🧣',
    description: 'Smart-textile traditional kente cloth that can bend light, providing stealth in the corporate-monitored "Clean Zones".'
  }
];

export const SEASON_ONE_EPISODES: Episode[] = [
  { id: 'ep-01', title: 'The Silent Signal', summary: 'Kamau receives a distorted transmission from a dead ancestor’s frequency.' },
  { id: 'ep-02', title: 'The Salt & The Wire', summary: 'Makeda travels to the Danakil Depression to locate a lost server farm buried in salt.' },
  { id: 'ep-03', title: 'Forge of the Kushites', summary: 'Tunde must rebuild a 2000-year-old furnace to smelt the metals needed for the Great Antenna.' }
];

export const HISTORICAL_TRAILS: HistoricalTrail[] = [
  {
    id: 'trail-01',
    subject: 'Dogon Cosmogony',
    fictionLink: 'Makeda’s Sight',
    realityRoot: 'The Dogon people of Mali possessed advanced knowledge of the Sirius star system centuries before modern telescopes.',
    location: 'Bandiagara Escarpment, Mali'
  },
  {
    id: 'trail-02',
    subject: 'Great Zimbabwe',
    fictionLink: 'The Stone Spires',
    realityRoot: 'The sophisticated dry-stone architecture of the Kingdom of Zimbabwe inspires the "Ant" fortresses in the southern Rift.',
    location: 'Masvingo, Zimbabwe'
  },
  {
    id: 'trail-03',
    subject: 'Kushite Ironworks',
    fictionLink: 'Tunde’s Relic Tech',
    realityRoot: 'The Kingdom of Kush was a global center for iron production, a legacy reflected in the series’ focus on reclaimed engineering.',
    location: 'Meroë, Sudan'
  }
];

export const PRODUCTION_INSIGHTS: ProductionInsight[] = [
  {
    id: 'style-01',
    title: 'Neo-Cyber Cell Shading',
    description: 'A visual style blending hand-painted Sahelien textures with high-contrast digital line work to create a look that feels both ancient and future.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'sound-01',
    title: 'Acoustic Heritage',
    description: 'The score utilizes recorded "talking drums" and traditional lutes, processed through analog synthesizers to represent the "Signal."',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200'
  }
];

export const CHARACTERS: Character[] = [
  {
    id: 'kamau',
    name: 'Kamau',
    role: 'The Navigator',
    archetype: 'Tactical Rebellion',
    depth: 'A designer in 2088 who leads the underground Travel Club. His Season 1 arc focuses on finding the "Origin Node" buried beneath the high-altitude routes.',
    quote: "If you don't have your own map, you're always lost in someone else's world.",
    inspiration: 'Mau Mau Strategy',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    trail: 'The High-Altitude Routes'
  },
  {
    id: 'makeda',
    name: 'Makeda',
    role: 'The Oracle',
    archetype: 'Prophetic Sight',
    depth: 'A seer who calculates future probability using ancient geometric patterns. In Season 1, she discovers that the "Blackout" wasn’t an accident.',
    quote: "The future is already written in the geometry of the stars.",
    inspiration: 'Queen of Sheba / Dogon Seers',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    trail: 'The Celestial Observatories'
  },
  {
    id: 'tunde',
    name: 'Tunde',
    role: 'The Engineer',
    archetype: 'Relic Tech',
    depth: 'Master of "Salvage Engineering." He believes that the tech of the past holds the keys to the survival of the future.',
    quote: "Yesterday's scrap is tomorrow's shield.",
    inspiration: 'Kushite Iron Masters',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    trail: 'The Salvage Plains'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'pack-01',
    name: 'Travel Club "Nomad" Backpack',
    price: '$320',
    category: 'Relic_Gear',
    lore: 'Signature embossed leather. 100% of profit funds the Bantu Ants animated pilot.',
    image: 'backpack.png',
    tags: ['Pre-Order', 'Unisex']
  }
];

export const BIBLE_SECTIONS: BibleSection[] = [
  {
    id: 'the-story',
    icon: '📖',
    title: 'The Story',
    subtitle: 'The Great Digital Blackout',
    content: 'In 2088, Africa is a mosaic of hyper-cities and untamed Rifts. Our story follows the descendants of ancient kings as they navigate a world where history has been digitally erased, and movement is the only way to remember.',
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200'
  }
];
