import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './store';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, awards, companies, collections } from './data2';

export interface FactionTerritory {
  territoryId: string;
  controlled: boolean;
  respect: number;
  racketLevel: number;
}

export interface ExtendedGameState {
  // Faction Warfare
  factionTerritories: FactionTerritory[];
  chainCount: number;
  chainTimer: number;
  factionWars: number;
  raidsWon: number;
  dirtyBombsUsed: number;

  // Racing
  racingLicense: boolean;
  racingCar: string | null;
  racingSkill: number;
  ownedCars: string[];
  racingActive: boolean;

  // Hunting
  huntingSkill: number;
  totalHunts: number;

  // Company
  companyOwned: boolean;
  companyName: string;
  companyType: string;
  companyStars: number;
  companyEmployees: number;
  companyProfit: number;

  // Collections
  collections: string[];

  // Marriage
  marriedTo: string | null;
  marriageDays: number;

  // Awards
  awards: string[];

  // Loan
  loanAmount: number;

  // Missions
  activeMission: string | null;
  completedMissions: string[];
  missionCredits: number;

  // Hacking
  hackingSkill: number;
  createdViruses: string[];

  // Bounty
  activeBounties: string[];
  bountiesCollected: number;

  // Actions
  tick: () => void;
  startOC: (ocId: string) => void;
  claimTerritory: (territoryId: string) => void;
  addToChain: () => void;
  startRankedWar: () => void;
  startRaid: () => void;
  useDirtyBomb: () => void;
  buyCar: (carId: string) => void;
  startRace: (trackId: string) => void;
  hunt: (animalId: string) => void;
  startCompany: (name: string, type: string) => void;
  takeLoan: (amount: number, max: number) => void;
  repayLoan: (amount: number) => void;
  proposeMarriage: (candidateId: string) => void;
  createVirus: (virusId: string) => void;
  acceptBounty: (bountyId: string) => void;
  startMission: (missionId: string) => void;
}

export const useExtendedStore = create<ExtendedGameState>()(
  persist(
    (set, get) => ({
      factionTerritories: [],
      chainCount: 0,
      chainTimer: 0,
      factionWars: 0,
      raidsWon: 0,
      dirtyBombsUsed: 0,

      racingLicense: false,
      racingCar: null,
      racingSkill: 0,
      ownedCars: [],
      racingActive: false,

      huntingSkill: 0,
      totalHunts: 0,

      companyOwned: false,
      companyName: '',
      companyType: '',
      companyStars: 1,
      companyEmployees: 0,
      companyProfit: 0,

      collections: [],
      marriedTo: null,
      marriageDays: 0,
      awards: [],
      loanAmount: 0,

      activeMission: null,
      completedMissions: [],
      missionCredits: 0,

      hackingSkill: 0,
      createdViruses: [],

      activeBounties: [],
      bountiesCollected: 0,

      tick: () => {
        const state = get();
        const updates: Partial<ExtendedGameState> = {};

        // Chain timer
        if (state.chainTimer > 0) {
          updates.chainTimer = state.chainTimer - 1;
          if (state.chainTimer <= 1) {
            updates.chainCount = 0;
          }
        }

        // Racing
        if (state.racingActive) {
          updates.racingActive = false;
          updates.racingSkill = state.racingSkill + 1;
        }

        // Marriage days
        if (state.marriedTo) {
          updates.marriageDays = state.marriageDays + 1;
        }

        set(updates);
      },

      startOC: (ocId) => {
        const state = get();
        const gameState = useGameStore.getState();
        const oc = organizedCrimes.find(o => o.id === ocId);
        if (!oc || !gameState.factionName) return;
        if (gameState.nerve < oc.nerveCost) return;

        const success = Math.random() > 0.3;
        if (success) {
          const reward = Math.floor(Math.random() * (oc.maxReward - oc.minReward) + oc.minReward);
          useGameStore.setState({
            nerve: gameState.nerve - oc.nerveCost,
            cash: gameState.cash + reward,
            factionRespect: gameState.factionRespect + oc.respect,
            totalCashEarned: gameState.totalCashEarned + reward,
          });
        } else {
          useGameStore.setState({
            nerve: gameState.nerve - oc.nerveCost,
          });
        }
      },

      claimTerritory: (territoryId) => {
        const state = get();
        const existing = state.factionTerritories.find(t => t.territoryId === territoryId);
        if (existing) return;

        const success = Math.random() > 0.4;
        if (success) {
          set({
            factionTerritories: [...state.factionTerritories, {
              territoryId,
              controlled: true,
              respect: 10,
              racketLevel: 1
            }]
          });
        }
      },

      addToChain: () => {
        const state = get();
        set({
          chainCount: state.chainCount + 1,
          chainTimer: 15
        });
      },

      startRankedWar: () => {
        const state = get();
        set({ factionWars: state.factionWars + 1 });
      },

      startRaid: () => {
        const state = get();
        const success = Math.random() > 0.4;
        if (success) {
          set({ raidsWon: state.raidsWon + 1 });
        }
      },

      useDirtyBomb: () => {
        const state = get();
        set({ dirtyBombsUsed: state.dirtyBombsUsed + 1 });
      },

      buyCar: (carId) => {
        const state = get();
        const gameState = useGameStore.getState();
        const car = cars.find(c => c.id === carId);
        if (!car || gameState.cash < car.price) return;
        
        if (!state.ownedCars.includes(carId)) {
          useGameStore.setState({ cash: gameState.cash - car.price });
          set({
            ownedCars: [...state.ownedCars, carId],
            racingCar: carId
          });
        }
      },

      startRace: (trackId) => {
        const state = get();
        if (!state.racingCar) return;
        set({ racingActive: true });
      },

      hunt: (animalId) => {
        const state = get();
        const gameState = useGameStore.getState();
        const animal = huntAnimals.find(a => a.id === animalId);
        if (!animal || gameState.energy < animal.energyCost) return;

        const success = Math.random() * 100 < (80 - animal.difficulty * 0.5);
        if (success) {
          const reward = Math.floor(Math.random() * (animal.maxReward - animal.minReward) + animal.minReward);
          useGameStore.setState({
            energy: gameState.energy - animal.energyCost,
            cash: gameState.cash + reward,
            totalCashEarned: gameState.totalCashEarned + reward,
          });
        } else {
          useGameStore.setState({
            energy: gameState.energy - animal.energyCost,
          });
        }

        set({
          huntingSkill: state.huntingSkill + 1,
          totalHunts: state.totalHunts + 1
        });
      },

      startCompany: (name, type) => {
        const gameState = useGameStore.getState();
        if (gameState.cash < 500000) return;
        
        useGameStore.setState({ cash: gameState.cash - 500000 });
        set({
          companyOwned: true,
          companyName: name,
          companyType: type,
          companyStars: 1,
          companyEmployees: 0,
          companyProfit: 0
        });
      },

      takeLoan: (amount, max) => {
        const state = get();
        const gameState = useGameStore.getState();
        if (amount > max || amount <= 0) return;
        
        useGameStore.setState({ cash: gameState.cash + amount });
        set({ loanAmount: state.loanAmount + amount });
      },

      repayLoan: (amount) => {
        const state = get();
        const gameState = useGameStore.getState();
        if (amount > state.loanAmount || amount > gameState.cash || amount <= 0) return;
        
        useGameStore.setState({ cash: gameState.cash - amount });
        set({ loanAmount: state.loanAmount - amount });
      },

      proposeMarriage: (candidateId) => {
        const success = Math.random() > 0.5;
        if (success) {
          set({ marriedTo: candidateId, marriageDays: 0 });
        }
      },

      createVirus: (virusId) => {
        const state = get();
        set({
          createdViruses: [...state.createdViruses, virusId],
          hackingSkill: state.hackingSkill + 1
        });
      },

      acceptBounty: (bountyId) => {
        const state = get();
        set({
          activeBounties: [...state.activeBounties, bountyId]
        });
      },

      startMission: (missionId) => {
        set({
          activeMission: missionId
        });
      },
    }),
    {
      name: 'torn-city-extended-save',
    }
  )
);
