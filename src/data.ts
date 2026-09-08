// ============ CRIMES ============
export interface Crime {
  id: string;
  name: string;
  nerveCost: number;
  difficulty: number;
  minCash: number;
  maxCash: number;
  expReward: number;
  category: string;
  levelReq: number;
}

export const crimes: Crime[] = [
  { id: 'pickpocket', name: 'Pickpocket', nerveCost: 1, difficulty: 5, minCash: 50, maxCash: 200, expReward: 2, category: 'Theft', levelReq: 1 },
  { id: 'shoplift', name: 'Shoplift', nerveCost: 1, difficulty: 8, minCash: 100, maxCash: 400, expReward: 3, category: 'Theft', levelReq: 1 },
  { id: 'burglary', name: 'Burglary', nerveCost: 2, difficulty: 15, minCash: 300, maxCash: 1200, expReward: 5, category: 'Theft', levelReq: 3 },
  { id: 'car_theft', name: 'Steal a Car', nerveCost: 3, difficulty: 20, minCash: 500, maxCash: 3000, expReward: 8, category: 'Auto Theft', levelReq: 5 },
  { id: 'drug_deal', name: 'Drug Deal', nerveCost: 2, difficulty: 12, minCash: 400, maxCash: 1500, expReward: 4, category: 'Drug Deals', levelReq: 3 },
  { id: 'fraud', name: 'Credit Card Fraud', nerveCost: 3, difficulty: 18, minCash: 600, maxCash: 2500, expReward: 6, category: 'Fraud', levelReq: 5 },
  { id: 'hack', name: 'Hack a Computer', nerveCost: 4, difficulty: 25, minCash: 800, maxCash: 4000, expReward: 10, category: 'Computer Crimes', levelReq: 8 },
  { id: 'robbery', name: 'Rob a Bank', nerveCost: 5, difficulty: 35, minCash: 2000, maxCash: 10000, expReward: 15, category: 'Theft', levelReq: 10 },
  { id: 'hit', name: 'Hitman Contract', nerveCost: 4, difficulty: 30, minCash: 1500, maxCash: 8000, expReward: 12, category: 'Murders', levelReq: 12 },
  { id: 'smuggle', name: 'Smuggle Contraband', nerveCost: 3, difficulty: 22, minCash: 1000, maxCash: 5000, expReward: 9, category: 'Selling Illegal Products', levelReq: 7 },
  { id: 'identity_theft', name: 'Identity Theft', nerveCost: 4, difficulty: 28, minCash: 1200, maxCash: 6000, expReward: 11, category: 'Fraud', levelReq: 9 },
  { id: 'kidnap', name: 'Kidnapping', nerveCost: 6, difficulty: 40, minCash: 3000, maxCash: 15000, expReward: 18, category: 'Murders', levelReq: 15 },
  { id: 'arms_deal', name: 'Illegal Arms Deal', nerveCost: 5, difficulty: 32, minCash: 2500, maxCash: 12000, expReward: 14, category: 'Selling Illegal Products', levelReq: 13 },
  { id: 'cyber_attack', name: 'Cyber Attack', nerveCost: 6, difficulty: 45, minCash: 5000, maxCash: 25000, expReward: 22, category: 'Computer Crimes', levelReq: 18 },
  { id: 'heist', name: 'Grand Heist', nerveCost: 8, difficulty: 55, minCash: 10000, maxCash: 50000, expReward: 30, category: 'Theft', levelReq: 20 },
];

// ============ GYMS ============
export interface Gym {
  id: string;
  name: string;
  multiplier: number;
  levelReq: number;
  statReq?: number;
  cost?: number;
}

export const gyms: Gym[] = [
  { id: 'basic', name: 'Basic Gym', multiplier: 1, levelReq: 1 },
  { id: 'logans', name: "Logan's Gym", multiplier: 1.2, levelReq: 5 },
  { id: 'elites', name: 'Elite Fitness', multiplier: 1.5, levelReq: 10, cost: 500 },
  { id: 'frontline', name: 'Frontline Gym', multiplier: 1.8, levelReq: 15, statReq: 500, cost: 1000 },
  { id: 'baldr', name: "Baldr's Gym", multiplier: 2.2, levelReq: 20, statReq: 2000, cost: 2500 },
];

// ============ EDUCATION ============
export interface Course {
  id: string;
  name: string;
  category: string;
  duration: number; // in game hours
  statBonus?: string;
  bonusAmount?: number;
  levelReq: number;
  cost: number;
}

export const courses: Course[] = [
  { id: 'biology_101', name: 'Biology 101', category: 'Biology', duration: 2, levelReq: 1, cost: 500 },
  { id: 'biology_201', name: 'Biology 201', category: 'Biology', duration: 4, statBonus: 'defense', bonusAmount: 5, levelReq: 5, cost: 2000 },
  { id: 'business_101', name: 'Business 101', category: 'Business', duration: 3, levelReq: 1, cost: 750 },
  { id: 'business_201', name: 'Business 201', category: 'Business', duration: 6, statBonus: 'intelligence', bonusAmount: 10, levelReq: 8, cost: 5000 },
  { id: 'combat_101', name: 'Combat Training', category: 'Combat Training', duration: 4, statBonus: 'strength', bonusAmount: 8, levelReq: 3, cost: 3000 },
  { id: 'combat_201', name: 'Advanced Combat', category: 'Combat Training', duration: 8, statBonus: 'strength', bonusAmount: 15, levelReq: 10, cost: 8000 },
  { id: 'cs_101', name: 'Computer Science 101', category: 'Computer Science', duration: 5, levelReq: 5, cost: 4000 },
  { id: 'cs_201', name: 'Computer Science 201', category: 'Computer Science', duration: 10, statBonus: 'intelligence', bonusAmount: 20, levelReq: 12, cost: 12000 },
  { id: 'math_101', name: 'Mathematics 101', category: 'Mathematics', duration: 4, levelReq: 3, cost: 2500 },
  { id: 'sports_101', name: 'Sports Science', category: 'Sports Science', duration: 6, statBonus: 'speed', bonusAmount: 12, levelReq: 7, cost: 6000 },
  { id: 'health_101', name: 'Health & Fitness', category: 'Health & Fitness', duration: 5, statBonus: 'endurance', bonusAmount: 10, levelReq: 5, cost: 4500 },
  { id: 'general_101', name: 'General Studies', category: 'General Studies', duration: 3, levelReq: 1, cost: 1000 },
];

// ============ JOBS ============
export interface Job {
  id: string;
  name: string;
  company: string;
  salary: number;
  statReq: { manualLabor?: number; intelligence?: number; endurance?: number };
  levelReq: number;
  statGain: { manualLabor?: number; intelligence?: number; endurance?: number };
}

export const jobs: Job[] = [
  { id: 'grocer', name: 'Grocer', company: 'Supermarket', salary: 500, statReq: { manualLabor: 5 }, levelReq: 1, statGain: { manualLabor: 2, endurance: 1 } },
  { id: 'cashier', name: 'Cashier', company: 'Casino', salary: 600, statReq: { intelligence: 5 }, levelReq: 1, statGain: { intelligence: 2 } },
  { id: 'soldier', name: 'Soldier', company: 'Army', salary: 800, statReq: { manualLabor: 10, endurance: 5 }, levelReq: 3, statGain: { manualLabor: 3, endurance: 2 } },
  { id: 'nurse', name: 'Nurse', company: 'Medical Center', salary: 1000, statReq: { intelligence: 15, endurance: 10 }, levelReq: 5, statGain: { intelligence: 3, endurance: 2 } },
  { id: 'detective', name: 'Detective', company: 'Law Enforcement', salary: 1200, statReq: { intelligence: 20, endurance: 15 }, levelReq: 8, statGain: { intelligence: 4, endurance: 3 } },
  { id: 'teacher', name: 'Teacher', company: 'Education', salary: 900, statReq: { intelligence: 25 }, levelReq: 6, statGain: { intelligence: 4 } },
  { id: 'manager', name: 'Manager', company: 'Corporation', salary: 2000, statReq: { intelligence: 40, endurance: 20 }, levelReq: 12, statGain: { intelligence: 5, endurance: 3 } },
  { id: 'executive', name: 'Executive', company: 'Mega Corp', salary: 5000, statReq: { intelligence: 80, endurance: 40, manualLabor: 20 }, levelReq: 18, statGain: { intelligence: 8, endurance: 5, manualLabor: 3 } },
];

// ============ ITEMS ============
export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  effect?: string;
  effectValue?: number;
  description: string;
}

export const items: Item[] = [
  // Weapons
  { id: 'baseball_bat', name: 'Baseball Bat', category: 'Melee', price: 500, effect: 'damage', effectValue: 5, description: 'A simple wooden bat' },
  { id: 'knife', name: 'Combat Knife', category: 'Melee', price: 800, effect: 'damage', effectValue: 8, description: 'Sharp and deadly' },
  { id: 'pistol', name: '9mm Pistol', category: 'Primary', price: 2500, effect: 'damage', effectValue: 15, description: 'Standard sidearm' },
  { id: 'shotgun', name: 'Shotgun', category: 'Primary', price: 5000, effect: 'damage', effectValue: 25, description: 'Devastating at close range' },
  { id: 'rifle', name: 'Assault Rifle', category: 'Primary', price: 15000, effect: 'damage', effectValue: 40, description: 'Military-grade weapon' },
  { id: 'sniper', name: 'Sniper Rifle', category: 'Primary', price: 25000, effect: 'damage', effectValue: 55, description: 'Long range precision' },
  { id: 'smg', name: 'SMG', category: 'Secondary', price: 8000, effect: 'damage', effectValue: 20, description: 'Fast firing submachine gun' },
  { id: 'grenade', name: 'Grenade', category: 'Temporary', price: 3000, effect: 'damage', effectValue: 30, description: 'Explosive throwable' },
  // Armor
  { id: 'leather_vest', name: 'Leather Vest', category: 'Armor', price: 1000, effect: 'defense', effectValue: 5, description: 'Basic protection' },
  { id: 'kevlar', name: 'Kevlar Vest', category: 'Armor', price: 5000, effect: 'defense', effectValue: 15, description: 'Bulletproof vest' },
  { id: 'body_armor', name: 'Full Body Armor', category: 'Armor', price: 12000, effect: 'defense', effectValue: 30, description: 'Maximum protection' },
  // Medical
  { id: 'bandage', name: 'Bandage', category: 'Medical', price: 50, effect: 'heal', effectValue: 10, description: 'Heals minor wounds' },
  { id: 'first_aid', name: 'First Aid Kit', category: 'Medical', price: 200, effect: 'heal', effectValue: 30, description: 'Treats moderate injuries' },
  { id: 'medkit', name: 'Medical Kit', category: 'Medical', price: 500, effect: 'heal', effectValue: 60, description: 'Professional medical supplies' },
  { id: 'blood_bag', name: 'Blood Bag', category: 'Medical', price: 300, effect: 'heal', effectValue: 40, description: 'Restores blood volume' },
  // Drugs
  { id: 'xanax', name: 'Xanax', category: 'Drug', price: 1500, effect: 'energy', effectValue: 25, description: 'Restores energy' },
  { id: 'vicodin', name: 'Vicodin', category: 'Drug', price: 1000, effect: 'happy', effectValue: 20, description: 'Boosts happiness' },
  { id: 'lsd', name: 'LSD', category: 'Drug', price: 2000, effect: 'happy', effectValue: 40, description: 'Major happiness boost' },
  { id: 'cannabis', name: 'Cannabis', category: 'Drug', price: 500, effect: 'nerve', effectValue: 3, description: 'Restores nerve' },
  { id: 'speed', name: 'Speed', category: 'Drug', price: 3000, effect: 'speed_boost', effectValue: 10, description: 'Temporarily boosts speed' },
  { id: 'pcp', name: 'PCP', category: 'Drug', price: 5000, effect: 'strength_boost', effectValue: 15, description: 'Temporarily boosts strength' },
  // Candy
  { id: 'candy_bar', name: 'Candy Bar', category: 'Candy', price: 50, effect: 'happy', effectValue: 5, description: 'Sweet treat' },
  { id: 'chocolate', name: 'Chocolate Box', category: 'Candy', price: 150, effect: 'happy', effectValue: 10, description: 'Delicious chocolates' },
  // Boosters
  { id: 'energy_drink', name: 'Energy Drink', category: 'Booster', price: 300, effect: 'energy', effectValue: 10, description: 'Quick energy boost' },
  { id: 'gym_pass', name: 'Gym Pass', category: 'Booster', price: 1000, effect: 'gym_boost', effectValue: 20, description: 'Boosts gym gains' },
  // Books
  { id: 'strength_book', name: 'Strength Training Manual', category: 'Book', price: 5000, effect: 'strength_perm', effectValue: 5, description: 'Permanent strength boost' },
  { id: 'defense_book', name: 'Defense Techniques', category: 'Book', price: 5000, effect: 'defense_perm', effectValue: 5, description: 'Permanent defense boost' },
  { id: 'speed_book', name: 'Speed Running Guide', category: 'Book', price: 5000, effect: 'speed_perm', effectValue: 5, description: 'Permanent speed boost' },
];

// ============ WEAPONS ============
export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'primary' | 'secondary' | 'temporary';
  damage: number;
  accuracy: number;
  price: number;
}

export const weapons: Weapon[] = [
  { id: 'fists', name: 'Fists', type: 'melee', damage: 3, accuracy: 80, price: 0 },
  { id: 'baseball_bat', name: 'Baseball Bat', type: 'melee', damage: 8, accuracy: 75, price: 500 },
  { id: 'knife', name: 'Combat Knife', type: 'melee', damage: 12, accuracy: 85, price: 800 },
  { id: 'pistol', name: '9mm Pistol', type: 'primary', damage: 20, accuracy: 70, price: 2500 },
  { id: 'shotgun', name: 'Shotgun', type: 'primary', damage: 35, accuracy: 60, price: 5000 },
  { id: 'rifle', name: 'Assault Rifle', type: 'primary', damage: 50, accuracy: 65, price: 15000 },
  { id: 'smg', name: 'SMG', type: 'secondary', damage: 25, accuracy: 75, price: 8000 },
  { id: 'grenade', name: 'Grenade', type: 'temporary', damage: 40, accuracy: 90, price: 3000 },
];

// ============ TRAVEL DESTINATIONS ============
export interface Destination {
  id: string;
  name: string;
  flightTime: number; // minutes
  levelReq: number;
  items: string[];
  cost: number;
}

export const destinations: Destination[] = [
  { id: 'mexico', name: 'Mexico', flightTime: 15, levelReq: 15, items: ['Tequila', 'Sombrero', 'Cactus'], cost: 500 },
  { id: 'cayman', name: 'Cayman Islands', flightTime: 25, levelReq: 15, items: ['Gold Bar', 'Diamond'], cost: 1000 },
  { id: 'canada', name: 'Canada', flightTime: 30, levelReq: 15, items: ['Maple Syrup', 'Ice Wine'], cost: 800 },
  { id: 'hawaii', name: 'Hawaii', flightTime: 35, levelReq: 15, items: ['Lei', 'Hawaiian Shirt'], cost: 1200 },
  { id: 'uk', name: 'United Kingdom', flightTime: 40, levelReq: 15, items: ['Tea Set', 'Top Hat'], cost: 1500 },
  { id: 'argentina', name: 'Argentina', flightTime: 45, levelReq: 15, items: ['Mate', 'Tango Shoes'], cost: 1300 },
  { id: 'switzerland', name: 'Switzerland', flightTime: 35, levelReq: 15, items: ['Swiss Watch', 'Chocolate'], cost: 2000 },
  { id: 'japan', name: 'Japan', flightTime: 50, levelReq: 15, items: ['Katana', 'Silk Kimono'], cost: 2500 },
  { id: 'china', name: 'China', flightTime: 45, levelReq: 15, items: ['Jade', 'Tea Set'], cost: 2000 },
  { id: 'uae', name: 'UAE', flightTime: 40, levelReq: 15, items: ['Gold Watch', 'Perfume'], cost: 3000 },
  { id: 'south_africa', name: 'South Africa', flightTime: 55, levelReq: 15, items: ['Diamond', 'Ivory'], cost: 2800 },
];

// ============ CASINO GAMES ============
export interface CasinoGame {
  id: string;
  name: string;
  minBet: number;
  maxBet: number;
  description: string;
}

export const casinoGames: CasinoGame[] = [
  { id: 'slots', name: 'Slot Machine', minBet: 10, maxBet: 10000, description: 'Spin the reels!' },
  { id: 'blackjack', name: 'Blackjack', minBet: 50, maxBet: 50000, description: 'Beat the dealer to 21' },
  { id: 'roulette', name: 'Roulette', minBet: 100, maxBet: 100000, description: 'Pick your number or color' },
  { id: 'poker', name: 'Poker', minBet: 200, maxBet: 200000, description: 'Texas Holdem - up to 8 players' },
  { id: 'russian_roulette', name: 'Russian Roulette', minBet: 500, maxBet: 500000, description: '6 chambers, 1 bullet' },
];

// ============ STOCKS ============
export interface Stock {
  id: string;
  name: string;
  price: number;
  volatility: number;
  benefit?: string;
}

export const stocks: Stock[] = [
  { id: 'torn_airlines', name: 'Torn Airlines', price: 150, volatility: 0.05, benefit: 'Travel discount' },
  { id: 'torn_hospital', name: 'Torn City Hospital', price: 200, volatility: 0.03, benefit: 'Medical discount' },
  { id: 'torn_bank', name: 'Torn National Bank', price: 300, volatility: 0.02, benefit: 'Bank interest bonus' },
  { id: 'torn_motors', name: 'Torn Motors', price: 100, volatility: 0.08, benefit: 'Racing bonus' },
  { id: 'torn_tech', name: 'Torn Technologies', price: 500, volatility: 0.1, benefit: 'Education time reduction' },
  { id: 'torn_oil', name: 'Torn Oil Corp', price: 250, volatility: 0.06, benefit: 'Company sales bonus' },
  { id: 'torn_pharma', name: 'Torn Pharmaceuticals', price: 180, volatility: 0.04, benefit: 'Drug effectiveness' },
  { id: 'torn_defense', name: 'Torn Defense Systems', price: 400, volatility: 0.07, benefit: 'Combat bonus' },
];

// ============ PROPERTIES ============
export interface Property {
  id: string;
  name: string;
  price: number;
  maxHappy: number;
  upkeep: number;
  levelReq: number;
  benefits: string[];
}

export const properties: Property[] = [
  { id: 'apartment', name: 'Small Apartment', price: 50000, maxHappy: 100, upkeep: 100, levelReq: 3, benefits: ['Basic shelter'] },
  { id: 'house', name: 'House', price: 200000, maxHappy: 200, upkeep: 300, levelReq: 8, benefits: ['Extra storage', 'Garden'] },
  { id: 'villa', name: 'Villa', price: 1000000, maxHappy: 400, upkeep: 800, levelReq: 15, benefits: ['Pool', 'Shooting range', 'Staff'] },
  { id: 'mansion', name: 'Mansion', price: 5000000, maxHappy: 800, upkeep: 2000, levelReq: 20, benefits: ['Medical facility', 'Airstrip', 'Bunker'] },
  { id: 'penthouse', name: 'Penthouse', price: 10000000, maxHappy: 1500, upkeep: 5000, levelReq: 25, benefits: ['All amenities', 'Prestige', 'City view'] },
];

// ============ NPC ENEMIES ============
export interface NPCEnemy {
  id: string;
  name: string;
  level: number;
  strength: number;
  speed: number;
  defense: number;
  dexterity: number;
  life: number;
  weapon: string;
  reward: number;
}

export const npcEnemies: NPCEnemy[] = [
  { id: 'thug', name: 'Street Thug', level: 1, strength: 10, speed: 8, defense: 5, dexterity: 6, life: 50, weapon: 'Fists', reward: 100 },
  { id: 'gangster', name: 'Gang Member', level: 3, strength: 25, speed: 20, defense: 15, dexterity: 18, life: 100, weapon: 'Knife', reward: 300 },
  { id: 'enforcer', name: 'Mob Enforcer', level: 5, strength: 50, speed: 40, defense: 35, dexterity: 30, life: 200, weapon: 'Baseball Bat', reward: 600 },
  { id: 'hitman', name: 'Professional Hitman', level: 8, strength: 80, speed: 70, defense: 60, dexterity: 65, life: 350, weapon: 'Pistol', reward: 1200 },
  { id: 'boss', name: 'Crime Boss', level: 12, strength: 150, speed: 120, defense: 100, dexterity: 110, life: 600, weapon: 'Shotgun', reward: 3000 },
  { id: 'assassin', name: 'Elite Assassin', level: 15, strength: 250, speed: 200, defense: 180, dexterity: 220, life: 1000, weapon: 'Rifle', reward: 5000 },
  { id: 'warlord', name: 'Warlord', level: 20, strength: 400, speed: 350, defense: 300, dexterity: 350, life: 2000, weapon: 'Assault Rifle', reward: 10000 },
];

// ============ RANKS ============
export const ranks = [
  { level: 1, name: 'Absolute Beginner' },
  { level: 2, name: 'Beginner' },
  { level: 3, name: 'Rookie' },
  { level: 5, name: 'Amateur' },
  { level: 7, name: 'Novice' },
  { level: 10, name: 'Apprentice' },
  { level: 12, name: 'Intermediate' },
  { level: 15, name: 'Journeyman' },
  { level: 18, name: 'Experienced' },
  { level: 20, name: 'Seasoned' },
  { level: 25, name: 'Professional' },
  { level: 30, name: 'Expert' },
  { level: 35, name: 'Master' },
  { level: 40, name: 'Grandmaster' },
  { level: 50, name: 'Legend' },
  { level: 75, name: 'Mythical' },
  { level: 100, name: 'Godfather' },
];

// ============ CITY AREAS ============
export interface CityArea {
  id: string;
  name: string;
  district: string;
  locations: string[];
}

export const cityAreas: CityArea[] = [
  { id: 'west_side', name: 'West Side', district: 'West', locations: ['Education', 'Gym', 'Travel Agency'] },
  { id: 'north_side', name: 'North Side', district: 'North', locations: ['Auction House', 'Item Market', 'Points Building'] },
  { id: 'red_light', name: 'Red-Light District', district: 'South', locations: ['Casino', 'Dump', 'Loan Shark', 'Missions'] },
  { id: 'residential', name: 'Residential', district: 'East', locations: ['Estate Agents', 'Property'] },
  { id: 'city_center', name: 'City Center', district: 'Center', locations: ['Hospital', 'Jail', 'Museum', 'Community Center'] },
  { id: 'financial', name: 'Financial District', district: 'Center', locations: ['Bank', 'Stock Market'] },
  { id: 'east_side', name: 'East Side', district: 'East', locations: ['Gun Shop', 'Pharmacy', 'Super Store', 'Pawn Shop', 'Post Office'] },
  { id: 'docks', name: 'Docks', district: 'East', locations: ['Black Market', 'Warehouse'] },
  { id: 'raceway', name: 'Raceway', district: 'South', locations: ['Racing', 'Car Dealer'] },
];
