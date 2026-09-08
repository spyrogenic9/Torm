import { useState, useEffect } from 'react';
import { useGameStore } from './store';
import { useExtendedStore } from './store2';
import { crimes, gyms, courses, jobs, items, npcEnemies, stocks, properties, cityAreas, destinations, casinoGames } from './data';
import {
  FactionWarfarePage, OrganizedCrimePage, RacingPage, HuntingPage,
  MissionsPage, AwardsPage, CompanyPage, BountyPage, CollectionsPage,
  MarriagePage, HackingPage, BazaarPage, LoanSharkPage, NewspaperPage
} from './pages';

type Page = 'overview' | 'city' | 'gym' | 'combat' | 'crime' | 'inventory' | 'market' | 'education' | 'job' | 'faction' | 'faction_war' | 'oc' | 'travel' | 'racing' | 'hunting' | 'missions' | 'bounty' | 'casino' | 'bank' | 'stocks' | 'property' | 'company' | 'bazaar' | 'merits' | 'awards' | 'collections' | 'marriage' | 'hacking' | 'loan' | 'newspaper' | 'hospital' | 'profile';

function App() {
  const [page, setPage] = useState<Page>('overview');
  const [showNameModal, setShowNameModal] = useState(false);
  const store = useGameStore();

  const ext = useExtendedStore();

  // Game tick every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      store.tick();
      ext.tickExtended();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (store.name === 'Player') setShowNameModal(true);
  }, []);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'city', label: 'City', icon: '🏙️' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'crime', label: 'Crime', icon: '🔫' },
    { id: 'oc', label: 'Org. Crime', icon: '🕵️' },
    { id: 'inventory', label: 'Inventory', icon: '🎒' },
    { id: 'market', label: 'Market', icon: '🏪' },
    { id: 'bazaar', label: 'Bazaar', icon: '🏬' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'job', label: 'Jobs', icon: '💼' },
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'faction', label: 'Faction', icon: '🏴' },
    { id: 'faction_war', label: 'Warfare', icon: '💥' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'racing', label: 'Racing', icon: '🏎️' },
    { id: 'hunting', label: 'Hunting', icon: '🦁' },
    { id: 'missions', label: 'Missions', icon: '📋' },
    { id: 'bounty', label: 'Bounty', icon: '🎯' },
    { id: 'casino', label: 'Casino', icon: '🎰' },
    { id: 'bank', label: 'Bank', icon: '🏦' },
    { id: 'loan', label: 'Loan', icon: '🦈' },
    { id: 'stocks', label: 'Stocks', icon: '📈' },
    { id: 'property', label: 'Property', icon: '🏠' },
    { id: 'merits', label: 'Merits', icon: '⭐' },
    { id: 'awards', label: 'Awards', icon: '🏆' },
    { id: 'collections', label: 'Museum', icon: '🏛️' },
    { id: 'marriage', label: 'Marriage', icon: '💍' },
    { id: 'hacking', label: 'Hacking', icon: '💻' },
    { id: 'newspaper', label: 'News', icon: '📰' },
    { id: 'hospital', label: 'Hospital', icon: '🏥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const isDisabled = store.inHospital || store.inJail || store.isTraveling;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Name Modal */}
      {showNameModal && (
        <NameModal onClose={() => setShowNameModal(false)} />
      )}

      {/* Status Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-400">🌃 TORN CITY</span>
            <span className="text-sm text-gray-400 hidden sm:inline">| {store.name}</span>
            <span className="text-sm text-gray-400 hidden sm:inline">| Lvl {store.level}</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm flex-wrap">
            <ResourceBar label="HP" value={store.life} max={store.maxLife} color="bg-red-500" />
            <ResourceBar label="EN" value={store.energy} max={store.maxEnergy} color="bg-green-500" />
            <ResourceBar label="NV" value={store.nerve} max={store.maxNerve} color="bg-orange-500" />
            <ResourceBar label="HP" value={store.happy} max={store.maxHappy} color="bg-pink-500" />
            <span className="text-green-400 font-mono">${store.cash.toLocaleString()}</span>
          </div>
        </div>
        {/* Status indicators */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-1 text-xs">
          {store.inHospital && <span className="bg-red-900 text-red-300 px-2 py-0.5 rounded">🏥 Hospital ({store.hospitalTimer})</span>}
          {store.inJail && <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">🔒 Jail ({store.jailTimer})</span>}
          {store.isTraveling && <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded">✈️ Traveling ({store.travelTimer})</span>}
          {store.inEducation && <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded">📚 Studying ({store.educationTimer})</span>}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto hidden md:block">
          <div className="p-2 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                  page === item.id ? 'bg-amber-600 text-white' : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex overflow-x-auto p-1 gap-1 scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex-shrink-0 px-2 py-1.5 rounded text-xs flex flex-col items-center gap-0.5 ${
                  page === item.id ? 'bg-amber-600 text-white' : 'text-gray-400'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-[10px] whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="max-w-5xl mx-auto">
            {page === 'overview' && <OverviewPage />}
            {page === 'city' && <CityPage />}
            {page === 'gym' && <GymPage />}
            {page === 'combat' && <CombatPage />}
            {page === 'crime' && <CrimePage />}
            {page === 'oc' && <OrganizedCrimePage />}
            {page === 'inventory' && <InventoryPage />}
            {page === 'market' && <MarketPage />}
            {page === 'bazaar' && <BazaarPage />}
            {page === 'education' && <EducationPage />}
            {page === 'job' && <JobPage />}
            {page === 'company' && <CompanyPage />}
            {page === 'faction' && <FactionPage />}
            {page === 'faction_war' && <FactionWarfarePage />}
            {page === 'travel' && <TravelPage />}
            {page === 'racing' && <RacingPage />}
            {page === 'hunting' && <HuntingPage />}
            {page === 'missions' && <MissionsPage />}
            {page === 'bounty' && <BountyPage />}
            {page === 'casino' && <CasinoPage />}
            {page === 'bank' && <BankPage />}
            {page === 'loan' && <LoanSharkPage />}
            {page === 'stocks' && <StocksPage />}
            {page === 'property' && <PropertyPage />}
            {page === 'merits' && <MeritsPage />}
            {page === 'awards' && <AwardsPage />}
            {page === 'collections' && <CollectionsPage />}
            {page === 'marriage' && <MarriagePage />}
            {page === 'hacking' && <HackingPage />}
            {page === 'newspaper' && <NewspaperPage />}
            {page === 'hospital' && <HospitalPage />}
            {page === 'profile' && <ProfilePage />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============ COMPONENTS ============

function ResourceBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <div className="w-16 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-300 font-mono w-12">{value}/{max}</span>
    </div>
  );
}

function NameModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const store = useGameStore();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 p-8 rounded-xl border border-amber-600 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">🌃 Welcome to Torn City</h2>
        <p className="text-gray-300 mb-6">Enter your character name to begin your journey in the criminal underworld.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:border-amber-500"
          maxLength={20}
        />
        <button
          onClick={() => { if (name.trim()) { store.setName(name.trim()); onClose(); } }}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors"
        >
          Enter Torn City
        </button>
      </div>
    </div>
  );
}

// ============ PAGES ============

function OverviewPage() {
  const store = useGameStore();
  const xpNeeded = Math.floor(100 * Math.pow(1.5, store.level - 1));
  const xpPct = (store.xp / xpNeeded) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-amber-400 mb-4">📊 Character Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Level" value={store.level} icon="🎯" />
          <StatBox label="Rank" value={store.rank} icon="🏆" />
          <StatBox label="Age" value={`${store.age} days`} icon="📅" />
          <StatBox label="Cash" value={`$${store.cash.toLocaleString()}`} icon="💰" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>XP Progress</span>
            <span>{store.xp} / {xpNeeded}</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-amber-400 mb-3">⚔️ Battle Stats</h3>
          <div className="space-y-2">
            <StatBar label="Strength" value={store.strength} color="bg-red-500" />
            <StatBar label="Speed" value={store.speed} color="bg-blue-500" />
            <StatBar label="Defense" value={store.defense} color="bg-green-500" />
            <StatBar label="Dexterity" value={store.dexterity} color="bg-yellow-500" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <span className="text-sm text-gray-400">Total Battle Power: </span>
            <span className="text-amber-400 font-bold">{(store.strength + store.speed + store.defense + store.dexterity).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-amber-400 mb-3">💼 Working Stats</h3>
          <div className="space-y-2">
            <StatBar label="Manual Labor" value={store.manualLabor} color="bg-orange-500" />
            <StatBar label="Intelligence" value={store.intelligence} color="bg-cyan-500" />
            <StatBar label="Endurance" value={store.endurance} color="bg-emerald-500" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <span className="text-sm text-gray-400">Crime Skill: </span>
            <span className="text-amber-400 font-bold">{store.crimeSkill.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-amber-400 mb-3">📈 Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-gray-400">Total Attacks:</span> <span className="text-white">{store.totalAttacks}</span></div>
          <div><span className="text-gray-400">Total Crimes:</span> <span className="text-white">{store.totalCrimes}</span></div>
          <div><span className="text-gray-400">Mugs:</span> <span className="text-white">{store.totalMugs}</span></div>
          <div><span className="text-gray-400">Hospitalized:</span> <span className="text-white">{store.totalHospitalized}</span></div>
          <div><span className="text-gray-400">Total XP:</span> <span className="text-white">{store.totalXpGained}</span></div>
          <div><span className="text-gray-400">Total Earned:</span> <span className="text-white">${store.totalCashEarned.toLocaleString()}</span></div>
          <div><span className="text-gray-400">Bank:</span> <span className="text-white">${store.bank.toLocaleString()}</span></div>
          <div><span className="text-gray-400">Merit Points:</span> <span className="text-white">{store.meritPoints}</span></div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxDisplay = Math.max(value, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 w-24">{label}</span>
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(100, (value / maxDisplay) * 100)}%` }} />
      </div>
      <span className="text-sm text-white font-mono w-16 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

function CityPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏙️ Torn City</h2>
      <p className="text-gray-400">Navigate through the districts of Torn City.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cityAreas.map(area => (
          <div key={area.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-amber-400 mb-2">{area.name}</h3>
            <p className="text-xs text-gray-500 mb-2">District: {area.district}</p>
            <div className="space-y-1">
              {area.locations.map(loc => (
                <div key={loc} className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  {loc}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GymPage() {
  const store = useGameStore();
  const [selectedStat, setSelectedStat] = useState<'strength' | 'speed' | 'defense' | 'dexterity'>('strength');
  const [trainResult, setTrainResult] = useState('');

  const handleTrain = (gymId: string) => {
    if (store.energy < 5) {
      setTrainResult('Not enough energy!');
      return;
    }
    const oldStat = store[selectedStat];
    store.trainStat(selectedStat, gymId);
    const gain = store[selectedStat] - oldStat;
    setTrainResult(`Trained ${selectedStat}! +${gain} (using ${gyms.find(g => g.id === gymId)?.name})`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">💪 Gym</h2>
      <p className="text-gray-400">Train your battle stats. Costs 5 energy per session.</p>

      {trainResult && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm">
          {trainResult}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold mb-3">Select Stat to Train</h3>
        <div className="flex flex-wrap gap-2">
          {(['strength', 'speed', 'defense', 'dexterity'] as const).map(stat => (
            <button
              key={stat}
              onClick={() => setSelectedStat(stat)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedStat === stat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {stat} ({store[stat]})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {gyms.map(gym => {
          const canUse = store.level >= gym.levelReq && (!gym.statReq || store[selectedStat] >= gym.statReq);
          return (
            <div key={gym.id} className={`bg-gray-800 rounded-xl p-4 border ${canUse ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{gym.name}</h4>
                  <p className="text-sm text-gray-400">
                    Multiplier: x{gym.multiplier} | Req: Level {gym.levelReq}
                    {gym.statReq && ` | ${selectedStat} ≥ ${gym.statReq}`}
                    {gym.cost && ` | $${gym.cost}/session`}
                  </p>
                </div>
                <button
                  onClick={() => canUse && handleTrain(gym.id)}
                  disabled={!canUse || store.energy < 5}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Train
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CombatPage() {
  const store = useGameStore();
  const [combatResult, setCombatResult] = useState('');
  const [selectedType, setSelectedType] = useState<'mug' | 'hospitalize' | 'leave'>('leave');

  const handleAttack = (enemyId: string) => {
    if (store.energy < 5) {
      setCombatResult('Not enough energy!');
      return;
    }
    const oldLife = store.life;
    store.attackPlayer(enemyId, selectedType);
    const enemy = npcEnemies.find(e => e.id === enemyId);
    if (store.life > oldLife || (store.combatLogs[0]?.result === 'win')) {
      setCombatResult(`✅ Victory against ${enemy?.name}! +$${enemy?.reward}`);
    } else {
      setCombatResult(`❌ Defeated by ${enemy?.name}. Sent to hospital.`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">⚔️ Combat</h2>
      <p className="text-gray-400">Attack NPCs to earn money and XP. Costs 5 energy per attack.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold mb-3">Attack Type</h3>
        <div className="flex flex-wrap gap-2">
          {(['leave', 'mug', 'hospitalize'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedType === type ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type === 'leave' ? '💀 Leave' : type === 'mug' ? '💰 Mug' : '🏥 Hospitalize'}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedType === 'mug' && 'Steal money from the target'}
          {selectedType === 'hospitalize' && 'Send target to hospital for bonus'}
          {selectedType === 'leave' && 'Defeat the target normally'}
        </p>
      </div>

      {combatResult && (
        <div className={`rounded-lg p-3 text-sm border ${
          combatResult.includes('✅') ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'
        }`}>
          {combatResult}
        </div>
      )}

      <div className="space-y-3">
        {npcEnemies.map(enemy => (
          <div key={enemy.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-bold text-white flex items-center gap-2">
                  {enemy.name}
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">Lvl {enemy.level}</span>
                </h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                  <span>STR: {enemy.strength}</span>
                  <span>SPD: {enemy.speed}</span>
                  <span>DEF: {enemy.defense}</span>
                  <span>DEX: {enemy.dexterity}</span>
                  <span>HP: {enemy.life}</span>
                  <span>🔫 {enemy.weapon}</span>
                </div>
                <p className="text-xs text-green-400 mt-1">Reward: ${enemy.reward.toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleAttack(enemy.id)}
                disabled={store.energy < 5}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                Attack
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Combat Log */}
      {store.combatLogs.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-amber-400 mb-3">Combat Log</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {store.combatLogs.slice(0, 10).map(log => (
              <div key={log.id} className={`text-sm ${log.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                {log.result === 'win' ? '✅' : '❌'} {log.type} - {log.target}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CrimePage() {
  const store = useGameStore();
  const [crimeResult, setCrimeResult] = useState('');

  const handleCrime = (crimeId: string) => {
    const crime = crimes.find(c => c.id === crimeId);
    if (!crime) return;
    if (store.nerve < crime.nerveCost) {
      setCrimeResult('Not enough nerve!');
      return;
    }
    store.commitCrime(crimeId);
    const log = store.crimeLogs[0];
    if (log?.success) {
      setCrimeResult(`✅ ${crime.name} successful! +$${log.reward.toLocaleString()}`);
    } else {
      setCrimeResult(`❌ ${crime.name} failed!${store.inJail ? ' Sent to jail!' : ''}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🔫 Crime</h2>
      <p className="text-gray-400">Commit crimes to earn money. Uses nerve. Risk of jail on failure.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-gray-400">Crime Skill: <span className="text-amber-400">{store.crimeSkill.toFixed(1)}</span></span>
          <span className="text-gray-400">Crime XP: <span className="text-amber-400">{store.crimeExp}</span></span>
          <span className="text-gray-400">Nerve: <span className="text-orange-400">{store.nerve}/{store.maxNerve}</span></span>
        </div>
      </div>

      {crimeResult && (
        <div className={`rounded-lg p-3 text-sm border ${
          crimeResult.includes('✅') ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'
        }`}>
          {crimeResult}
        </div>
      )}

      <div className="space-y-2">
        {crimes.map(crime => {
          const canDo = store.nerve >= crime.nerveCost && store.level >= crime.levelReq;
          const successChance = Math.min(95, Math.max(5, 50 + store.crimeSkill * 2 - crime.difficulty + store.dexterity * 0.5));
          return (
            <div key={crime.id} className={`bg-gray-800 rounded-lg p-3 border ${canDo ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{crime.name}</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1">
                    <span className="bg-gray-700 px-1.5 py-0.5 rounded">{crime.category}</span>
                    <span>Nerve: {crime.nerveCost}</span>
                    <span>Lvl {crime.levelReq}+</span>
                    <span>${crime.minCash.toLocaleString()}-${crime.maxCash.toLocaleString()}</span>
                    <span className={successChance > 60 ? 'text-green-400' : successChance > 40 ? 'text-yellow-400' : 'text-red-400'}>
                      Success: {successChance.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => canDo && handleCrime(crime.id)}
                  disabled={!canDo}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Commit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crime Log */}
      {store.crimeLogs.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-amber-400 mb-3">Crime Log</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {store.crimeLogs.slice(0, 10).map(log => (
              <div key={log.id} className={`text-sm ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                {log.success ? '✅' : '❌'} {log.crimeName} {log.success && `+$${log.reward.toLocaleString()}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const handleUse = (itemId: string) => {
    store.useItem(itemId);
    const item = items.find(i => i.id === itemId);
    setMessage(`Used ${item?.name}`);
  };

  const handleSell = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    store.sellItem(itemId);
    setMessage(`Sold ${item?.name} for $${Math.floor((item?.price || 0) * 0.6)}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🎒 Inventory</h2>
      <p className="text-gray-400">Manage your items. Equip weapons and armor, use consumables.</p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold mb-2">Equipped</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">Weapon: <span className="text-white">{items.find(i => i.id === store.equippedWeapon)?.name || 'Fists'}</span></span>
          <span className="text-gray-400">Armor: <span className="text-white">{store.equippedArmor ? items.find(i => i.id === store.equippedArmor)?.name : 'None'}</span></span>
        </div>
      </div>

      {store.inventory.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-500">
          Your inventory is empty. Visit the market to buy items.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {store.inventory.map(inv => {
            const item = items.find(i => i.id === inv.itemId);
            if (!item) return null;
            return (
              <div key={inv.itemId} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.name} x{inv.quantity}</h4>
                    <p className="text-xs text-gray-400">{item.category} - {item.description}</p>
                    {item.effect && <p className="text-xs text-green-400">Effect: {item.effect} +{item.effectValue}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleUse(inv.itemId)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded">Use</button>
                    <button onClick={() => handleSell(inv.itemId)} className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded">Sell</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MarketPage() {
  const store = useGameStore();
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');
  const categories = ['All', 'Melee', 'Primary', 'Secondary', 'Temporary', 'Armor', 'Medical', 'Drug', 'Candy', 'Booster', 'Book'];

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  const handleBuy = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (store.cash < item.price) {
      setMessage('Not enough cash!');
      return;
    }
    store.buyItem(itemId);
    setMessage(`Bought ${item.name} for $${item.price.toLocaleString()}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏪 Item Market</h2>
      <p className="text-gray-400">Buy and sell items. Cash: <span className="text-green-400">${store.cash.toLocaleString()}</span></p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="flex flex-wrap gap-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === cat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                <p className="text-xs text-gray-400">{item.category}</p>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                {item.effect && <p className="text-xs text-green-400">{item.effect}: +{item.effectValue}</p>}
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-sm">${item.price.toLocaleString()}</p>
                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={store.cash < item.price}
                  className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs rounded font-medium"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    if (store.cash < course.cost) {
      setMessage('Not enough cash!');
      return;
    }
    store.startEducation(courseId);
    setMessage(`Enrolled in ${course.name}! Duration: ${course.duration} ticks`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">📚 Education</h2>
      <p className="text-gray-400">Take courses to improve your stats and unlock abilities.</p>

      {store.inEducation && (
        <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-3 text-purple-300 text-sm">
          Currently studying: {courses.find(c => c.id === store.educationCourse)?.name} ({store.educationTimer} ticks remaining)
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {courses.map(course => {
          const canEnroll = !store.inEducation && store.cash >= course.cost && store.level >= course.levelReq;
          return (
            <div key={course.id} className={`bg-gray-800 rounded-lg p-4 border ${canEnroll ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white">{course.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span className="bg-gray-700 px-1.5 py-0.5 rounded">{course.category}</span>
                    <span>Duration: {course.duration} ticks</span>
                    <span>Lvl {course.levelReq}+</span>
                    <span>${course.cost.toLocaleString()}</span>
                    {course.statBonus && <span className="text-green-400">+{course.bonusAmount} {course.statBonus}</span>}
                  </div>
                </div>
                <button
                  onClick={() => canEnroll && handleEnroll(course.id)}
                  disabled={!canEnroll}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Enroll
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JobPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const handleApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    store.applyJob(jobId);
    setMessage(`Applied for ${job.name}!`);
  };

  const handleWork = () => {
    if (store.energy < 5) {
      setMessage('Not enough energy!');
      return;
    }
    store.workJob();
    const job = jobs.find(j => j.id === store.currentJob);
    setMessage(`Worked as ${job?.name}. +$${job?.salary}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">💼 Jobs</h2>
      <p className="text-gray-400">Get a job to earn salary and working stats. Costs 5 energy per shift.</p>

      {store.currentJob && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-green-300">Current Job: {jobs.find(j => j.id === store.currentJob)?.name}</h3>
              <p className="text-sm text-gray-400">Salary: ${jobs.find(j => j.id === store.currentJob)?.salary.toLocaleString()}/shift</p>
            </div>
            <button
              onClick={handleWork}
              disabled={store.energy < 5}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium"
            >
              Work Shift
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {jobs.map(job => {
          const meetsReqs = store.level >= job.levelReq &&
            (!job.statReq.manualLabor || store.manualLabor >= job.statReq.manualLabor) &&
            (!job.statReq.intelligence || store.intelligence >= job.statReq.intelligence) &&
            (!job.statReq.endurance || store.endurance >= job.statReq.endurance);
          return (
            <div key={job.id} className={`bg-gray-800 rounded-lg p-4 border ${meetsReqs ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white">{job.name}</h4>
                  <p className="text-sm text-gray-400">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Salary: ${job.salary.toLocaleString()}</span>
                    <span>Lvl {job.levelReq}+</span>
                    {job.statReq.manualLabor && <span>ML: {job.statReq.manualLabor}+</span>}
                    {job.statReq.intelligence && <span>INT: {job.statReq.intelligence}+</span>}
                    {job.statReq.endurance && <span>END: {job.statReq.endurance}+</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-green-400">
                    {job.statGain.manualLabor && <span>+{job.statGain.manualLabor} ML</span>}
                    {job.statGain.intelligence && <span>+{job.statGain.intelligence} INT</span>}
                    {job.statGain.endurance && <span>+{job.statGain.endurance} END</span>}
                  </div>
                </div>
                <button
                  onClick={() => meetsReqs && handleApply(job.id)}
                  disabled={!meetsReqs}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FactionPage() {
  const store = useGameStore();
  const [factionName, setFactionName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = () => {
    if (store.cash < 50000) {
      setMessage('Need $50,000 to create a faction!');
      return;
    }
    store.createFaction(factionName);
    setMessage(`Created faction: ${factionName}`);
  };

  const handleJoin = () => {
    store.joinFaction('The Syndicate');
    setMessage('Joined The Syndicate!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏴 Faction</h2>
      <p className="text-gray-400">Join or create a faction to participate in organized crime, territory wars, and chains.</p>

      {store.factionName ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">{store.factionName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">Rank:</span> <span className="text-white">{store.factionRank}</span></div>
            <div><span className="text-gray-400">Respect:</span> <span className="text-amber-400">{store.factionRespect}</span></div>
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="font-bold text-white">Faction Features</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700 p-2 rounded">🔫 Organized Crime</div>
              <div className="bg-gray-700 p-2 rounded">🗺️ Territory Warfare</div>
              <div className="bg-gray-700 p-2 rounded">⛓️ Chain Attacks</div>
              <div className="bg-gray-700 p-2 rounded">💣 Raids</div>
              <div className="bg-gray-700 p-2 rounded">🏆 Ranked Wars</div>
              <div className="bg-gray-700 p-2 rounded">💰 Faction Vault</div>
              <div className="bg-gray-700 p-2 rounded">🔫 Armory</div>
              <div className="bg-gray-700 p-2 rounded">📋 Faction Forums</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-3">Create a Faction</h3>
            <p className="text-sm text-gray-400 mb-3">Cost: $50,000</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={factionName}
                onChange={(e) => setFactionName(e.target.value)}
                placeholder="Faction name..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium text-sm"
              >
                Create ($50k)
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-3">Join a Faction</h3>
            <button
              onClick={handleJoin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm"
            >
              Join "The Syndicate"
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}
    </div>
  );
}

function TravelPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const handleTravel = (destId: string) => {
    if (store.level < 15) {
      setMessage('Need level 15 to travel!');
      return;
    }
    store.travel(destId);
    const dest = destinations.find(d => d.id === destId);
    setMessage(`Traveling to ${dest?.name}...`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">✈️ Travel</h2>
      <p className="text-gray-400">Travel to different countries for unique items and experiences. Requires Level 15.</p>

      {store.level < 15 && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
          You need to be Level 15 to travel. Current level: {store.level}
        </div>
      )}

      {store.isTraveling && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">
          Currently traveling to {destinations.find(d => d.id === store.travelDestination)?.name} ({store.travelTimer} ticks remaining)
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {destinations.map(dest => (
          <div key={dest.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="font-bold text-white">{dest.name}</h4>
            <div className="text-xs text-gray-400 mt-1 space-y-1">
              <p>Flight Time: {dest.flightTime} min</p>
              <p>Available Items: {dest.items.join(', ')}</p>
            </div>
            <button
              onClick={() => handleTravel(dest.id)}
              disabled={store.level < 15 || store.isTraveling}
              className="mt-3 w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm font-medium"
            >
              Travel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CasinoPage() {
  const store = useGameStore();
  const [selectedGame, setSelectedGame] = useState('slots');
  const [bet, setBet] = useState(100);
  const [choice, setChoice] = useState('red');
  const [result, setResult] = useState('');

  const handleGamble = () => {
    if (store.cash < bet) {
      setResult('Not enough cash!');
      return;
    }
    const winnings = store.gamble(selectedGame, bet, choice);
    if (winnings > 0) {
      setResult(`🎉 Won $${winnings.toLocaleString()}! (Net: ${winnings > bet ? '+' : ''}$${(winnings - bet).toLocaleString()})`);
    } else {
      setResult(`💀 Lost $${bet.toLocaleString()}!`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🎰 Casino</h2>
      <p className="text-gray-400">Test your luck at the casino. Cash: <span className="text-green-400">${store.cash.toLocaleString()}</span></p>

      {result && (
        <div className={`rounded-lg p-3 text-sm border ${
          result.includes('🎉') ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'
        }`}>
          {result}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-wrap gap-2 mb-4">
          {casinoGames.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGame === game.id ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Bet Amount</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
              className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {selectedGame === 'roulette' && (
            <div>
              <label className="text-sm text-gray-400">Pick</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setChoice('red')} className={`px-4 py-2 rounded ${choice === 'red' ? 'bg-red-600' : 'bg-gray-700'} text-white`}>Red (2x)</button>
                <button onClick={() => setChoice('black')} className={`px-4 py-2 rounded ${choice === 'black' ? 'bg-gray-900' : 'bg-gray-700'} text-white`}>Black (2x)</button>
                <button onClick={() => setChoice('num_7')} className={`px-4 py-2 rounded ${choice === 'num_7' ? 'bg-green-600' : 'bg-gray-700'} text-white`}>Number 7 (36x)</button>
              </div>
            </div>
          )}

          <button
            onClick={handleGamble}
            disabled={store.cash < bet}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-lg transition-colors"
          >
            {selectedGame === 'russian_roulette' ? '🔫 Pull the Trigger' : '🎲 Play'}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold text-amber-400 mb-2">Game Info</h3>
        <p className="text-sm text-gray-400">
          {casinoGames.find(g => g.id === selectedGame)?.description}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Min bet: ${casinoGames.find(g => g.id === selectedGame)?.minBet.toLocaleString()} | Max bet: ${casinoGames.find(g => g.id === selectedGame)?.maxBet.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function BankPage() {
  const store = useGameStore();
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleDeposit = () => {
    if (amount <= 0 || amount > store.cash) return;
    store.depositBank(amount);
    setMessage(`Deposited $${amount.toLocaleString()}`);
    setAmount(0);
  };

  const handleWithdraw = () => {
    if (amount <= 0 || amount > store.bank) return;
    store.withdrawBank(amount);
    setMessage(`Withdrew $${amount.toLocaleString()}`);
    setAmount(0);
  };

  const handleInvest = () => {
    if (amount <= 0 || amount > store.cash) return;
    store.investBank(amount);
    setMessage(`Invested $${amount.toLocaleString()} (15% return in 30 ticks)`);
    setAmount(0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏦 Bank</h2>
      <p className="text-gray-400">Deposit, withdraw, and invest your money.</p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Cash</p>
          <p className="text-xl font-bold text-green-400">${store.cash.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Bank Balance</p>
          <p className="text-xl font-bold text-blue-400">${store.bank.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Investment</p>
          <p className="text-xl font-bold text-purple-400">${store.bankInvestment.toLocaleString()}</p>
          {store.bankInvestmentTime > 0 && <p className="text-xs text-gray-400">{store.bankInvestmentTime} ticks left</p>}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="mb-4">
          <label className="text-sm text-gray-400">Amount</label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            placeholder="Enter amount..."
            className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setAmount(store.cash)} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">Max Cash</button>
            <button onClick={() => setAmount(store.bank)} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">Max Bank</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDeposit} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm">Deposit</button>
          <button onClick={handleWithdraw} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm">Withdraw</button>
          <button onClick={handleInvest} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-sm">Invest (15%)</button>
        </div>
      </div>
    </div>
  );
}

function StocksPage() {
  const store = useGameStore();
  const [selectedStock, setSelectedStock] = useState('');
  const [shares, setShares] = useState(1);
  const [message, setMessage] = useState('');

  const handleBuy = () => {
    if (!selectedStock) return;
    const price = store.stockPrices[selectedStock];
    const cost = price * shares;
    if (cost > store.cash) {
      setMessage('Not enough cash!');
      return;
    }
    store.buyStock(selectedStock, shares);
    setMessage(`Bought ${shares} shares for $${cost.toLocaleString()}`);
  };

  const handleSell = () => {
    if (!selectedStock) return;
    store.sellStock(selectedStock, shares);
    const price = store.stockPrices[selectedStock];
    setMessage(`Sold ${shares} shares for $${(price * shares).toLocaleString()}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">📈 Stock Market</h2>
      <p className="text-gray-400">Buy and sell stocks. Prices fluctuate over time.</p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2">Company</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Your Shares</th>
              <th className="text-right py-2">Value</th>
              <th className="text-right py-2">Benefit</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => {
              const holding = store.stockHoldings.find(h => h.stockId === stock.id);
              const price = store.stockPrices[stock.id];
              return (
                <tr
                  key={stock.id}
                  onClick={() => setSelectedStock(stock.id)}
                  className={`border-b border-gray-700/50 cursor-pointer transition-colors ${
                    selectedStock === stock.id ? 'bg-amber-900/30' : 'hover:bg-gray-700/50'
                  }`}
                >
                  <td className="py-2 text-white">{stock.name}</td>
                  <td className="py-2 text-right text-green-400">${price}</td>
                  <td className="py-2 text-right text-white">{holding?.shares || 0}</td>
                  <td className="py-2 text-right text-amber-400">${holding ? (price * holding.shares).toLocaleString() : '0'}</td>
                  <td className="py-2 text-right text-gray-400 text-xs">{stock.benefit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedStock && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="font-bold text-white mb-3">{stocks.find(s => s.id === selectedStock)?.name}</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-gray-400">Shares</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="block mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-24 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-sm text-gray-400">
              Total: <span className="text-green-400">${((store.stockPrices[selectedStock] || 0) * shares).toLocaleString()}</span>
            </div>
            <button onClick={handleBuy} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium">Buy</button>
            <button onClick={handleSell} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium">Sell</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const handleBuy = (propId: string) => {
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;
    if (store.cash < prop.price) {
      setMessage('Not enough cash!');
      return;
    }
    store.buyProperty(propId);
    setMessage(`Bought ${prop.name}!`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏠 Property</h2>
      <p className="text-gray-400">Buy property for happiness bonuses and special facilities.</p>

      {store.currentProperty && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
          <h3 className="font-bold text-green-300">Current: {properties.find(p => p.id === store.currentProperty)?.name}</h3>
          <p className="text-sm text-gray-400">Max Happy: {properties.find(p => p.id === store.currentProperty)?.maxHappy}</p>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {properties.map(prop => {
          const canBuy = store.cash >= prop.price && store.level >= prop.levelReq;
          const owned = store.currentProperty === prop.id;
          return (
            <div key={prop.id} className={`bg-gray-800 rounded-lg p-4 border ${owned ? 'border-green-700' : canBuy ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white">{prop.name} {owned && <span className="text-green-400 text-xs">(Owned)</span>}</h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Max Happy: {prop.maxHappy}</span>
                    <span>Upkeep: ${prop.upkeep}/day</span>
                    <span>Lvl {prop.levelReq}+</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prop.benefits.map(b => (
                      <span key={b} className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">{b}</span>
                    ))}
                  </div>
                </div>
                {!owned && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${prop.price.toLocaleString()}</p>
                    <button
                      onClick={() => canBuy && handleBuy(prop.id)}
                      disabled={!canBuy}
                      className="mt-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
                    >
                      Buy
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeritsPage() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const meritCategories = [
    { id: 'strength', name: 'Strength', desc: '+5 Strength per point', icon: '💪' },
    { id: 'defense', name: 'Defense', desc: '+5 Defense per point', icon: '🛡️' },
    { id: 'speed', name: 'Speed', desc: '+5 Speed per point', icon: '⚡' },
    { id: 'dexterity', name: 'Dexterity', desc: '+5 Dexterity per point', icon: '🎯' },
    { id: 'life', name: 'Life', desc: '+20 Max Life per point', icon: '❤️' },
    { id: 'energy', name: 'Energy', desc: '+5 Max Energy per point', icon: '🔋' },
    { id: 'nerve', name: 'Nerve', desc: '+5 Max Nerve per point', icon: '🧠' },
    { id: 'happy', name: 'Happy', desc: '+10 Max Happy per point', icon: '😊' },
    { id: 'crime', name: 'Crime', desc: '+1 Crime Skill per point', icon: '🔫' },
  ];

  const handleAllocate = (merit: string) => {
    if (store.meritPoints <= 0) {
      setMessage('No merit points available!');
      return;
    }
    store.allocateMerit(merit);
    setMessage(`Allocated merit point to ${merit}!`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">⭐ Merits</h2>
      <p className="text-gray-400">Allocate merit points earned from leveling up. Permanent character upgrades.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
        <p className="text-sm text-gray-400">Available Merit Points</p>
        <p className="text-3xl font-bold text-amber-400">{store.meritPoints}</p>
      </div>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {meritCategories.map(cat => (
          <div key={cat.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </h4>
                <p className="text-xs text-gray-400">{cat.desc}</p>
                <p className="text-xs text-amber-400 mt-1">Current: {store.merits[cat.id as keyof typeof store.merits]}</p>
              </div>
              <button
                onClick={() => handleAllocate(cat.id)}
                disabled={store.meritPoints <= 0}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
              >
                +1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HospitalPage() {
  const store = useGameStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏥 Hospital & Jail</h2>

      {store.inHospital ? (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-300 mb-2">You're in the Hospital</h3>
          <p className="text-gray-300 mb-4">Time remaining: {store.hospitalTimer} ticks</p>
          <p className="text-sm text-gray-400 mb-4">Use medical items or wait to recover. You can also revive yourself with energy.</p>
          <button
            onClick={() => store.revivePlayer()}
            disabled={store.energy < 10}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium"
          >
            Self-Revive (10 Energy)
          </button>
        </div>
      ) : store.inJail ? (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-300 mb-2">You're in Jail</h3>
          <p className="text-gray-300 mb-4">Time remaining: {store.jailTimer} ticks</p>
          <p className="text-sm text-gray-400">Wait for your sentence to end or get busted by someone.</p>
        </div>
      ) : (
        <div className="bg-green-900/50 border border-green-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-300 mb-2">All Clear</h3>
          <p className="text-gray-300">You're not in hospital or jail. Life: {store.life}/{store.maxLife}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold text-white mb-2">Medical Items</h3>
        <p className="text-sm text-gray-400 mb-3">Buy medical items from the market to heal faster.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {items.filter(i => i.category === 'Medical').map(item => (
            <div key={item.id} className="bg-gray-700 rounded p-2 text-center">
              <p className="text-xs font-bold text-white">{item.name}</p>
              <p className="text-xs text-green-400">+{item.effectValue} HP</p>
              <p className="text-xs text-gray-400">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const store = useGameStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">👤 Profile</h2>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{store.name}</h3>
            <p className="text-amber-400">Level {store.level} - {store.rank}</p>
            <p className="text-sm text-gray-400">Age: {store.age} days</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <p className="text-gray-400">Cash</p>
            <p className="text-green-400 font-bold">${store.cash.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <p className="text-gray-400">Bank</p>
            <p className="text-blue-400 font-bold">${store.bank.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <p className="text-gray-400">Points</p>
            <p className="text-purple-400 font-bold">{store.points}</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <p className="text-gray-400">Faction</p>
            <p className="text-amber-400 font-bold">{store.factionName || 'None'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-bold text-amber-400 mb-3">Equipment</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-400">Weapon:</span> <span className="text-white">{items.find(i => i.id === store.equippedWeapon)?.name || 'Fists'}</span></p>
          <p><span className="text-gray-400">Armor:</span> <span className="text-white">{store.equippedArmor ? items.find(i => i.id === store.equippedArmor)?.name : 'None'}</span></p>
          <p><span className="text-gray-400">Property:</span> <span className="text-white">{store.currentProperty ? properties.find(p => p.id === store.currentProperty)?.name : 'None'}</span></p>
          <p><span className="text-gray-400">Job:</span> <span className="text-white">{store.currentJob ? jobs.find(j => j.id === store.currentJob)?.name : 'Unemployed'}</span></p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-bold text-amber-400 mb-3">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-700 p-2 rounded">🏆 {store.totalAttacks} Attacks</div>
          <div className="bg-gray-700 p-2 rounded">🔫 {store.totalCrimes} Crimes</div>
          <div className="bg-gray-700 p-2 rounded">💰 {store.totalMugs} Mugs</div>
          <div className="bg-gray-700 p-2 rounded">🏥 {store.totalHospitalized} Hospitalized</div>
          <div className="bg-gray-700 p-2 rounded">⭐ {store.totalXpGained} XP Gained</div>
          <div className="bg-gray-700 p-2 rounded">💵 ${store.totalCashEarned.toLocaleString()} Earned</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-red-900">
        <h3 className="font-bold text-red-400 mb-3">⚠️ Reset Character</h3>
        <p className="text-sm text-gray-400 mb-3">This will permanently delete all progress. This action cannot be undone.</p>
        <button
          onClick={() => { if (confirm('Are you sure? This will reset ALL progress!')) store.resetGame(); }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm"
        >
          Reset Character
        </button>
      </div>
    </div>
  );
}

export default App;
