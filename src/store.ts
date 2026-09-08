import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { crimes, gyms, courses, jobs, items, npcEnemies, stocks, properties, ranks } from './data';

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface StockHolding {
  stockId: string;
  shares: number;
  avgPrice: number;
}

export interface CombatLog {
  id: string;
  target: string;
  result: 'win' | 'lose' | 'escape';
  type: 'mug' | 'hospitalize' | 'leave' | 'attack';
  timestamp: number;
}

export interface CrimeLog {
  id: string;
  crimeName: string;
  success: boolean;
  reward: number;
  timestamp: number;
}

export interface GameState {
  // Character
  name: string;
  level: number;
  xp: number;
  age: number;
  rank: string;

  // Resources
  cash: number;
  bank: number;
  bankInvestment: number;
  bankInvestmentTime: number;
  points: number;
  energy: number;
  maxEnergy: number;
  nerve: number;
  maxNerve: number;
  happy: number;
  maxHappy: number;
  life: number;
  maxLife: number;

  // Battle Stats
  strength: number;
  speed: number;
  defense: number;
  dexterity: number;

  // Working Stats
  manualLabor: number;
  intelligence: number;
  endurance: number;

  // Crime
  crimeExp: number;
  crimeSkill: number;

  // Status & Timers
  inHospital: boolean;
  hospitalTimer: number;
  inJail: boolean;
  jailTimer: number;
  isTraveling: boolean;
  travelDestination: string | null;
  travelTimer: number;
  inEducation: boolean;
  educationCourse: string | null;
  educationTimer: number;
  isWorking: boolean;
  currentJob: string | null;

  // Equipment
  equippedWeapon: string;
  equippedArmor: string | null;

  // Inventory
  inventory: InventoryItem[];

  // Stocks
  stockHoldings: StockHolding[];
  stockPrices: Record<string, number>;

  // Property
  currentProperty: string | null;

  // Faction
  factionName: string | null;
  factionRank: string | null;
  factionRespect: number;

  // Logs
  combatLogs: CombatLog[];
  crimeLogs: CrimeLog[];

  // Stats tracking
  totalAttacks: number;
  totalCrimes: number;
  totalMugs: number;
  totalHospitalized: number;
  totalXpGained: number;
  totalCashEarned: number;

  // Merits
  merits: {
    strength: number;
    defense: number;
    speed: number;
    dexterity: number;
    life: number;
    crime: number;
    energy: number;
    nerve: number;
    happy: number;
  };
  meritPoints: number;

  // Actions
  setName: (name: string) => void;
  trainStat: (stat: 'strength' | 'speed' | 'defense' | 'dexterity', gymId: string) => void;
  commitCrime: (crimeId: string) => void;
  attackPlayer: (targetId: string, type: 'mug' | 'hospitalize' | 'leave') => void;
  workJob: () => void;
  applyJob: (jobId: string) => void;
  buyItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  depositBank: (amount: number) => void;
  withdrawBank: (amount: number) => void;
  investBank: (amount: number) => void;
  buyStock: (stockId: string, shares: number) => void;
  sellStock: (stockId: string, shares: number) => void;
  startEducation: (courseId: string) => void;
  buyProperty: (propertyId: string) => void;
  travel: (destinationId: string) => void;
  gamble: (gameId: string, bet: number, choice?: string) => number;
  tick: () => void;
  allocateMerit: (merit: string) => void;
  revivePlayer: () => void;
  createFaction: (name: string) => void;
  joinFaction: (name: string) => void;
  resetGame: () => void;
}

const getRank = (level: number): string => {
  let currentRank = 'Absolute Beginner';
  for (const r of ranks) {
    if (level >= r.level) currentRank = r.name;
  }
  return currentRank;
};

const xpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      name: 'Player',
      level: 1,
      xp: 0,
      age: 0,
      rank: 'Absolute Beginner',

      cash: 1000,
      bank: 0,
      bankInvestment: 0,
      bankInvestmentTime: 0,
      points: 0,
      energy: 10,
      maxEnergy: 10,
      nerve: 10,
      maxNerve: 10,
      happy: 10,
      maxHappy: 10,
      life: 100,
      maxLife: 100,

      strength: 5,
      speed: 5,
      defense: 5,
      dexterity: 5,

      manualLabor: 0,
      intelligence: 0,
      endurance: 0,

      crimeExp: 0,
      crimeSkill: 1,

      inHospital: false,
      hospitalTimer: 0,
      inJail: false,
      jailTimer: 0,
      isTraveling: false,
      travelDestination: null,
      travelTimer: 0,
      inEducation: false,
      educationCourse: null,
      educationTimer: 0,
      isWorking: false,
      currentJob: null,

      equippedWeapon: 'fists',
      equippedArmor: null,

      inventory: [],
      stockHoldings: [],
      stockPrices: {
        torn_airlines: 150,
        torn_hospital: 200,
        torn_bank: 300,
        torn_motors: 100,
        torn_tech: 500,
        torn_oil: 250,
        torn_pharma: 180,
        torn_defense: 400,
      },

      currentProperty: null,
      factionName: null,
      factionRank: null,
      factionRespect: 0,

      combatLogs: [],
      crimeLogs: [],

      totalAttacks: 0,
      totalCrimes: 0,
      totalMugs: 0,
      totalHospitalized: 0,
      totalXpGained: 0,
      totalCashEarned: 0,

      merits: { strength: 0, defense: 0, speed: 0, dexterity: 0, life: 0, crime: 0, energy: 0, nerve: 0, happy: 0 },
      meritPoints: 0,

      // Actions
      setName: (name) => set({ name }),

      trainStat: (stat, gymId) => {
        const state = get();
        if (state.inHospital || state.inJail || state.isTraveling) return;
        const energyCost = 5;
        if (state.energy < energyCost) return;

        const gym = gyms.find(g => g.id === gymId);
        if (!gym) return;
        if (state.level < gym.levelReq) return;
        if (gym.statReq && state[stat] < gym.statReq) return;

        const baseGain = Math.floor((Math.random() * 3 + 1) * gym.multiplier);
        const newXp = state.xp + 5;
        const neededXp = xpForLevel(state.level);
        let newLevel = state.level;
        let newXpVal = newXp;
        let newMeritPoints = state.meritPoints;

        if (newXp >= neededXp) {
          newLevel += 1;
          newXpVal = newXp - neededXp;
          newMeritPoints += 1;
        }

        set({
          [stat]: state[stat] + baseGain,
          energy: state.energy - energyCost,
          xp: newXpVal,
          level: newLevel,
          rank: getRank(newLevel),
          meritPoints: newMeritPoints,
          totalXpGained: state.totalXpGained + 5,
        });
      },

      commitCrime: (crimeId) => {
        const state = get();
        if (state.inHospital || state.inJail || state.isTraveling) return;

        const crime = crimes.find(c => c.id === crimeId);
        if (!crime) return;
        if (state.nerve < crime.nerveCost) return;
        if (state.level < crime.levelReq) return;

        const successChance = Math.min(95, Math.max(5, 50 + state.crimeSkill * 2 - crime.difficulty + state.dexterity * 0.5));
        const success = Math.random() * 100 < successChance;

        const log: CrimeLog = {
          id: Date.now().toString(),
          crimeName: crime.name,
          success,
          reward: 0,
          timestamp: Date.now(),
        };

        if (success) {
          const reward = Math.floor(Math.random() * (crime.maxCash - crime.minCash) + crime.minCash);
          log.reward = reward;
          const newXp = state.xp + crime.expReward;
          const neededXp = xpForLevel(state.level);
          let newLevel = state.level;
          let newXpVal = newXp;
          let newMeritPoints = state.meritPoints;

          if (newXp >= neededXp) {
            newLevel += 1;
            newXpVal = newXp - neededXp;
            newMeritPoints += 1;
          }

          set({
            nerve: state.nerve - crime.nerveCost,
            cash: state.cash + reward,
            crimeExp: state.crimeExp + crime.expReward,
            crimeSkill: state.crimeSkill + 0.1,
            xp: newXpVal,
            level: newLevel,
            rank: getRank(newLevel),
            meritPoints: newMeritPoints,
            totalCrimes: state.totalCrimes + 1,
            totalCashEarned: state.totalCashEarned + reward,
            totalXpGained: state.totalXpGained + crime.expReward,
            crimeLogs: [log, ...state.crimeLogs].slice(0, 50),
          });
        } else {
          const jailChance = Math.random() * 100;
          const goJail = jailChance < 40;

          set({
            nerve: state.nerve - crime.nerveCost,
            crimeExp: state.crimeExp + Math.floor(crime.expReward * 0.3),
            totalCrimes: state.totalCrimes + 1,
            inJail: goJail,
            jailTimer: goJail ? Math.floor(Math.random() * 30 + 10) : state.jailTimer,
            crimeLogs: [log, ...state.crimeLogs].slice(0, 50),
          });
        }
      },

      attackPlayer: (targetId, type) => {
        const state = get();
        if (state.inHospital || state.inJail || state.isTraveling) return;
        if (state.energy < 5) return;

        const enemy = npcEnemies.find(e => e.id === targetId);
        if (!enemy) return;

        const playerPower = state.strength * 2 + state.speed + state.dexterity;
        const enemyPower = enemy.strength * 2 + enemy.speed + enemy.dexterity;
        const playerDef = state.defense * 2 + state.dexterity;
        const enemyAtk = enemy.strength + enemy.speed;

        let playerLife = state.maxLife;
        let enemyLife = enemy.life;
        const weapon = items.find(i => i.id === state.equippedWeapon);
        const weaponDmg = weapon?.effectValue || 3;
        const armor = items.find(i => i.id === state.equippedArmor);
        const armorDef = armor?.effectValue || 0;

        for (let round = 0; round < 20; round++) {
          const hitChance = Math.min(95, 50 + state.speed * 0.5 - enemy.dexterity * 0.3);
          if (Math.random() * 100 < hitChance) {
            const isCrit = Math.random() * 100 < (5 + state.dexterity * 0.2);
            const dmg = Math.floor((weaponDmg + state.strength * 0.3) * (isCrit ? 2 : 1));
            enemyLife -= dmg;
          }

          if (enemyLife <= 0) break;

          const enemyHitChance = Math.min(90, 50 + enemy.speed * 0.5 - state.dexterity * 0.3 - armorDef * 0.2);
          if (Math.random() * 100 < enemyHitChance) {
            const dmg = Math.max(1, Math.floor(enemyAtk * 0.5 - state.defense * 0.2 - armorDef * 0.3));
            playerLife -= dmg;
          }

          if (playerLife <= 0) break;
        }

        const won = enemyLife <= 0;
        const log: CombatLog = {
          id: Date.now().toString(),
          target: enemy.name,
          result: won ? 'win' : 'lose',
          type,
          timestamp: Date.now(),
        };

        if (won) {
          let reward = enemy.reward;
          let newState: Partial<GameState> = {
            energy: state.energy - 5,
            life: Math.max(10, playerLife),
            totalAttacks: state.totalAttacks + 1,
            combatLogs: [log, ...state.combatLogs].slice(0, 50),
          };

          if (type === 'mug') {
            const stolen = Math.floor(Math.random() * reward * 0.5);
            newState.cash = state.cash + reward + stolen;
            newState.totalMugs = state.totalMugs + 1;
            newState.totalCashEarned = state.totalCashEarned + reward + stolen;
          } else if (type === 'hospitalize') {
            newState.cash = state.cash + reward;
            newState.totalHospitalized = state.totalHospitalized + 1;
            newState.totalCashEarned = state.totalCashEarned + reward;
          } else {
            newState.cash = state.cash + reward;
            newState.totalCashEarned = state.totalCashEarned + reward;
          }

          const xpGain = Math.floor(enemy.level * 5);
          const newXp = state.xp + xpGain;
          const neededXp = xpForLevel(state.level);
          if (newXp >= neededXp) {
            newState.level = state.level + 1;
            newState.xp = newXp - neededXp;
            newState.rank = getRank(state.level + 1);
            newState.meritPoints = state.meritPoints + 1;
          } else {
            newState.xp = newXp;
          }
          newState.totalXpGained = state.totalXpGained + xpGain;

          set(newState);
        } else {
          set({
            energy: state.energy - 5,
            inHospital: true,
            hospitalTimer: Math.floor(Math.random() * 30 + 10),
            life: 0,
            totalAttacks: state.totalAttacks + 1,
            combatLogs: [log, ...state.combatLogs].slice(0, 50),
          });
        }
      },

      workJob: () => {
        const state = get();
        if (state.inHospital || state.inJail || state.isTraveling || !state.currentJob) return;
        if (state.energy < 5) return;

        const job = jobs.find(j => j.id === state.currentJob);
        if (!job) return;

        const newXp = state.xp + 3;
        const neededXp = xpForLevel(state.level);
        let newLevel = state.level;
        let newXpVal = newXp;
        let newMeritPoints = state.meritPoints;

        if (newXp >= neededXp) {
          newLevel += 1;
          newXpVal = newXp - neededXp;
          newMeritPoints += 1;
        }

        set({
          energy: state.energy - 5,
          cash: state.cash + job.salary,
          manualLabor: state.manualLabor + (job.statGain.manualLabor || 0),
          intelligence: state.intelligence + (job.statGain.intelligence || 0),
          endurance: state.endurance + (job.statGain.endurance || 0),
          xp: newXpVal,
          level: newLevel,
          rank: getRank(newLevel),
          meritPoints: newMeritPoints,
          totalCashEarned: state.totalCashEarned + job.salary,
          totalXpGained: state.totalXpGained + 3,
        });
      },

      applyJob: (jobId) => {
        const state = get();
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;
        if (state.level < job.levelReq) return;
        if (job.statReq.manualLabor && state.manualLabor < job.statReq.manualLabor) return;
        if (job.statReq.intelligence && state.intelligence < job.statReq.intelligence) return;
        if (job.statReq.endurance && state.endurance < job.statReq.endurance) return;

        set({ currentJob: jobId, isWorking: true });
      },

      buyItem: (itemId) => {
        const state = get();
        const item = items.find(i => i.id === itemId);
        if (!item || state.cash < item.price) return;

        const existing = state.inventory.find(i => i.itemId === itemId);
        let newInventory;
        if (existing) {
          newInventory = state.inventory.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
          newInventory = [...state.inventory, { itemId, quantity: 1 }];
        }

        set({ cash: state.cash - item.price, inventory: newInventory });
      },

      sellItem: (itemId) => {
        const state = get();
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const existing = state.inventory.find(i => i.itemId === itemId);
        if (!existing || existing.quantity <= 0) return;

        const sellPrice = Math.floor(item.price * 0.6);
        let newInventory;
        if (existing.quantity === 1) {
          newInventory = state.inventory.filter(i => i.itemId !== itemId);
        } else {
          newInventory = state.inventory.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i);
        }

        set({ cash: state.cash + sellPrice, inventory: newInventory, totalCashEarned: state.totalCashEarned + sellPrice });
      },

      useItem: (itemId) => {
        const state = get();
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const existing = state.inventory.find(i => i.itemId === itemId);
        if (!existing || existing.quantity <= 0) return;

        let newInventory;
        if (existing.quantity === 1) {
          newInventory = state.inventory.filter(i => i.itemId !== itemId);
        } else {
          newInventory = state.inventory.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i);
        }

        const updates: Partial<GameState> = { inventory: newInventory };

        switch (item.effect) {
          case 'energy': updates.energy = Math.min(state.maxEnergy, state.energy + (item.effectValue || 0)); break;
          case 'happy': updates.happy = Math.min(state.maxHappy, state.happy + (item.effectValue || 0)); break;
          case 'nerve': updates.nerve = Math.min(state.maxNerve, state.nerve + (item.effectValue || 0)); break;
          case 'heal': updates.life = Math.min(state.maxLife, state.life + (item.effectValue || 0));
            if (updates.life > 0 && state.inHospital) { updates.inHospital = false; updates.hospitalTimer = 0; }
            break;
          case 'strength_perm': updates.strength = state.strength + (item.effectValue || 0); break;
          case 'defense_perm': updates.defense = state.defense + (item.effectValue || 0); break;
          case 'speed_perm': updates.speed = state.speed + (item.effectValue || 0); break;
          case 'damage': updates.equippedWeapon = itemId; break;
        }

        if (item.category === 'Armor') {
          updates.equippedArmor = itemId;
        }

        set(updates);
      },

      depositBank: (amount) => {
        const state = get();
        if (amount > state.cash || amount <= 0) return;
        set({ cash: state.cash - amount, bank: state.bank + amount });
      },

      withdrawBank: (amount) => {
        const state = get();
        if (amount > state.bank || amount <= 0) return;
        set({ cash: state.cash + amount, bank: state.bank - amount });
      },

      investBank: (amount) => {
        const state = get();
        if (amount > state.cash || amount <= 0) return;
        set({ cash: state.cash - amount, bankInvestment: state.bankInvestment + amount, bankInvestmentTime: 30 });
      },

      buyStock: (stockId, shares) => {
        const state = get();
        const price = state.stockPrices[stockId];
        if (!price) return;
        const totalCost = price * shares;
        if (totalCost > state.cash) return;

        const existing = state.stockHoldings.find(h => h.stockId === stockId);
        let newHoldings;
        if (existing) {
          const totalShares = existing.shares + shares;
          const avgPrice = (existing.avgPrice * existing.shares + price * shares) / totalShares;
          newHoldings = state.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: totalShares, avgPrice } : h);
        } else {
          newHoldings = [...state.stockHoldings, { stockId, shares, avgPrice: price }];
        }

        set({ cash: state.cash - totalCost, stockHoldings: newHoldings });
      },

      sellStock: (stockId, shares) => {
        const state = get();
        const holding = state.stockHoldings.find(h => h.stockId === stockId);
        if (!holding || holding.shares < shares) return;
        const price = state.stockPrices[stockId];
        if (!price) return;

        const revenue = price * shares;
        let newHoldings;
        if (holding.shares === shares) {
          newHoldings = state.stockHoldings.filter(h => h.stockId !== stockId);
        } else {
          newHoldings = state.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - shares } : h);
        }

        set({ cash: state.cash + revenue, stockHoldings: newHoldings, totalCashEarned: state.totalCashEarned + revenue });
      },

      startEducation: (courseId) => {
        const state = get();
        if (state.inEducation || state.inHospital || state.inJail) return;
        const course = courses.find(c => c.id === courseId);
        if (!course || state.cash < course.cost || state.level < course.levelReq) return;

        set({
          cash: state.cash - course.cost,
          inEducation: true,
          educationCourse: courseId,
          educationTimer: course.duration,
        });
      },

      buyProperty: (propertyId) => {
        const state = get();
        const property = properties.find(p => p.id === propertyId);
        if (!property || state.cash < property.price || state.level < property.levelReq) return;

        set({
          cash: state.cash - property.price,
          currentProperty: propertyId,
          maxHappy: property.maxHappy,
          happy: Math.min(state.happy, property.maxHappy),
        });
      },

      travel: (destinationId) => {
        const state = get();
        if (state.isTraveling || state.inHospital || state.inJail || state.level < 15) return;

        set({
          isTraveling: true,
          travelDestination: destinationId,
          travelTimer: 15,
        });
      },

      gamble: (gameId, bet, choice) => {
        const state = get();
        if (state.cash < bet || state.inHospital || state.inJail) return 0;

        let winnings = 0;
        switch (gameId) {
          case 'slots': {
            const roll = Math.random();
            if (roll < 0.05) winnings = bet * 10;
            else if (roll < 0.15) winnings = bet * 3;
            else if (roll < 0.35) winnings = bet * 2;
            else if (roll < 0.5) winnings = bet;
            break;
          }
          case 'blackjack': {
            const playerScore = Math.floor(Math.random() * 11) + 10;
            const dealerScore = Math.floor(Math.random() * 11) + 10;
            if (playerScore === 21) winnings = Math.floor(bet * 2.5);
            else if (playerScore > dealerScore || dealerScore > 21) winnings = bet * 2;
            else if (playerScore === dealerScore) winnings = bet;
            break;
          }
          case 'roulette': {
            const number = Math.floor(Math.random() * 37);
            const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number);
            if (choice === 'red' && isRed) winnings = bet * 2;
            else if (choice === 'black' && !isRed && number !== 0) winnings = bet * 2;
            else if (choice === `num_${number}`) winnings = bet * 36;
            break;
          }
          case 'poker': {
            const hand = Math.random();
            if (hand < 0.01) winnings = bet * 100;
            else if (hand < 0.05) winnings = bet * 10;
            else if (hand < 0.15) winnings = bet * 3;
            else if (hand < 0.4) winnings = bet * 1.5;
            break;
          }
          case 'russian_roulette': {
            const survive = Math.random() < (5/6);
            if (survive) {
              winnings = bet * 6;
            } else {
              set({ inHospital: true, hospitalTimer: 50, life: 0 });
              return 0;
            }
            break;
          }
        }

        const netResult = winnings - bet;
        set({
          cash: state.cash - bet + winnings,
          totalCashEarned: state.totalCashEarned + Math.max(0, netResult),
        });

        return winnings;
      },

      tick: () => {
        const state = get();
        const updates: Partial<GameState> = {};

        // Regenerate resources (every tick = 3 seconds)
        // Energy: +1 per tick (roughly 1 per 3 seconds) - Torn style
        if (state.energy < state.maxEnergy) updates.energy = Math.min(state.maxEnergy, state.energy + 1);
        
        // Nerve: +1 per tick - Torn style
        if (state.nerve < state.maxNerve) updates.nerve = Math.min(state.maxNerve, state.nerve + 1);
        
        // Happy: -1 per 10 ticks (much slower decay) - Torn style
        if (state.age % 10 === 0 && state.happy > 0) {
          updates.happy = Math.max(0, state.happy - 1);
        }
        
        // Life: +10 per tick when not in hospital (fast recovery) - Torn style
        if (!state.inHospital && state.life < state.maxLife) {
          updates.life = Math.min(state.maxLife, state.life + 10);
        }

        // Hospital timer
        if (state.inHospital && state.hospitalTimer > 0) {
          updates.hospitalTimer = state.hospitalTimer - 1;
          if (state.hospitalTimer <= 1) {
            updates.inHospital = false;
            updates.life = Math.floor(state.maxLife * 0.5);
          }
        }

        // Jail timer
        if (state.inJail && state.jailTimer > 0) {
          updates.jailTimer = state.jailTimer - 1;
          if (state.jailTimer <= 1) {
            updates.inJail = false;
          }
        }

        // Travel timer
        if (state.isTraveling && state.travelTimer > 0) {
          updates.travelTimer = state.travelTimer - 1;
          if (state.travelTimer <= 1) {
            updates.isTraveling = false;
            updates.travelDestination = null;
          }
        }

        // Education timer
        if (state.inEducation && state.educationTimer > 0) {
          updates.educationTimer = state.educationTimer - 1;
          if (state.educationTimer <= 1) {
            const course = courses.find(c => c.id === state.educationCourse);
            updates.inEducation = false;
            updates.educationCourse = null;
            if (course?.statBonus && course.bonusAmount) {
              (updates as any)[course.statBonus] = (state as any)[course.statBonus] + course.bonusAmount;
            }
          }
        }

        // Bank investment
        if (state.bankInvestment > 0 && state.bankInvestmentTime > 0) {
          updates.bankInvestmentTime = state.bankInvestmentTime - 1;
          if (state.bankInvestmentTime <= 1) {
            const interest = Math.floor(state.bankInvestment * 0.15);
            updates.bank = state.bank + state.bankInvestment + interest;
            updates.bankInvestment = 0;
            updates.totalCashEarned = state.totalCashEarned + interest;
          }
        }

        // Stock price fluctuation
        const newPrices = { ...state.stockPrices };
        stocks.forEach(stock => {
          const change = (Math.random() - 0.48) * stock.volatility * newPrices[stock.id];
          newPrices[stock.id] = Math.max(1, Math.floor(newPrices[stock.id] + change));
        });
        updates.stockPrices = newPrices;

        // Age
        updates.age = state.age + 1;

        set(updates);
      },

      allocateMerit: (merit) => {
        const state = get();
        if (state.meritPoints <= 0) return;

        const newMerits = { ...state.merits };
        (newMerits as any)[merit] = ((newMerits as any)[merit] || 0) + 1;

        const updates: Partial<GameState> = {
          merits: newMerits,
          meritPoints: state.meritPoints - 1,
        };

        switch (merit) {
          case 'strength': updates.strength = state.strength + 5; break;
          case 'defense': updates.defense = state.defense + 5; break;
          case 'speed': updates.speed = state.speed + 5; break;
          case 'dexterity': updates.dexterity = state.dexterity + 5; break;
          case 'life': updates.maxLife = state.maxLife + 20; updates.life = state.life + 20; break;
          case 'energy': updates.maxEnergy = state.maxEnergy + 5; break;
          case 'nerve': updates.maxNerve = state.maxNerve + 5; break;
          case 'happy': updates.maxHappy = state.maxHappy + 10; break;
          case 'crime': updates.crimeSkill = state.crimeSkill + 1; break;
        }

        set(updates);
      },

      revivePlayer: () => {
        const state = get();
        if (state.energy < 10) return;
        set({
          energy: state.energy - 10,
          inHospital: false,
          hospitalTimer: 0,
          life: Math.floor(state.maxLife * 0.3),
        });
      },

      createFaction: (name) => {
        const state = get();
        if (state.cash < 50000 || state.factionName) return;
        set({ cash: state.cash - 50000, factionName: name, factionRank: 'Leader', factionRespect: 0 });
      },

      joinFaction: (name) => {
        const state = get();
        if (state.factionName) return;
        set({ factionName: name, factionRank: 'Member', factionRespect: 0 });
      },

      resetGame: () => {
        set({
          name: 'Player', level: 1, xp: 0, age: 0, rank: 'Absolute Beginner',
          cash: 1000, bank: 0, bankInvestment: 0, bankInvestmentTime: 0, points: 0,
          energy: 10, maxEnergy: 10, nerve: 10, maxNerve: 10, happy: 10, maxHappy: 10,
          life: 100, maxLife: 100,
          strength: 5, speed: 5, defense: 5, dexterity: 5,
          manualLabor: 0, intelligence: 0, endurance: 0,
          crimeExp: 0, crimeSkill: 1,
          inHospital: false, hospitalTimer: 0, inJail: false, jailTimer: 0,
          isTraveling: false, travelDestination: null, travelTimer: 0,
          inEducation: false, educationCourse: null, educationTimer: 0,
          isWorking: false, currentJob: null,
          equippedWeapon: 'fists', equippedArmor: null,
          inventory: [], stockHoldings: [],
          currentProperty: null, factionName: null, factionRank: null, factionRespect: 0,
          combatLogs: [], crimeLogs: [],
          totalAttacks: 0, totalCrimes: 0, totalMugs: 0, totalHospitalized: 0,
          totalXpGained: 0, totalCashEarned: 0,
          merits: { strength: 0, defense: 0, speed: 0, dexterity: 0, life: 0, crime: 0, energy: 0, nerve: 0, happy: 0 },
          meritPoints: 0,
        });
      },
    }),
    {
      name: 'torn-city-save',
    }
  )
);
