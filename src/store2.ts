import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, awards, companies, collections } from './data2';

export interface FactionTerritory {
  territoryId: string;
  controlled: boolean;
  respect: number;
  racketLevel: number;
}

interface ExtendedGameState {
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

        // Company profit
        if (state.companyOwned) {
          updates.companyProfit = state.companyProfit + state.companyStars * 100;
        }

        // Loan interest
        if (state.loanAmount > 0) {
          updates.loanAmount = Math.floor(state.loanAmount * 1.002);
        }

        // Check for new awards
        const newAwards = [...state.awards];
        // Award checks would go here based on game state

        set(updates);
      },

      startOC: (ocId) => {
        const state = get();
        const oc = organizedCrimes.find(o => o.id === ocId);
        if (!oc) return;
        // Simplified: instant success with rewards
        const reward = Math.floor(Math.random() * (oc.maxReward - oc.minReward) + oc.minReward);
        // In real game, this would require faction members and planning
        set({
          factionTerritories: state.factionTerritories.map(t => ({
            ...t,
            respect: t.respect + (oc.respect || 5)
          }))
        });
      },

      claimTerritory: (territoryId) => {
        const state = get();
        const existing = state.factionTerritories.find(t => t.territoryId === territoryId);
        if (existing) {
          set({
            factionTerritories: state.factionTerritories.map(t =>
              t.territoryId === territoryId ? { ...t, controlled: true } : t
            )
          });
        } else {
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
          chainTimer: 15 // 5 minute timer in ticks
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
        const car = cars.find(c => c.id === carId);
        if (!car) return;
        // Need to import useGameStore for cash check - simplified
        if (!state.ownedCars.includes(carId)) {
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
        // Race resolves in next tick
      },

      hunt: (animalId) => {
        const state = get();
        const animal = huntAnimals.find(a => a.id === animalId);
        if (!animal) return;
        set({
          huntingSkill: state.huntingSkill + 1,
          totalHunts: state.totalHunts + 1
        });
      },

      startCompany: (name, type) => {
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
        if (amount > max || amount <= 0) return;
        set({ loanAmount: state.loanAmount + amount });
      },

      repayLoan: (amount) => {
        const state = get();
        if (amount > state.loanAmount || amount <= 0) return;
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
        set({ activeMission: missionId });
      },
    }),
    { name: 'torn-extended-save' }
  )
);
