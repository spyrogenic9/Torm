// ============ ORGANIZED CRIME ============
export interface OrganizedCrime {
  id: string;
  name: string;
  tier: number;
  members: number;
  nerveCost: number;
  duration: number;
  minReward: number;
  maxReward: number;
  respect: number;
  levelReq: number;
  roles: string[];
}

export const organizedCrimes: OrganizedCrime[] = [
  { id: 'oc_pickpocket', name: 'Pickpocket Ring', tier: 1, members: 2, nerveCost: 3, duration: 5, minReward: 500, maxReward: 1500, respect: 5, levelReq: 5, roles: ['Leader', 'Distractor'] },
  { id: 'oc_shoplift', name: 'Shoplifting Crew', tier: 1, members: 3, nerveCost: 5, duration: 8, minReward: 1000, maxReward: 3000, respect: 10, levelReq: 7, roles: ['Leader', 'Lookout', 'Runner'] },
  { id: 'oc_burglary', name: 'Burglary Gang', tier: 2, members: 3, nerveCost: 8, duration: 12, minReward: 3000, maxReward: 8000, respect: 20, levelReq: 10, roles: ['Leader', 'Lockpicker', 'Getaway'] },
  { id: 'oc_drug_ring', name: 'Drug Distribution', tier: 2, members: 4, nerveCost: 10, duration: 15, minReward: 5000, maxReward: 15000, respect: 30, levelReq: 12, roles: ['Leader', 'Supplier', 'Dealer', 'Enforcer'] },
  { id: 'oc_arms_deal', name: 'Arms Trafficking', tier: 3, members: 4, nerveCost: 15, duration: 20, minReward: 10000, maxReward: 30000, respect: 50, levelReq: 15, roles: ['Leader', 'Smuggler', 'Buyer', 'Guard'] },
  { id: 'oc_bank_heist', name: 'Bank Heist', tier: 3, members: 5, nerveCost: 20, duration: 25, minReward: 20000, maxReward: 60000, respect: 80, levelReq: 18, roles: ['Leader', 'Hacker', 'Demolitions', 'Driver', 'Muscle'] },
  { id: 'oc_kidnapping', name: 'Kidnapping Ring', tier: 4, members: 5, nerveCost: 25, duration: 30, minReward: 30000, maxReward: 100000, respect: 120, levelReq: 20, roles: ['Leader', 'Surveillance', 'Abductor', 'Negotiator', 'Guard'] },
  { id: 'oc_cyber_attack', name: 'Cyber Crime Syndicate', tier: 4, members: 6, nerveCost: 30, duration: 35, minReward: 50000, maxReward: 150000, respect: 180, levelReq: 22, roles: ['Leader', 'Hacker', 'Analyst', 'Operator', 'Cleaner', 'Fence'] },
];

// ============ TERRITORY ============
export interface Territory {
  id: string;
  name: string;
  district: string;
  size: number;
  level: number;
  dailyRespect: number;
  racket?: string;
}

export const territories: Territory[] = [
  { id: 'territory_1', name: 'Eastside Block', district: 'East', size: 3, level: 1, dailyRespect: 5, racket: 'Protection Racket' },
  { id: 'territory_2', name: 'Docks Warehouse', district: 'East', size: 5, level: 2, dailyRespect: 10, racket: 'Arms Dealer' },
  { id: 'territory_3', name: 'Red Light Corner', district: 'South', size: 2, level: 1, dailyRespect: 5, racket: 'Bordello' },
  { id: 'territory_4', name: 'Casino District', district: 'South', size: 4, level: 3, dailyRespect: 20, racket: 'Illegal Casino' },
  { id: 'territory_5', name: 'Financial Plaza', district: 'Center', size: 6, level: 4, dailyRespect: 30, racket: 'Money Launderer' },
  { id: 'territory_6', name: 'Residential Area', district: 'East', size: 4, level: 2, dailyRespect: 10, racket: 'Point Broker' },
  { id: 'territory_7', name: 'Industrial Zone', district: 'West', size: 5, level: 3, dailyRespect: 20, racket: 'Drugs Lab' },
  { id: 'territory_8', name: 'Suburbs', district: 'North', size: 3, level: 1, dailyRespect: 5, racket: 'Truck Stop' },
  { id: 'territory_9', name: 'Downtown', district: 'Center', size: 8, level: 5, dailyRespect: 40, racket: 'Street Surgeon' },
  { id: 'territory_10', name: 'Harbor', district: 'East', size: 5, level: 3, dailyRespect: 20, racket: 'Cannabis Factory' },
];

// ============ RACING ============
export interface Car {
  id: string;
  name: string;
  class: string;
  speed: number;
  acceleration: number;
  handling: number;
  price: number;
  levelReq: number;
}

export const cars: Car[] = [
  { id: 'beatup', name: 'Beat-up Sedan', class: 'Street', speed: 30, acceleration: 25, handling: 35, price: 5000, levelReq: 5 },
  { id: 'sport', name: 'Sports Coupe', class: 'Sport', speed: 50, acceleration: 45, handling: 50, price: 25000, levelReq: 8 },
  { id: 'muscle', name: 'Muscle Car', class: 'Muscle', speed: 60, acceleration: 55, handling: 40, price: 40000, levelReq: 10 },
  { id: 'super', name: 'Supercar', class: 'Super', speed: 80, acceleration: 75, handling: 70, price: 100000, levelReq: 15 },
  { id: 'hyper', name: 'Hypercar', class: 'Hyper', speed: 95, acceleration: 90, handling: 85, price: 300000, levelReq: 20 },
  { id: 'formula', name: 'Formula Racer', class: 'Formula', speed: 100, acceleration: 95, handling: 95, price: 1000000, levelReq: 25 },
];

export const raceTracks = [
  { id: 'track_1', name: 'City Circuit', difficulty: 1, length: 'Short' },
  { id: 'track_2', name: 'Highway Sprint', difficulty: 2, length: 'Medium' },
  { id: 'track_3', name: 'Mountain Pass', difficulty: 3, length: 'Long' },
  { id: 'track_4', name: 'Coastal Road', difficulty: 4, length: 'Medium' },
  { id: 'track_5', name: 'Industrial Zone', difficulty: 5, length: 'Short' },
  { id: 'track_6', name: 'Desert Highway', difficulty: 6, length: 'Long' },
  { id: 'track_7', name: 'Night City', difficulty: 7, length: 'Medium' },
  { id: 'track_8', name: 'Airport Runway', difficulty: 8, length: 'Short' },
];

// ============ HUNTING ============
export interface HuntAnimal {
  id: string;
  name: string;
  icon: string;
  difficulty: number;
  minReward: number;
  maxReward: number;
  expReward: number;
  energyCost: number;
}

export const huntAnimals: HuntAnimal[] = [
  { id: 'rabbit', name: 'Rabbit', icon: '🐰', difficulty: 5, minReward: 50, maxReward: 150, expReward: 2, energyCost: 3 },
  { id: 'deer', name: 'Deer', icon: '🦌', difficulty: 15, minReward: 200, maxReward: 500, expReward: 5, energyCost: 5 },
  { id: 'boar', name: 'Wild Boar', icon: '🐗', difficulty: 25, minReward: 400, maxReward: 1000, expReward: 8, energyCost: 7 },
  { id: 'bear', name: 'Bear', icon: '🐻', difficulty: 40, minReward: 800, maxReward: 2000, expReward: 12, energyCost: 10 },
  { id: 'lion', name: 'Lion', icon: '🦁', difficulty: 60, minReward: 1500, maxReward: 4000, expReward: 18, energyCost: 15 },
  { id: 'elephant', name: 'Elephant', icon: '🐘', difficulty: 80, minReward: 3000, maxReward: 8000, expReward: 25, energyCost: 20 },
  { id: 'rhino', name: 'Rhino', icon: '🦏', difficulty: 100, minReward: 5000, maxReward: 15000, expReward: 35, energyCost: 25 },
];

// ============ MISSIONS ============
export interface Mission {
  id: string;
  name: string;
  description: string;
  levelReq: number;
  reward: number;
  credits: number;
  difficulty: number;
}

export const missions: Mission[] = [
  { id: 'mission_1', name: 'Deliver Package', description: 'Deliver a package to a contact.', levelReq: 3, reward: 500, credits: 1, difficulty: 1 },
  { id: 'mission_2', name: 'Eliminate Target', description: 'Take out a rival gang member.', levelReq: 5, reward: 1000, credits: 2, difficulty: 2 },
  { id: 'mission_3', name: 'Steal Documents', description: 'Infiltrate an office and steal documents.', levelReq: 8, reward: 2000, credits: 3, difficulty: 3 },
  { id: 'mission_4', name: 'Protect VIP', description: 'Guard a VIP from assassins.', levelReq: 10, reward: 3000, credits: 4, difficulty: 4 },
  { id: 'mission_5', name: 'Hack System', description: 'Break into a secure computer system.', levelReq: 12, reward: 5000, credits: 5, difficulty: 5 },
];

// ============ AWARDS ============
export interface Award {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export const awards: Award[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Win your first fight', icon: '🩸', requirement: '1 win' },
  { id: 'criminal_mastermind', name: 'Criminal Mastermind', description: 'Complete 100 crimes', icon: '🧠', requirement: '100 crimes' },
  { id: 'rich', name: 'Filthy Rich', description: 'Earn $1,000,000', icon: '💰', requirement: '$1M earned' },
  { id: 'gym_rat', name: 'Gym Rat', description: 'Train 500 times', icon: '🏋️', requirement: '500 training sessions' },
  { id: 'faction_leader', name: 'Faction Leader', description: 'Lead a faction to victory', icon: '👑', requirement: 'Faction leader' },
  { id: 'world_traveler', name: 'World Traveler', description: 'Visit all destinations', icon: '🌍', requirement: 'All destinations' },
  { id: 'racing_champion', name: 'Racing Champion', description: 'Win 50 races', icon: '🏆', requirement: '50 race wins' },
  { id: 'hunter', name: 'Big Game Hunter', description: 'Hunt 100 animals', icon: '🎯', requirement: '100 hunts' },
  { id: 'collector', name: 'Master Collector', description: 'Complete all collections', icon: '🏛️', requirement: 'All collections' },
  { id: 'married', name: 'Happily Married', description: 'Get married', icon: '💍', requirement: 'Married' },
];

// ============ COMPANIES ============
export interface Company {
  id: string;
  name: string;
  type: string;
  icon: string;
  cost: number;
  maxEmployees: number;
}

export const companies: Company[] = [
  { id: 'company_1', name: 'Grocery Store', type: 'Retail', icon: '🛒', cost: 500000, maxEmployees: 5 },
  { id: 'company_2', name: 'Gym', type: 'Fitness', icon: '💪', cost: 750000, maxEmployees: 8 },
  { id: 'company_3', name: 'Casino', type: 'Entertainment', icon: '🎰', cost: 2000000, maxEmployees: 15 },
  { id: 'company_4', name: 'Hospital', type: 'Medical', icon: '🏥', cost: 3000000, maxEmployees: 20 },
  { id: 'company_5', name: 'Tech Startup', type: 'Technology', icon: '💻', cost: 1500000, maxEmployees: 10 },
  { id: 'company_6', name: 'Restaurant', type: 'Food', icon: '🍽️', cost: 600000, maxEmployees: 12 },
  { id: 'company_7', name: 'Nightclub', type: 'Entertainment', icon: '🎵', cost: 1000000, maxEmployees: 10 },
  { id: 'company_8', name: 'Law Firm', type: 'Legal', icon: '⚖️', cost: 2500000, maxEmployees: 8 },
  { id: 'company_9', name: 'Construction', type: 'Industrial', icon: '🏗️', cost: 1800000, maxEmployees: 25 },
];

// ============ BOUNTIES ============
export interface Bounty {
  id: string;
  target: string;
  reward: number;
  difficulty: number;
  timeLimit: number;
}

export const bounties: Bounty[] = [
  { id: 'bounty_1', target: 'Street Thug', reward: 500, difficulty: 1, timeLimit: 60 },
  { id: 'bounty_2', target: 'Gang Member', reward: 1500, difficulty: 2, timeLimit: 45 },
  { id: 'bounty_3', target: 'Mob Enforcer', reward: 3000, difficulty: 3, timeLimit: 30 },
  { id: 'bounty_4', target: 'Hitman', reward: 5000, difficulty: 4, timeLimit: 20 },
  { id: 'bounty_5', target: 'Crime Boss', reward: 10000, difficulty: 5, timeLimit: 15 },
];

// ============ COLLECTIONS ============
export interface Collection {
  id: string;
  name: string;
  icon: string;
  description: string;
  value: number;
  items: string[];
}

export const collections: Collection[] = [
  { id: 'collection_1', name: 'Rare Coins', icon: '🪙', description: 'Ancient coins from around the world', value: 50000, items: ['coin_1', 'coin_2', 'coin_3'] },
  { id: 'collection_2', name: 'Vintage Weapons', icon: '🗡️', description: 'Historical weapons and artifacts', value: 100000, items: ['weapon_1', 'weapon_2', 'weapon_3'] },
  { id: 'collection_3', name: 'Art Collection', icon: '🖼️', description: 'Famous paintings and sculptures', value: 200000, items: ['art_1', 'art_2', 'art_3'] },
  { id: 'collection_4', name: 'Gemstones', icon: '💎', description: 'Rare and precious gems', value: 150000, items: ['gem_1', 'gem_2', 'gem_3'] },
  { id: 'collection_5', name: 'Antique Cars', icon: '🚗', description: 'Classic and vintage automobiles', value: 300000, items: ['car_1', 'car_2', 'car_3'] },
];

// ============ VIRUSES ============
export interface Virus {
  id: string;
  name: string;
  level: number;
  cost: number;
  sellPrice: number;
  effect: string;
}

export const viruses: Virus[] = [
  { id: 'virus_1', name: 'Basic Trojan', level: 1, cost: 1000, sellPrice: 2000, effect: 'Steal small amounts of cash' },
  { id: 'virus_2', name: 'Keylogger', level: 2, cost: 3000, sellPrice: 6000, effect: 'Capture passwords' },
  { id: 'virus_3', name: 'Ransomware', level: 3, cost: 8000, sellPrice: 16000, effect: 'Lock systems for ransom' },
  { id: 'virus_4', name: 'Worm', level: 4, cost: 15000, sellPrice: 30000, effect: 'Spread and corrupt data' },
  { id: 'virus_5', name: 'Rootkit', level: 5, cost: 30000, sellPrice: 60000, effect: 'Gain full system control' },
];

// ============ MARRIAGE CANDIDATES ============
export interface MarriageCandidate {
  id: string;
  name: string;
  level: number;
  stats: { strength: number; speed: number; defense: number; dexterity: number };
  benefits: string[];
}

export const marriageCandidates: MarriageCandidate[] = [
  { id: 'candidate_1', name: 'Alex', level: 10, stats: { strength: 100, speed: 80, defense: 90, dexterity: 85 }, benefits: ['Shared housing', 'Combat bonus'] },
  { id: 'candidate_2', name: 'Jordan', level: 15, stats: { strength: 150, speed: 120, defense: 130, dexterity: 125 }, benefits: ['Shared housing', 'Crime bonus'] },
  { id: 'candidate_3', name: 'Taylor', level: 20, stats: { strength: 250, speed: 200, defense: 220, dexterity: 210 }, benefits: ['Shared housing', 'Business bonus'] },
];

// ============ NEWS TEMPLATES ============
export const newsTemplates = [
  'Major faction war erupts in downtown!',
  'Record-breaking heist successful',
  'New gym opens in West Side',
  'Stock market crashes, investors panic',
  'Police crack down on organized crime',
  'Luxury property sells for millions',
  'Racing championship finals tonight',
  'Mysterious virus attacks city systems',
];
