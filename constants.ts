import { Character, Product, BibleSection, LorePillar, HistoricalTrail, ProductionInsight, Location, TechItem, Episode, ClubPillar, ClubExperience, ClubBenefit, SmallProject } from './types';

export const SMALL_PROJECTS: SmallProject[] = [
  {
    id: 'sp-01',
    title: 'The Chale App',
    description: 'A mobile application connecting African communities with peer-to-peer financial services, enabling seamless transactions and economic empowerment across the diaspora.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    tags: ['Mobile App', 'FinTech']
  },
  {
    id: 'sp-02',
    title: 'OrgAI',
    description: 'An AI-powered organizational tool designed for African entrepreneurs to streamline operations, manage teams, and scale their ventures with intelligent automation.',
    image: 'https://images.unsplash.com/photo-1677442d019cecf8978f4147a4d2d42c91f5040dc?auto=format&fit=crop&q=80&w=800',
    tags: ['AI/ML', 'Enterprise']
  },
  {
    id: 'sp-03',
    title: 'Haus of Zen',
    description: 'A holistic wellness sanctuary bridging African traditional healing practices with modern mindfulness, creating spaces for community restoration and spiritual growth.',
    image: 'https://images.unsplash.com/photo-1518611505868-d7b2b67c3438?auto=format&fit=crop&q=80&w=800',
    tags: ['Wellness', 'Community']
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
    image: '/kwanzite sketch.jpg'
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
    description: "Walk the path of Pan-Africanism through the history of Ghana's independence leader.",
    highlights: [
      'Kwame Nkrumah Mausoleum private tour',
      "Visit to Nkroful, Nkrumah's birthplace",
      'Exclusive Pan-Africanism workshop at W.E.B. Du Bois Center'
    ],
    price: '$5,000',
    image: '/nkrumahscene.png'
  }
];

export const CLUB_BENEFITS: ClubBenefit[] = [
  { title: 'Curated Itineraries', description: "Meticulously designed experiences you won't find anywhere else." },
  { title: 'Intimate Groups', description: 'Maximum 15-20 members per experience for meaningful connections.' },
  { title: 'Exclusive Access', description: 'Private tours, closed events, and behind-the-scenes cultural moments.' },
  { title: 'Expert Guides', description: 'Local cultural ambassadors and historians as your personal guides.' },
  { title: 'Accommodation', description: 'Boutique hotels and unique stays that honor local culture.' },
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
  { id: 'ep-01', title: 'The Silent Signal', summary: "Kamau receives a distorted transmission from a dead ancestor's frequency." },
  { id: 'ep-02', title: 'The Salt & The Wire', summary: 'Makeda travels to the Danakil Depression to locate a lost server farm buried in salt.' },
  { id: 'ep-03', title: 'Forge of the Kushites', summary: 'Tunde must rebuild a 2000-year-old furnace to smelt the metals needed for the Great Antenna.' }
];

export const HISTORICAL_TRAILS: HistoricalTrail[] = [
  {
    id: 'trail-01',
    subject: 'Dogon Cosmogony',
    fictionLink: "Makeda's Sight",
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
    fictionLink: "Tunde's Relic Tech",
    realityRoot: "The Kingdom of Kush was a global center for iron production, a legacy reflected in the series' focus on reclaimed engineering.",
    location: 'Meroë, Sudan'
  }
];

export const PRODUCTION_INSIGHTS: ProductionInsight[] = [
  {
    id: 'concept-02',
    title: 'Fina & Kamau Concept',
    description: 'Behind-the-scenes panel capturing the dynamic between Fina and Kamau — motion, posture, and relationship cues for animation blocking.',
    image: '/finaandkamu.png'
  },
  {
    id: 'kwanzite-01',
    title: 'Kwanzite',
    description: 'The Energy Beneath the Story. A mystical, glowing mineral that fuels empires and connects the Bantu Ants to their ancestral past. Mined from deep underground, Kwanzite represents both the wealth of Africa and the cost of extraction—a metaphor for resources stolen, power hoarded, and memories buried.',
    image: '/kwanzite sketch.jpg'
  },
  {
    id: 'bantu-migration-01',
    title: 'The Great Bantu Migration',
    description: 'Exploring the historic migration that shaped a continent and inspired our story of movement, resilience, and cultural legacy.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200'
  }
];

export const CHARACTERS: Character[] = [
  {
    id: 'kamau',
    name: 'Kamau',
    role: 'The Miner',
    archetype: 'Reluctant Leader',
    depth: 'Miner by day, reclaiming stolen relics by night.',
    quote: 'If you do not have your own map, you are lost in someone else\'s world.',
    inspiration: 'Frontline Strategists',
    image: '/kamaushot.PNG',
    trail: 'The High-Altitude Routes'
  },
  {
    id: 'fina',
    name: 'Fina',
    role: 'Hidden Heir',
    archetype: 'Ceremonial Warrior',
    depth: 'Okogie-raised fighter carrying lost parables and a glowing sigil.',
    quote: 'Speed is a language of its own.',
    inspiration: 'Desert Runners',
    image: '/Single-Content-3.png',
    trail: 'The Sand Corridors'
  },
  {
    id: 'zulu',
    name: 'Zulu',
    role: 'The Guardian',
    archetype: 'Crew Heartbeat',
    depth: 'Last kin of Shaka; humor shields grief and fuels loyalty.',
    quote: 'Hold the line and the line will hold you.',
    inspiration: 'Zulu Tacticians',
    image: '/Single-Content-4.png',
    trail: 'The Ridge Defenses'
  },
  {
    id: 'bytez',
    name: 'Bytez',
    role: 'The Hacker',
    archetype: 'Graffiti Prophet',
    depth: 'Orphaned tech griot tagging the Travel Club’s hidden signal.',
    quote: 'No wall is offline forever.',
    inspiration: 'Cipher Rebels',
    image: '/Single-Content-5.png',
    trail: 'The Data Rifts'
  },
  {
    id: 'armstrong',
    name: 'Armstrong',
    role: 'The Heavy',
    archetype: 'Force of Nature',
    depth: 'Carries the weight, clears the path, never stops moving.',
    quote: 'Momentum is a promise.',
    inspiration: 'Power Lifters',
    image: '/Single-Content-6.png',
    trail: 'The Iron Roads'
  },
  {
    id: 'bishop',
    name: 'Bishop Mokorokoro',
    role: 'The High Priest',
    archetype: 'Power Broker',
    depth: 'High Priest manipulating Kwanzite mining behind a veil of religious authority.',
    quote: 'Faith is the ultimate leverage.',
    inspiration: 'Colonial Power Brokers',
    image: '/Single-Content-7.png',
    trail: 'The Sacred Mines'
  },
  {
    id: 'gaddafi',
    name: 'Gaddafi',
    role: 'The Patron',
    archetype: 'Resource Broker',
    depth: 'Funds the routes and smooths negotiations on tough ground.',
    quote: 'Currency is just another current.',
    inspiration: 'Bold Financiers',
    image: '/Single-Content-8.png',
    trail: 'The Trade Routes'
  },
  {
    id: 'pele',
    name: 'Pele',
    role: 'The Striker',
    archetype: 'Precision Play',
    depth: 'Turns chaos into flow; every move is calculated.',
    quote: 'Aim, strike, move.',
    inspiration: 'Field Generals',
    image: '/Single-Content-9.png',
    trail: 'The Open Fields'
  },
  {
    id: 'tupac',
    name: 'Tupac',
    role: 'The Voice',
    archetype: 'Rebel Bard',
    depth: 'Carries the message, ignites the crowd, keeps memory alive.',
    quote: 'Truth echoes louder than fear.',
    inspiration: 'Radical Poets',
    image: '/Single-Content-10.png',
    trail: 'The Echo Chambers'
  },
  {
    id: 'nkrumah',
    name: 'Nkrumah',
    role: 'The Founder',
    archetype: 'Architect',
    depth: 'Builds alliances and maps the long game for the club.',
    quote: 'Foundation is freedom.',
    inspiration: 'Pan-African Builders',
    image: '/Single-Content-11.png',
    trail: 'The Foundry'
  },
  {
    id: 'piet',
    name: 'Piet Kruger',
    role: 'The Elite Enforcer',
    archetype: 'Torn Loyalist',
    depth: 'Raised on Bantu lullabies, armed with Boer orders; loyalty cracking.',
    quote: 'There is always another way through.',
    inspiration: 'Bush Trackers',
    image: '/Single-Content-12.png',
    trail: 'The Back Trails'
  },
  {
    id: 'nomad',
    name: 'The Nomad',
    role: 'The Wanderer',
    archetype: 'Free Spirit',
    depth: 'Navigates the rifts between worlds, collecting lost stories.',
    quote: 'Home is the journey.',
    inspiration: 'Global Nomads',
    image: '/Single-Content.png',
    trail: 'The Unknown Paths'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'pack-01',
    name: 'Nomad Travel Backpack',
    price: '$280',
    category: 'Relic_Gear',
    lore: 'Premium embossed leather backpack with "Bantu Ants Travel Club" insignia. Water-resistant, multi-compartment design. Support the movement. Pre-order ships Q2 2026.',
    image: '/bagpackbat.png',
    images: ['/bagpackbat.png', '/bagad.png'],
    tags: ['Pre-Order', 'Q2 2026', 'Unisex']
  },
  {
    id: 'tee-01',
    name: 'Boma Ye – Unisex T-Shirt',
    price: '$39.99',
    category: 'Apparel',
    lore: 'The Ali Boma Ye ("Ali, kill him!") tee pays tribute to Muhammad Ali\'s 1974 "Rumble in the Jungle," reclaiming African pride and power through iconic design.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Unisex', 'Black'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50848331989288',
    shopifyProductId: 'gid://shopify/Product/9857413284136'
  },
  {
    id: 'tee-02',
    name: 'Essential Travel Tee',
    price: '$32.99',
    category: 'Apparel',
    lore: 'Born from the rhythm of movement and the language of freedom. Premium 100% cotton with a relaxed boxy fit. Soft, durable, and pre-shrunk with lasting color.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Unisex', 'Multiple Colors'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50628081934632',
    shopifyProductId: 'gid://shopify/Product/9797077975336'
  },
  {
    id: 'tee-03',
    name: 'Heritage Oversized Tee',
    price: '$49.99',
    category: 'Apparel',
    lore: 'Crafted from breathable 100% combed cotton, this oversized tee blends comfort with a lived-in vintage aesthetic. A statement piece for modern nomads.',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Oversized', 'Premium'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50628137386280',
    shopifyProductId: 'gid://shopify/Product/9797261689128'
  },
  {
    id: 'hoodie-01',
    name: 'Vintage Washed Frayed-Hem Hoodie',
    price: '$60.99',
    category: 'Apparel',
    lore: 'Forged for travelers, rebels, and dreamers. Built from thick, soft cotton-blend that endures movement and time. A hoodie with soul.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Premium', 'Vintage Washed'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50846792778024',
    shopifyProductId: 'gid://shopify/Product/9856825590056'
  },
  {
    id: 'sweatshirt-01',
    name: 'BATC Oversized Knit Sweatshirt',
    price: '$40.99',
    category: 'Apparel',
    lore: 'Effortless, soft, and grounded in culture. The Bantu Ants knitted oversized sweatshirt wraps you in comfort while carrying the movement forward.',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Oversized', 'Knit'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50809981403432',
    shopifyProductId: 'gid://shopify/Product/9846293856552'
  },
  {
    id: 'pants-01',
    name: 'Solid Color Straight-Leg Sweatpants',
    price: '$49.99',
    category: 'Apparel',
    lore: 'Cut for comfort, built for movement. These sweatpants balance structure and flow — designed for travel, rest, and everything in between.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    tags: ['Available Now', 'Multiple Colors', 'Comfort'],
    shopifyVariantId: 'gid://shopify/ProductVariant/50833868521768',
    shopifyProductId: 'gid://shopify/Product/9850463420712'
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
