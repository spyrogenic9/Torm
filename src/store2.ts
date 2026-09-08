import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, missions, awards, companies, bounties, collections, viruses, marriageCandidates, newsTemplates } from './data2';

// ============ TYPES ============
export interface FactionTerritory {
  territoryId: string;
  controlled: boolean;
  respect: number;
  racketLevel: number;
}

export interface ChainData {
  active: boolean;
  hits: number;
  timer: number;
  cooldown: number;
  best: number;
}

export interface RacingState {
  racingSkill: number;
  ownedCars: string[];
  currentCar: string | null;
  racesWon: number;
  racesTotal: number;
}

export interface HuntingState {
  huntingSkill: number;
  totalHunts: number;
  animalsKilled: Record<string, number>;
}

export interface MissionState {
  activeMission: string | null;
  completedMissions: string[];
  credits: number;
}

export interface CompanyState {
  ownedCompany: string | null;
  companyLevel: number;
  companyStars: number;
  employees: number;
  companyProfit: number;
}

export interface CollectionState {
  collected: Record<string, string[]>;
  completedCollections: string[];
}

export interface MarriageState {
  married: boolean;
  spouse: string | null;
  marriageDays: number;
}

export interface VirusState {
  hackingSkill: number;
  createdViruses: string[];
  virusesSold: number;
}

export interface AuctionListing {
  id: string;
  itemId: string;
  itemName: string;
  seller: string;
  currentBid: number;
  buyNow: number;
  timeLeft: number;
}

export interface BazaarListing {
  id: string;
  seller: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
}

export interface ExtendedGameState {
  // Faction Warfare
  factionTerritories: FactionTerritory[];
  chain: ChainData;
  factionWars: number;
  raidsWon: number;
  dirtyBombsUsed: number;

  // Racing
  racing: RacingState;

  // Hunting
  hunting: HuntingState;

  // Missions
  missionState: MissionState;

  // Awards
  earnedAwards: string[];

  // Company
  companyState: CompanyState;

  // Bounties
  bountiesCompleted: number;
  activeBounty: string | null;

  // Collections
  collectionState: CollectionState;

  // Marriage
  marriageState: MarriageState;

  // Virus/Hacking
  virusState: VirusState;

  // Bazaar/Auction
  auctionListings: AuctionListing[];
  bazaarListings: BazaarListing[];

  // News
  newsEvents: { id: string; title: string; content: string; category: string; day: number }[];

  // Loan Shark
  loanAmount: number;
  loanInterest: number;
  loanDueDay: number;

  // Actions
  startOrganizedCrime: (ocId: string) => void;
  claimTerritory: (territoryId: string) => void;
  attackTerritory: (territoryId: string) => void;
  advanceChain: () => void;
  startRace: (trackId: string) => void;
  buyCar: (carId: string) => void;
  goHunting: (animalId: string) => void;
  startMission: (missionId: string) => void;
  completeMission: () => void;
  buyCompany: (companyId: string) => void;
  workCompany: () => void;
  takeBounty: (bountyId: string) => void;
  huntBounty: () => void;
  collectItem: (collectionId: string, itemId: string) => void;
  proposeMarriage: (candidateId: string) => void;
  createVirus: (virusId: string) => void;
  useVirus: (virusId: string) => void;
  takeLoan: (amount: number) => void;
  repayLoan: () => void;
  createBazaarListing: (itemId: string, price: number, qty: number) => void;
  bidAuction: (listingId: string, amount: number) => void;
  tickExtended: () => void;
}

export const useExtendedStore = create<ExtendedGameState>()(
  persist(
    (set, get) => ({
      // Initial State
      factionTerritories: [],
      chain: { active: false, hits: 0, timer: 0, cooldown: 0, best: 0 },
      factionWars: 0,
      raidsWon: 0,
      dirtyBombsUsed: 0,

      racing: { racingSkill: 0, ownedCars: ['beatup'], currentCar: 'beatup', racesWon: 0, racesTotal: 0 },
      hunting: { huntingSkill: 0, totalHunts: 0, animalsKilled: {} },
      missionState: { activeMission: null, completedMissions: [], credits: 0 },
      earnedAwards: [],
      companyState: { ownedCompany: null, companyLevel: 1, companyStars: 1, employees: 0, companyProfit: 0 },
      bountiesCompleted: 0,
      activeBounty: null,
      collectionState: { collected: {}, completedCollections: [] },
      marriageState: { married: false, spouse: null, marriageDays: 0 },
      virusState: { hackingSkill: 0, createdViruses: [], virusesSold: 0 },
      auctionListings: [],
      bazaarListings: [],
      newsEvents: [],
      loanAmount: 0,
      loanInterest: 0,
      loanDueDay: 0,

      // Actions
      startOrganizedCrime: (ocId) => {
        const state = get();
        const oc = organizedCrimes.find(o => o.id === ocId);
        if (!oc) return;

        // Simulate OC success based on faction respect and crime skill
        const successChance = Math.min(90, 40 + state.chain.hits * 0.5 + Math.random() * 30);
        const success = Math.random() * 100 < successChance;

        if (success) {
          const reward = Math.floor(Math.random() * (oc.maxReward - oc.minReward) + oc.minReward);
          set({
            factionTerritories: state.factionTerritories.map(t => ({
              ...t,
              respect: t.controlled ? t.respect + oc.respectReward : t.respect,
            })),
            chain: { ...state.chain, hits: state.chain.hits + oc.members },
          });
        }
      },

      claimTerritory: (territoryId) => {
        const state = get();
        if (state.factionTerritories.find(t => t.territoryId === territoryId)) return;

        const territory = territories.find(t => t.id === territoryId);
        if (!territory) return;

        set({
          factionTerritories: [...state.factionTerritories, {
            territoryId,
            controlled: true,
            respect: 0,
            racketLevel: 1,
          }],
        });
      },

      attackTerritory: (territoryId) => {
        const state = get();
        const territory = state.factionTerritories.find(t => t.territoryId === territoryId);
        if (!territory || !territory.controlled) return;

        // Simulate territory defense
        const defenseSuccess = Math.random() < 0.7;
        if (defenseSuccess) {
          set({
            factionTerritories: state.factionTerritories.map(t =>
              t.territoryId === territoryId ? { ...t, respect: t.respect + 2 } : t
            ),
          });
        }
      },

      advanceChain: () => {
        const state = get();
        if (state.chain.cooldown > 0) return;

        const newHits = state.chain.hits + 1;
        set({
          chain: {
            ...state.chain,
            active: true,
            hits: newHits,
            timer: 30,
            best: Math.max(state.chain.best, newHits),
          },
        });
      },

      startRace: (trackId) => {
        const state = get();
        const track = raceTracks.find(t => t.id === trackId);
        if (!track || !state.racing.currentCar) return;

        const car = cars.find(c => c.id === state.racing.currentCar);
        if (!car) return;

        // Simulate race
        const playerScore = (car.speed + car.acceleration + car.handling) / 3 + state.racing.racingSkill * 2;
        const opponentScore = 50 + track.difficulty * 15 + Math.random() * 30;
        const won = playerScore > opponentScore;

        const reward = won ? track.difficulty * 500 : 0;
        const skillGain = won ? 1 : 0.5;

        set({
          racing: {
            ...state.racing,
            racingSkill: Math.min(100, state.racing.racingSkill + skillGain),
            racesWon: state.racing.racesWon + (won ? 1 : 0),
            racesTotal: state.racing.racesTotal + 1,
          },
        });
      },

      buyCar: (carId) => {
        const state = get();
        const car = cars.find(c => c.id === carId);
        if (!car || state.racing.ownedCars.includes(carId)) return;

        set({
          racing: {
            ...state.racing,
            ownedCars: [...state.racing.ownedCars, carId],
            currentCar: carId,
          },
        });
      },

      goHunting: (animalId) => {
        const state = get();
        const animal = huntAnimals.find(a => a.id === animalId);
        if (!animal) return;

        const successChance = Math.min(90, 50 + state.hunting.huntingSkill * 2 - animal.difficulty);
        const success = Math.random() * 100 < successChance;

        if (success) {
          const reward = Math.floor(Math.random() * (animal.maxReward - animal.minReward) + animal.minReward);
          const newKilled = { ...state.hunting.animalsKilled };
          newKilled[animalId] = (newKilled[animalId] || 0) + 1;

          set({
            hunting: {
              ...state.hunting,
              huntingSkill: Math.min(100, state.hunting.huntingSkill + animal.expReward * 0.1),
              totalHunts: state.hunting.totalHunts + 1,
              animalsKilled: newKilled,
            },
          });
        } else {
          set({
            hunting: {
              ...state.hunting,
              totalHunts: state.hunting.totalHunts + 1,
            },
          });
        }
      },

      startMission: (missionId) => {
        const state = get();
        if (state.missionState.activeMission) return;
        set({
          missionState: {
            ...state.missionState,
            activeMission: missionId,
          },
        });
      },

      completeMission: () => {
        const state = get();
        if (!state.missionState.activeMission) return;

        const mission = missions.find(m => m.id === state.missionState.activeMission);
        if (!mission) return;

        set({
          missionState: {
            activeMission: null,
            completedMissions: [...state.missionState.completedMissions, mission.id],
            credits: state.missionState.credits + 1,
          },
        });
      },

      buyCompany: (companyId) => {
        const state = get();
        const company = companies.find(c => c.id === companyId);
        if (!company || state.companyState.ownedCompany) return;

        set({
          companyState: {
            ownedCompany: companyId,
            companyLevel: 1,
            companyStars: 1,
            employees: 0,
            companyProfit: 0,
          },
        });
      },

      workCompany: () => {
        const state = get();
        if (!state.companyState.ownedCompany) return;

        const profit = state.companyState.companyLevel * 500 + state.companyState.employees * 200;
        set({
          companyState: {
            ...state.companyState,
            companyProfit: state.companyState.companyProfit + profit,
          },
        });
      },

      takeBounty: (bountyId) => {
        set({ activeBounty: bountyId });
      },

      huntBounty: () => {
        const state = get();
        if (!state.activeBounty) return;

        const bounty = bounties.find(b => b.id === state.activeBounty);
        if (!bounty) return;

        const success = Math.random() < 0.6;
        if (success) {
          set({ bountiesCompleted: state.bountiesCompleted + 1, activeBounty: null });
        }
      },

      collectItem: (collectionId, itemId) => {
        const state = get();
        const collection = collections.find(c => c.id === collectionId);
        if (!collection) return;

        const current = state.collectionState.collected[collectionId] || [];
        if (current.includes(itemId)) return;

        const newCollected = { ...state.collectionState.collected };
        newCollected[collectionId] = [...current, itemId];

        const completed = collection.items.every(item => newCollected[collectionId].includes(item));
        const newCompleted = completed
          ? [...state.collectionState.completedCollections, collectionId]
          : state.collectionState.completedCollections;

        set({
          collectionState: {
            collected: newCollected,
            completedCollections: newCompleted,
          },
        });
      },

      proposeMarriage: (candidateId) => {
        const state = get();
        if (state.marriageState.married) return;

        const candidate = marriageCandidates.find(c => c.id === candidateId);
        if (!candidate) return;

        const accepted = Math.random() < 0.7;
        if (accepted) {
          set({
            marriageState: {
              married: true,
              spouse: candidate.name,
              marriageDays: 0,
            },
          });
        }
      },

      createVirus: (virusId) => {
        const state = get();
        const virus = viruses.find(v => v.id === virusId);
        if (!virus || state.virusState.createdViruses.includes(virusId)) return;

        set({
          virusState: {
            ...state.virusState,
            hackingSkill: state.virusState.hackingSkill + virus.power * 0.5,
            createdViruses: [...state.virusState.createdViruses, virusId],
          },
        });
      },

      useVirus: (virusId) => {
        const state = get();
        if (!state.virusState.createdViruses.includes(virusId)) return;

        set({
          virusState: {
            ...state.virusState,
            virusesSold: state.virusState.virusesSold + 1,
          },
        });
      },

      takeLoan: (amount) => {
        const state = get();
        if (state.loanAmount > 0) return;

        set({
          loanAmount: amount,
          loanInterest: Math.floor(amount * 0.2),
          loanDueDay: 30,
        });
      },

      repayLoan: () => {
        const state = get();
        const total = state.loanAmount + state.loanInterest;
        set({
          loanAmount: 0,
          loanInterest: 0,
          loanDueDay: 0,
        });
      },

      createBazaarListing: (itemId, price, qty) => {
        const state = get();
        const listing: BazaarListing = {
          id: Date.now().toString(),
          seller: 'You',
          itemId,
          itemName: itemId,
          price,
          quantity: qty,
        };
        set({ bazaarListings: [...state.bazaarListings, listing] });
      },

      bidAuction: (listingId, amount) => {
        const state = get();
        set({
          auctionListings: state.auctionListings.map(l =>
            l.id === listingId ? { ...l, currentBid: amount } : l
          ),
        });
      },

      tickExtended: () => {
        const state = get();
        const updates: Partial<ExtendedGameState> = {};

        // Chain timer
        if (state.chain.active && state.chain.timer > 0) {
          const newTimer = state.chain.timer - 1;
          if (newTimer <= 0) {
            updates.chain = { ...state.chain, active: false, timer: 0, cooldown: 60 };
          } else {
            updates.chain = { ...state.chain, timer: newTimer };
          }
        }

        // Chain cooldown
        if (state.chain.cooldown > 0) {
          updates.chain = { ...(updates.chain || state.chain), cooldown: state.chain.cooldown - 1 };
        }

        // Territory daily respect
        updates.factionTerritories = state.factionTerritories.map(t => ({
          ...t,
          respect: t.controlled ? t.respect + 1 : t.respect,
        }));

        // Marriage days
        if (state.marriageState.married) {
          updates.marriageState = {
            ...state.marriageState,
            marriageDays: state.marriageState.marriageDays + 1,
          };
        }

        // Loan due
        if (state.loanAmount > 0 && state.loanDueDay > 0) {
          updates.loanDueDay = state.loanDueDay - 1;
        }

        // Company profit
        if (state.companyState.ownedCompany) {
          updates.companyState = {
            ...state.companyState,
            companyProfit: state.companyState.companyProfit + state.companyState.companyLevel * 100,
          };
        }

        // Generate news events occasionally
        if (Math.random() < 0.05) {
          const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
          updates.newsEvents = [
            { id: Date.now().toString(), ...template, day: 0 },
            ...state.newsEvents,
          ].slice(0, 20);
        }

        // Generate bazaar listings
        if (state.bazaarListings.length < 10 && Math.random() < 0.1) {
          const randomItems = ['baseball_bat', 'knife', 'pistol', 'bandage', 'xanax', 'candy_bar'];
          const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
          const sellers = ['TraderJoe', 'BlackMarket', 'QuickSell', 'DealMaster', 'BargainHunter'];
          const listing: BazaarListing = {
            id: Date.now().toString() + Math.random(),
            seller: sellers[Math.floor(Math.random() * sellers.length)],
            itemId: randomItem,
            itemName: randomItem,
            price: Math.floor(Math.random() * 2000 + 100),
            quantity: Math.floor(Math.random() * 5 + 1),
          };
          updates.bazaarListings = [...state.bazaarListings, listing];
        }

        // Generate auction listings
        if (state.auctionListings.length < 5 && Math.random() < 0.05) {
          const randomItems = ['shotgun', 'rifle', 'kevlar', 'body_armor', 'sniper'];
          const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
          const sellers = ['AuctionKing', 'RareDealer', 'EliteSeller', 'TopBidder'];
          const listing: AuctionListing = {
            id: Date.now().toString() + Math.random(),
            itemId: randomItem,
            itemName: randomItem,
            seller: sellers[Math.floor(Math.random() * sellers.length)],
            currentBid: Math.floor(Math.random() * 5000 + 1000),
            buyNow: Math.floor(Math.random() * 10000 + 5000),
            timeLeft: Math.floor(Math.random() * 50 + 10),
          };
          updates.auctionListings = [...state.auctionListings, listing];
        }

        // Decrease auction timers
        updates.auctionListings = state.auctionListings
          .map(l => ({ ...l, timeLeft: l.timeLeft - 1 }))
          .filter(l => l.timeLeft > 0);

        set(updates);
      },
    }),
    {
      name: 'torn-city-extended',
    }
  )
);
