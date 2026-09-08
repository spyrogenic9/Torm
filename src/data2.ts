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
  respectReward: number;
  levelReq: number;
  roles: string[];
}

export const organizedCrimes: OrganizedCrime[] = [
  { id: 'oc_pickpocket', name: 'Pickpocket Ring', tier: 1, members: 2, nerveCost: 3, duration: 5, minReward: 500, maxReward: 1500, respectReward: 5, levelReq: 5, roles: ['Leader', 'Distractor'] },
  { id: 'oc_shoplift', name: 'Shoplifting Crew', tier: 1, members: 3, nerveCost: 5, duration: 8, minReward: 1000, maxReward: 3000, respectReward: 10, levelReq: 7, roles: ['Leader', 'Lookout', 'Runner'] },
  { id: 'oc_burglary', name: 'Burglary Gang', tier: 2, members: 3, nerveCost: 8, duration: 12, minReward: 3000, maxReward: 8000, respectReward: 20, levelReq: 10, roles: ['Leader', 'Lockpicker', 'Getaway'] },
  { id: 'oc_drug_ring', name: 'Drug Distribution', tier: 2, members: 4, nerveCost: 10, duration: 15, minReward: 5000, maxReward: 15000, respectReward: 30, levelReq: 12, roles: ['Leader', 'Supplier', 'Dealer', 'Enforcer'] },
  { id: 'oc_arms_deal', name: 'Arms Trafficking', tier: 3, members: 4, nerveCost: 15, duration: 20, minReward: 10000, maxReward: 30000, respectReward: 50, levelReq: 15, roles: ['Leader', 'Smuggler', 'Buyer', 'Guard'] },
  { id: 'oc_bank_heist', name: 'Bank Heist', tier: 3, members: 5, nerveCost: 20, duration: 25, minReward: 20000, maxReward: 60000, respectReward: 80, levelReq: 18, roles: ['Leader', 'Hacker', 'Demolitions', 'Driver', 'Muscle'] },
  { id: 'oc_kidnapping', name: 'Kidnapping Ring', tier: 4, members: 5, nerveCost: 25, duration: 30, minReward: 30000, maxReward: 100000, respectReward: 120, levelReq: 20, roles: ['Leader', 'Surveillance', 'Abductor', 'Negotiator', 'Guard'] },
  { id: 'oc_cyber_attack', name: 'Cyber Crime Syndicate', tier: 4, members: 6, nerveCost: 30, duration: 35, minReward: 50000, maxReward: 150000, respectReward: 180, levelReq: 22, roles: ['Leader', 'Hacker', 'Analyst', 'Operator', 'Cleaner', 'Fence'] },
];

// ============ TERRITORY ============
export interface Territory {
  id: string;
  name: string;
  district: string;
  level: number;
  dailyRespect: number;
  racket?: string;
}

export const territories: Territory[] = [
  { id: 'territory_1', name: 'Eastside Block', district: 'East', level: 1, dailyRespect: 5, racket: 'Protection Racket' },
  { id: 'territory_2', name: 'Docks Warehouse', district: 'East', level: 2, dailyRespect: 10, racket: 'Arms Dealer' },
  { id: 'territory_3', name: 'Red Light Corner', district: 'South', level: 1, dailyRespect: 5, racket: 'Bordello' },
  { id: 'territory_4', name: 'Casino District', district: 'South', level: 3, dailyRespect: 20, racket: 'Illegal Casino' },
  { id: 'territory_5', name: 'Financial Plaza', district: 'Center', level: 4, dailyRespect: 30, racket: 'Money Launderer' },
  { id: 'territory_6', name: 'Residential Area', district: 'East', level: 2, dailyRespect: 10, racket: 'Point Broker' },
  { id: 'territory_7', name: 'Industrial Zone', district: 'West', level: 3, dailyRespect: 20, racket: 'Drugs Lab' },
  { id: 'territory_8', name: 'Suburbs', district: 'North', level: 1, dailyRespect: 5, racket: 'Truck Stop' },
  { id: 'territory_9', name: 'Downtown', district: 'Center', level: 5, dailyRespect: 40, racket: 'Street Surgeon' },
  { id: 'territory_10', name: 'Harbor', district: 'East', level: 3, dailyRespect: 20, racket: 'Cannabis Factory' },
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
  difficulty: number;
  minReward: number;
  maxReward: number;
  expReward: number;
  energyCost: number;
}

export const huntAnimals: HuntAnimal[] = [
  { id: 'rabbit', name: 'Rabbit', difficulty: 5, minReward: 50, maxReward: 150, expReward: 2, energyCost: 3 },
  { id: 'deer', name: 'Deer', difficulty: 15, minReward: 200, maxReward: 500, expReward: 5, energyCost: 5 },
  { id: 'boar', name: 'Wild Boar', difficulty: 25, minReward: 400, maxReward: 1000, expReward: 8, energyCost: 7 },
  { id: 'bear', name: 'Bear', difficulty: 40, minReward: 800, maxReward: 2000, expReward: 12, energyCost: 10 },
  { id: 'lion', name: 'Lion', difficulty: 60, minReward: 1500, maxReward: 4000, expReward: 18, energyCost: 15 },
  { id: 'elephant', name: 'Elephant', difficulty: 80, minReward: 3000, maxReward: 8000, expReward: 25, energyCost: 20 },
  { id: 'rhino', name: 'Rhino', difficulty: 100, minReward: 5000, maxReward: 15000, expReward: 35, energyCost: 25 },
];

// ============ MISSIONS ============
export interface Mission {
  id: string;
  name: string;
  npc: string;
  description: string;
  objective: string;
  levelReq: number;
  reward: number;
  xpReward: number;
  itemReward?: string;
}

export const missions: Mission[] = [
  { id: 'mission_1', name: 'First Blood', npc: 'Jimmy the Rat', description: 'Prove yourself in the streets', objective: 'Defeat 3 thugs', levelReq: 1, reward: 500, xpReward: 10 },
  { id: 'mission_2', name: 'Package Delivery', npc: 'The Courier', description: 'Deliver a package across town', objective: 'Complete 5 crimes', levelReq: 3, reward: 1500, xpReward: 20 },
  { id: 'mission_3', name: 'Protection Racket', npc: 'Big Tony', description: 'Collect protection money', objective: 'Mug 5 people', levelReq: 5, reward: 3000, xpReward: 30 },
  { id: 'mission_4', name: 'Arms Deal', npc: 'The Gunsmith', description: 'Acquire weapons for the faction', objective: 'Buy 3 weapons', levelReq: 7, reward: 5000, xpReward: 40, itemReward: 'pistol' },
  { id: 'mission_5', name: 'Turf War', npc: 'The Boss', description: 'Take out rival gang members', objective: 'Hospitalize 5 enemies', levelReq: 10, reward: 10000, xpReward: 60 },
  { id: 'mission_6', name: 'Heist Planning', npc: 'The Mastermind', description: 'Plan the perfect heist', objective: 'Reach level 15', levelReq: 12, reward: 20000, xpReward: 100, itemReward: 'rifle' },
  { id: 'mission_7', name: 'Underground Fight Club', npc: 'The Promoter', description: 'Win in the underground ring', objective: 'Win 10 fights', levelReq: 15, reward: 30000, xpReward: 150 },
  { id: 'mission_8', name: 'Corporate Espionage', npc: 'The Executive', description: 'Steal company secrets', objective: 'Reach intelligence 50', levelReq: 18, reward: 50000, xpReward: 200 },
];

// ============ AWARDS ============
export interface Award {
  id: string;
  name: string;
  description: string;
  category: string;
  requirement: string;
  icon: string;
}

export const awards: Award[] = [
  { id: 'award_crime_1', name: 'Petty Thief', description: 'Commit 10 crimes', category: 'Crime', requirement: 'totalCrimes >= 10', icon: '🔓' },
  { id: 'award_crime_2', name: 'Career Criminal', description: 'Commit 100 crimes', category: 'Crime', requirement: 'totalCrimes >= 100', icon: '🎭' },
  { id: 'award_crime_3', name: 'Crime Lord', description: 'Commit 1000 crimes', category: 'Crime', requirement: 'totalCrimes >= 1000', icon: '👑' },
  { id: 'award_combat_1', name: 'Street Fighter', description: 'Win 10 fights', category: 'Combat', requirement: 'totalAttacks >= 10', icon: '👊' },
  { id: 'award_combat_2', name: 'Brawler', description: 'Win 100 fights', category: 'Combat', requirement: 'totalAttacks >= 100', icon: '⚔️' },
  { id: 'award_combat_3', name: 'War Machine', description: 'Win 1000 fights', category: 'Combat', requirement: 'totalAttacks >= 1000', icon: '💀' },
  { id: 'award_mug_1', name: 'Pickpocket', description: 'Mug 10 people', category: 'Combat', requirement: 'totalMugs >= 10', icon: '💰' },
  { id: 'award_mug_2', name: 'Highwayman', description: 'Mug 100 people', category: 'Combat', requirement: 'totalMugs >= 100', icon: '🏴‍☠️' },
  { id: 'award_hosp_1', name: 'Bully', description: 'Hospitalize 10 people', category: 'Combat', requirement: 'totalHospitalized >= 10', icon: '🏥' },
  { id: 'award_hosp_2', name: 'Menace', description: 'Hospitalize 100 people', category: 'Combat', requirement: 'totalHospitalized >= 100', icon: '💉' },
  { id: 'award_level_1', name: 'Rookie', description: 'Reach level 10', category: 'Progression', requirement: 'level >= 10', icon: '⭐' },
  { id: 'award_level_2', name: 'Veteran', description: 'Reach level 25', category: 'Progression', requirement: 'level >= 25', icon: '🌟' },
  { id: 'award_level_3', name: 'Legend', description: 'Reach level 50', category: 'Progression', requirement: 'level >= 50', icon: '✨' },
  { id: 'award_wealth_1', name: 'Well Off', description: 'Earn $100,000 total', category: 'Economy', requirement: 'totalCashEarned >= 100000', icon: '💵' },
  { id: 'award_wealth_2', name: 'Rich', description: 'Earn $1,000,000 total', category: 'Economy', requirement: 'totalCashEarned >= 1000000', icon: '💎' },
  { id: 'award_wealth_3', name: 'Millionaire', description: 'Earn $10,000,000 total', category: 'Economy', requirement: 'totalCashEarned >= 10000000', icon: '🏦' },
];

// ============ COMPANIES ============
export interface Company {
  id: string;
  name: string;
  type: string;
  cost: number;
  levelReq: number;
  maxEmployees: number;
  specialties: string[];
}

export const companies: Company[] = [
  { id: 'company_grocery', name: 'Grocery Store', type: 'Retail', cost: 100000, levelReq: 10, maxEmployees: 5, specialties: ['Sales', 'Management'] },
  { id: 'company_gym', name: 'Fitness Center', type: 'Fitness', cost: 200000, levelReq: 12, maxEmployees: 8, specialties: ['Training', 'Nutrition'] },
  { id: 'company_casino', name: 'Casino', type: 'Entertainment', cost: 500000, levelReq: 15, maxEmployees: 10, specialties: ['Gaming', 'Security'] },
  { id: 'company_hospital', name: 'Private Hospital', type: 'Medical', cost: 800000, levelReq: 18, maxEmployees: 12, specialties: ['Medicine', 'Administration'] },
  { id: 'company_tech', name: 'Tech Startup', type: 'Technology', cost: 1000000, levelReq: 20, maxEmployees: 15, specialties: ['Programming', 'Marketing'] },
  { id: 'company_arms', name: 'Arms Dealer', type: 'Military', cost: 2000000, levelReq: 22, maxEmployees: 8, specialties: ['Weapons', 'Logistics'] },
];

// ============ BOUNTIES ============
export interface Bounty {
  id: string;
  target: string;
  reward: number;
  level: number;
  strength: number;
  speed: number;
  defense: number;
  dexterity: number;
}

export const bounties: Bounty[] = [
  { id: 'bounty_1', target: 'Street Thug', reward: 500, level: 2, strength: 15, speed: 12, defense: 8, dexterity: 10 },
  { id: 'bounty_2', target: 'Gang Member', reward: 1500, level: 5, strength: 35, speed: 28, defense: 20, dexterity: 25 },
  { id: 'bounty_3', target: 'Mob Enforcer', reward: 3000, level: 8, strength: 60, speed: 50, defense: 45, dexterity: 40 },
  { id: 'bounty_4', target: 'Hitman', reward: 6000, level: 12, strength: 100, speed: 85, defense: 75, dexterity: 80 },
  { id: 'bounty_5', target: 'Crime Boss', reward: 12000, level: 15, strength: 180, speed: 150, defense: 130, dexterity: 140 },
  { id: 'bounty_6', target: 'Assassin', reward: 25000, level: 20, strength: 300, speed: 250, defense: 220, dexterity: 240 },
];

// ============ COLLECTIONS ============
export interface Collection {
  id: string;
  name: string;
  category: string;
  items: string[];
  reward: number;
}

export const collections: Collection[] = [
  { id: 'collection_flowers', name: 'Flower Collection', category: 'Flowers', items: ['Rose', 'Tulip', 'Orchid', 'Lily', 'Daisy'], reward: 5000 },
  { id: 'collection_plushies', name: 'Plushie Collection', category: 'Plushies', items: ['Teddy Bear', 'Rabbit', 'Cat', 'Dog', 'Panda'], reward: 8000 },
  { id: 'collection_souvenirs', name: 'Souvenir Collection', category: 'Souvenirs', items: ['Mexico Sombrero', 'Canada Maple', 'Japan Katana', 'Swiss Watch', 'UAE Perfume'], reward: 15000 },
  { id: 'collection_drugs', name: 'Drug Collection', category: 'Drugs', items: ['Xanax', 'Vicodin', 'LSD', 'Cannabis', 'Speed'], reward: 10000 },
  { id: 'collection_weapons', name: 'Weapon Collection', category: 'Weapons', items: ['Knife', 'Pistol', 'Shotgun', 'Rifle', 'Sniper'], reward: 20000 },
];

// ============ NEWSPAPER EVENTS ============
export interface NewsEvent {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: number;
}

export const newsTemplates = [
  { title: 'Gang War Escalates', content: 'Tensions rise in the Eastside as rival factions clash over territory.', category: 'Faction' },
  { title: 'New Business Opens', content: 'A new company has opened in the Financial District, creating job opportunities.', category: 'Economy' },
  { title: 'Police Crackdown', content: 'Law enforcement increases patrols after recent crime spree.', category: 'Crime' },
  { title: 'Stock Market Rally', content: 'Torn Technologies sees major gains as new products launch.', category: 'Economy' },
  { title: 'Hospital Expansion', content: 'Torn City Hospital adds new wing to handle increased patient load.', category: 'City' },
  { title: 'Racing Championship', content: 'Annual racing championship draws record crowds at the Raceway.', category: 'Entertainment' },
  { title: 'Casino Jackpot', content: 'Lucky player hits massive jackpot at Red Light Casino!', category: 'Entertainment' },
  { title: 'Faction Territory War', content: 'Multiple factions battle for control of valuable territories.', category: 'Faction' },
];

// ============ MARRIAGE ============
export interface MarriageProposal {
  id: string;
  name: string;
  level: number;
  stats: number;
}

export const marriageCandidates: MarriageProposal[] = [
  { id: 'candidate_1', name: 'Alex', level: 5, stats: 100 },
  { id: 'candidate_2', name: 'Jordan', level: 10, stats: 250 },
  { id: 'candidate_3', name: 'Casey', level: 15, stats: 500 },
  { id: 'candidate_4', name: 'Morgan', level: 20, stats: 1000 },
  { id: 'candidate_5', name: 'Riley', level: 25, stats: 2000 },
];

// ============ VIRUS / HACKING ============
export interface Virus {
  id: string;
  name: string;
  type: string;
  power: number;
  cost: number;
  levelReq: number;
  effect: string;
}

export const viruses: Virus[] = [
  { id: 'virus_trojan', name: 'Trojan Horse', type: 'Stealth', power: 10, cost: 1000, levelReq: 5, effect: 'Bypass basic security' },
  { id: 'virus_worm', name: 'Computer Worm', type: 'Spread', power: 20, cost: 3000, levelReq: 8, effect: 'Infect multiple targets' },
  { id: 'virus_ransomware', name: 'Ransomware', type: 'Extortion', power: 35, cost: 8000, levelReq: 12, effect: 'Lock and demand payment' },
  { id: 'virus_rootkit', name: 'Rootkit', type: 'Persistence', power: 50, cost: 15000, levelReq: 15, effect: 'Deep system access' },
  { id: 'virus_zombie', name: 'Zombie Network', type: 'DDoS', power: 75, cost: 30000, levelReq: 18, effect: 'Control botnet' },
  { id: 'virus_zero_day', name: 'Zero-Day Exploit', type: 'Advanced', power: 100, cost: 60000, levelReq: 22, effect: 'Unknown vulnerability' },
];
