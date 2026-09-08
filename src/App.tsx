import { useState, useEffect } from 'react';
import { useGameStore } from './store';
import { useExtendedStore } from './store2';
import { crimes, gyms, courses, jobs, items, npcEnemies, stocks, properties, cityAreas, destinations, casinoGames } from './data';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, missions, awards, companies, bounties, collections, viruses, marriageCandidates } from './data2';

// Torn City style navigation - matches actual torn.com structure
type MainSection = 'home' | 'items' | 'city' | 'jobs' | 'gym' | 'crimes' | 'travel' | 'education' | 'properties' | 'faction' | 'messages' | 'profile';
type CityLocation = 'bank' | 'casino' | 'loan_shark' | 'item_market' | 'auction' | 'points_market' | 'hospital' | 'jail' | 'museum' | 'dump' | 'shops' | 'post_office' | 'church' | 'community';
type CrimeTab = 'crimes' | 'organized' | 'jail_records';
type ProfileTab = 'overview' | 'stats' | 'merits' | 'awards' | 'equipment' | 'logs';
type FactionTab = 'info' | 'members' | 'oc' | 'warfare' | 'forum';

function App() {
  const [section, setSection] = useState<MainSection>('home');
  const [cityLocation, setCityLocation] = useState<CityLocation | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const store = useGameStore();
  const ext = useExtendedStore();

  // Game tick every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      store.tick();
      ext.tick();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (store.name === 'Player') setShowNameModal(true);
  }, []);

  const handleCityNav = (loc: CityLocation) => {
    setSection('city');
    setCityLocation(loc);
    setMobileMenuOpen(false);
  };

  const handleMainNav = (sec: MainSection) => {
    setSection(sec);
    setCityLocation(null);
    setMobileMenuOpen(false);
  };

  const mainNavItems: { id: MainSection; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'items', label: 'Items', icon: '🎒' },
    { id: 'city', label: 'City', icon: '🏙️' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'crimes', label: 'Crimes', icon: '🔫' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'faction', label: 'Faction', icon: '🏴' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const isDisabled = store.inHospital || store.inJail || store.isTraveling;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Name Modal */}
      {showNameModal && <NameModal onClose={() => setShowNameModal(false)} />}

      {/* Top Status Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-3 py-1.5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-400">🌃 TORN</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Lv.{store.level}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MiniBar label="HP" value={store.life} max={store.maxLife} color="bg-red-500" />
              <MiniBar label="EN" value={store.energy} max={store.maxEnergy} color="bg-green-500" />
              <MiniBar label="NV" value={store.nerve} max={store.maxNerve} color="bg-orange-500" />
              <MiniBar label="HP" value={store.happy} max={store.maxHappy} color="bg-pink-500" />
              <span className="text-green-400 font-mono hidden sm:inline">${store.cash.toLocaleString()}</span>
            </div>
          </div>
          {/* Status indicators */}
          <div className="flex gap-1 mt-1 text-[10px] overflow-x-auto scrollbar-hide">
            {store.inHospital && <span className="bg-red-900/80 text-red-300 px-1.5 py-0.5 rounded whitespace-nowrap">🏥 {store.hospitalTimer}</span>}
            {store.inJail && <span className="bg-yellow-900/80 text-yellow-300 px-1.5 py-0.5 rounded whitespace-nowrap">🔒 {store.jailTimer}</span>}
            {store.isTraveling && <span className="bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded whitespace-nowrap">✈️ {store.travelTimer}</span>}
            {store.inEducation && <span className="bg-purple-900/80 text-purple-300 px-1.5 py-0.5 rounded whitespace-nowrap">📚 {store.educationTimer}</span>}
            {ext.racingActive && <span className="bg-cyan-900/80 text-cyan-300 px-1.5 py-0.5 rounded whitespace-nowrap">🏎️ Racing</span>}
          </div>
        </div>
      </header>

      {/* Main Navigation - Torn style horizontal nav */}
      <nav className="bg-gray-800/90 border-b border-gray-700 hidden md:block">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-1">
            {mainNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleMainNav(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  section === item.id ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
        <div className="flex justify-around p-1">
          {mainNavItems.slice(0, 6).map(item => (
            <button
              key={item.id}
              onClick={() => handleMainNav(item.id)}
              className={`flex flex-col items-center p-1 rounded text-[10px] ${
                section === item.id ? 'text-amber-400' : 'text-gray-400'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center p-1 rounded text-[10px] text-gray-400"
          >
            <span className="text-base">☰</span>
            <span>More</span>
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 grid grid-cols-3 gap-1 max-h-[60vh] overflow-y-auto">
            {mainNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleMainNav(item.id)}
                className={`flex flex-col items-center p-2 rounded text-xs ${
                  section === item.id ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-lg mb-0.5">{item.icon}</span>
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 pb-20 md:pb-4">
        <div className="max-w-6xl mx-auto">
          {section === 'home' && <HomePage />}
          {section === 'items' && <ItemsPage />}
          {section === 'city' && <CityPage location={cityLocation} onNavigate={handleCityNav} />}
          {section === 'jobs' && <JobsPage />}
          {section === 'gym' && <GymPage />}
          {section === 'crimes' && <CrimesPage />}
          {section === 'travel' && <TravelPage />}
          {section === 'education' && <EducationPage />}
          {section === 'properties' && <PropertiesPage />}
          {section === 'faction' && <FactionPage />}
          {section === 'messages' && <MessagesPage />}
          {section === 'profile' && <ProfilePage />}
        </div>
      </main>
    </div>
  );
}

// ============ UTILITY COMPONENTS ============

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-0.5">
      <span className="text-gray-500 text-[9px]">{label}</span>
      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9px] text-gray-400 font-mono w-8">{value}/{max}</span>
    </div>
  );
}

function NameModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const store = useGameStore();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-800 p-6 rounded-xl border border-amber-600 max-w-md w-full">
        <h2 className="text-xl font-bold text-amber-400 mb-3">🌃 Welcome to Torn City</h2>
        <p className="text-gray-300 text-sm mb-4">Enter your character name to begin your journey in the criminal underworld.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-3 focus:outline-none focus:border-amber-500 text-sm"
          maxLength={20}
        />
        <button
          onClick={() => { if (name.trim()) { store.setName(name.trim()); onClose(); } }}
          className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors text-sm"
        >
          Enter Torn City
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border border-gray-700 ${className}`}>
      {title && <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>}
      {children}
    </div>
  );
}

// ============ HOME PAGE ============
function HomePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const xpNeeded = Math.floor(100 * Math.pow(1.5, store.level - 1));
  
  // Daily news rotation
  const dailyNews = [
    '🔥 Faction war heats up in downtown!',
    '💰 Record-breaking heist reported',
    '🏋️ New gym opens in West Side',
    '📈 Stock market shows strong growth',
    '🚨 Police crack down on organized crime',
    '🏎️ Racing championship finals tonight',
    '💎 Rare artifact discovered at museum',
  ];
  
  return (
    <div className="space-y-4">
      {/* Daily News Banner */}
      <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 rounded-lg p-3 border border-amber-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📰</span>
          <div>
            <p className="text-xs text-amber-300 font-bold">DAILY NEWS</p>
            <p className="text-sm text-white">{dailyNews[store.age % dailyNews.length]}</p>
          </div>
        </div>
      </div>

      {/* Character Summary */}
      <SectionCard>        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h2 className="text-lg font-bold text-white">{store.name}</h2>
            <p className="text-sm text-amber-400">Level {store.level} • {store.rank}</p>
            <p className="text-xs text-gray-400">Age: {store.age} days</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-green-400 font-mono font-bold">${store.cash.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Bank: ${store.bank.toLocaleString()}</p>
          </div>
        </div>
        {/* XP Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Progress</span>
            <span>{store.xp} / {xpNeeded} XP</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${(store.xp / xpNeeded) * 100}%` }} />
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-red-400 font-bold">{store.strength}</p>
            <p className="text-gray-500">STR</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-blue-400 font-bold">{store.speed}</p>
            <p className="text-gray-500">SPD</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-green-400 font-bold">{store.defense}</p>
            <p className="text-gray-500">DEF</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-yellow-400 font-bold">{store.dexterity}</p>
            <p className="text-gray-500">DEX</p>
          </div>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <QuickAction icon="💪" label="Train" desc="Go to Gym" color="border-red-800" />
        <QuickAction icon="🔫" label="Crime" desc="Commit crime" color="border-orange-800" />
        <QuickAction icon="⚔️" label="Attack" desc="Fight players" color="border-purple-800" />
        <QuickAction icon="💼" label="Work" desc="Do your job" color="border-blue-800" />
      </div>

      {/* Tips & Tutorial */}
      <SectionCard title="💡 Tips for New Players">
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Start with low-level crimes to build nerve and earn cash</p>
          <p>• Train at the gym to increase your battle stats</p>
          <p>• Join a faction to access organized crimes and warfare</p>
          <p>• Invest in the bank for passive income</p>
          <p>• Travel abroad (level 15+) for unique items and hunting</p>
        </div>
      </SectionCard>

      {/* Recent Activity */}
      <SectionCard title="📋 Recent Activity">
        <div className="space-y-2 text-sm">
          {store.combatLogs.slice(0, 3).map(log => (
            <div key={log.id} className={`flex justify-between items-center p-2 rounded ${log.result === 'win' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
              <span className="text-gray-300">{log.result === 'win' ? '✅' : '❌'} {log.type} {log.target}</span>
              <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {store.crimeLogs.slice(0, 3).map(log => (
            <div key={log.id} className={`flex justify-between items-center p-2 rounded ${log.success ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
              <span className="text-gray-300">{log.success ? '✅' : '❌'} {log.crimeName} {log.success && `+$${log.reward}`}</span>
              <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {store.combatLogs.length === 0 && store.crimeLogs.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity. Start your journey!</p>
          )}
        </div>
      </SectionCard>

      {/* Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="📊 Status">
          <div className="space-y-2 text-sm">
            <StatusRow label="Job" value={store.currentJob ? jobs.find(j => j.id === store.currentJob)?.name || 'Unknown' : 'Unemployed'} />
            <StatusRow label="Faction" value={store.factionName || 'None'} />
            <StatusRow label="Property" value={store.currentProperty ? properties.find(p => p.id === store.currentProperty)?.name || 'Unknown' : 'None'} />
            <StatusRow label="Education" value={store.inEducation ? courses.find(c => c.id === store.educationCourse)?.name || 'Studying' : 'None'} />
            <StatusRow label="Married" value={ext.marriedTo || 'No'} />
          </div>
        </SectionCard>
        <SectionCard title="💰 Finances">
          <div className="space-y-2 text-sm">
            <StatusRow label="Cash" value={`$${store.cash.toLocaleString()}`} />
            <StatusRow label="Bank" value={`$${store.bank.toLocaleString()}`} />
            <StatusRow label="Investment" value={`$${store.bankInvestment.toLocaleString()}`} />
            <StatusRow label="Points" value={`${store.points}`} />
            <StatusRow label="Net Worth" value={`$${(store.cash + store.bank + store.bankInvestment).toLocaleString()}`} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, color }: { icon: string; label: string; desc: string; color: string }) {
  return (
    <div className={`bg-gray-800 rounded-lg p-3 border-l-2 ${color} text-center`}>
      <span className="text-xl">{icon}</span>
      <p className="text-xs font-bold text-white mt-1">{label}</p>
      <p className="text-[10px] text-gray-400">{desc}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

// ============ ITEMS PAGE (Inventory + Equipment) ============
function ItemsPage() {
  const store = useGameStore();
  const [tab, setTab] = useState<'inventory' | 'equipment' | 'bazaar'>('inventory');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🎒 Items</h2>
      
      <div className="flex gap-2">
        {(['inventory', 'equipment', 'bazaar'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize ${tab === t ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'inventory' && <InventoryTab />}
      {tab === 'equipment' && <EquipmentTab />}
      {tab === 'bazaar' && <BazaarTab />}
    </div>
  );
}

function InventoryTab() {
  const store = useGameStore();
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(items.map(i => i.category))];
  
  const filtered = filter === 'all' ? store.inventory : store.inventory.filter(inv => {
    const item = items.find(i => i.id === inv.itemId);
    return item?.category === filter;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-2 py-1 rounded text-[10px] capitalize ${filter === cat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
            {cat}
          </button>
        ))}
      </div>
      
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No items. Visit shops or the item market.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(inv => {
            const item = items.find(i => i.id === inv.itemId);
            if (!item) return null;
            return (
              <div key={inv.itemId} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{item.name} <span className="text-gray-500 text-xs">x{inv.quantity}</span></p>
                  <p className="text-[10px] text-gray-400">{item.category} • {item.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => store.useItem(inv.itemId)} className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-[10px]">Use</button>
                  <button onClick={() => store.sellItem(inv.itemId)} className="px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-[10px]">Sell</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EquipmentTab() {
  const store = useGameStore();
  const weapon = items.find(i => i.id === store.equippedWeapon);
  const armor = items.find(i => i.id === store.equippedArmor);
  const weapons = items.filter(i => ['Melee', 'Primary', 'Secondary', 'Temporary'].includes(i.category));
  const armors = items.filter(i => i.category === 'Armor');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="⚔️ Weapon">
          <p className="text-sm text-gray-400 mb-2">Currently equipped:</p>
          <div className="bg-gray-700 rounded p-3 mb-3">
            <p className="font-bold text-white">{weapon?.name || 'Fists'}</p>
            <p className="text-xs text-gray-400">Damage: {weapon?.effectValue || 3}</p>
          </div>
          <p className="text-xs text-gray-400 mb-2">Available weapons:</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {weapons.map(w => {
              const owned = store.inventory.find(i => i.itemId === w.id);
              return (
                <div key={w.id} className="flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs">
                  <span className="text-gray-300">{w.name} (DMG: {w.effectValue})</span>
                  {owned ? (
                    <button onClick={() => store.useItem(w.id)} className="px-2 py-0.5 bg-amber-600 text-white rounded">Equip</button>
                  ) : (
                    <button onClick={() => store.buyItem(w.id)} className="px-2 py-0.5 bg-green-700 text-white rounded">${w.price}</button>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="🛡️ Armor">
          <p className="text-sm text-gray-400 mb-2">Currently equipped:</p>
          <div className="bg-gray-700 rounded p-3 mb-3">
            <p className="font-bold text-white">{armor?.name || 'None'}</p>
            <p className="text-xs text-gray-400">Defense: {armor?.effectValue || 0}</p>
          </div>
          <p className="text-xs text-gray-400 mb-2">Available armor:</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {armors.map(a => {
              const owned = store.inventory.find(i => i.itemId === a.id);
              return (
                <div key={a.id} className="flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs">
                  <span className="text-gray-300">{a.name} (DEF: {a.effectValue})</span>
                  {owned ? (
                    <button onClick={() => store.useItem(a.id)} className="px-2 py-0.5 bg-amber-600 text-white rounded">Equip</button>
                  ) : (
                    <button onClick={() => store.buyItem(a.id)} className="px-2 py-0.5 bg-green-700 text-white rounded">${a.price}</button>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function BazaarTab() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  return (
    <SectionCard title="🏬 Your Bazaar">
      <p className="text-sm text-gray-400 mb-3">Set up your personal shop to sell items to other players.</p>
      {store.points < 1 && (
        <p className="text-xs text-red-400 mb-2">Requires 1 Point to open a Bazaar. Current: {store.points}</p>
      )}
      <div className="bg-gray-700 rounded p-3 text-center">
        <p className="text-gray-400 text-sm">Your bazaar is {store.points >= 1 ? 'active' : 'locked'}</p>
        <p className="text-xs text-gray-500 mt-1">List items for sale and earn profit from other players</p>
      </div>
      {message && <p className="text-green-400 text-xs mt-2">{message}</p>}
    </SectionCard>
  );
}

// ============ CITY PAGE (Hub for all locations) ============
function CityPage({ location, onNavigate }: { location: CityLocation | null; onNavigate: (loc: CityLocation) => void }) {
  if (!location) {
    return <CityMap onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-4">
      <button onClick={() => onNavigate('bank')} className="text-xs text-amber-400 hover:text-amber-300">
        ← Back to City Map
      </button>
      {location === 'bank' && <BankLocation />}
      {location === 'casino' && <CasinoLocation />}
      {location === 'loan_shark' && <LoanSharkLocation />}
      {location === 'item_market' && <ItemMarketLocation />}
      {location === 'auction' && <AuctionLocation />}
      {location === 'points_market' && <PointsMarketLocation />}
      {location === 'hospital' && <HospitalLocation />}
      {location === 'jail' && <JailLocation />}
      {location === 'museum' && <MuseumLocation />}
      {location === 'dump' && <DumpLocation />}
      {location === 'shops' && <ShopsLocation />}
      {location === 'post_office' && <PostOfficeLocation />}
      {location === 'church' && <ChurchLocation />}
      {location === 'community' && <CommunityLocation />}
    </div>
  );
}

const cityLocationsList: { id: CityLocation; label: string; icon: string; district: string }[] = [
  { id: 'bank', label: 'Bank', icon: '🏦', district: 'Financial' },
  { id: 'casino', label: 'Casino', icon: '🎰', district: 'Red-Light' },
  { id: 'loan_shark', label: 'Loan Shark', icon: '🦈', district: 'Red-Light' },
  { id: 'item_market', label: 'Item Market', icon: '🏪', district: 'North' },
  { id: 'auction', label: 'Auction House', icon: '🔨', district: 'North' },
  { id: 'points_market', label: 'Points Market', icon: '💎', district: 'North' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', district: 'Center' },
  { id: 'jail', label: 'Jail', icon: '🔒', district: 'Center' },
  { id: 'museum', label: 'Museum', icon: '🏛️', district: 'Center' },
  { id: 'dump', label: 'Dump', icon: '🗑️', district: 'Red-Light' },
  { id: 'shops', label: 'Shops', icon: '🛒', district: 'East' },
  { id: 'post_office', label: 'Post Office', icon: '📮', district: 'East' },
  { id: 'church', label: 'Church', icon: '⛪', district: 'North' },
  { id: 'community', label: 'Community', icon: '👥', district: 'Center' },
];

function CityMap({ onNavigate }: { onNavigate: (loc: CityLocation) => void }) {
  const districts = ['Financial', 'Red-Light', 'North', 'Center', 'East'];
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🏙️ Torn City</h2>
      <p className="text-gray-400 text-sm">Navigate to different locations in the city.</p>
      
      {districts.map(district => (
        <SectionCard key={district} title={`📍 ${district}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {cityAreas.flatMap(a => a.district === district ? a.locations : []).length > 0 && (
              cityAreas.filter(a => a.district === district).map(area => (
                area.locations.map(loc => {
                  const cityLoc = cityLocationsList.find(cl => cl.label === loc);
                  if (cityLoc) {
                    return (
                      <button key={loc} onClick={() => onNavigate(cityLoc.id)}
                        className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-left transition-colors">
                        <span className="text-sm">{cityLoc.icon}</span>
                        <p className="text-xs text-white mt-0.5">{cityLoc.label}</p>
                      </button>
                    );
                  }
                  return (
                    <div key={loc} className="bg-gray-700/50 rounded-lg p-2 text-left opacity-60">
                      <span className="text-sm">📍</span>
                      <p className="text-xs text-gray-400 mt-0.5">{loc}</p>
                    </div>
                  );
                })
              ))
            )}
          </div>
        </SectionCard>
      ))}

      {/* Direct access to city locations */}
      <SectionCard title="🗺️ All Locations">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {cityLocationsList.map((loc: typeof cityLocationsList[0]) => (
            <button key={loc.id} onClick={() => onNavigate(loc.id)}
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition-colors border border-gray-600">
              <span className="text-lg">{loc.icon}</span>
              <p className="text-xs text-white font-medium mt-1">{loc.label}</p>
              <p className="text-[10px] text-gray-500">{loc.district}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ============ CITY LOCATIONS ============

function BankLocation() {
  const store = useGameStore();
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [investAmt, setInvestAmt] = useState('');

  return (
    <SectionCard title="🏦 Torn City Bank">
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">Cash</p>
          <p className="text-green-400 font-bold text-sm">${store.cash.toLocaleString()}</p>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-blue-400 font-bold text-sm">${store.bank.toLocaleString()}</p>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">Investment</p>
          <p className="text-purple-400 font-bold text-sm">${store.bankInvestment.toLocaleString()}</p>
        </div>
      </div>
      
      {store.bankInvestment > 0 && (
        <div className="bg-purple-900/30 border border-purple-800 rounded p-2 mb-3 text-xs">
          <p className="text-purple-300">Investment matures in {store.bankInvestmentTime} ticks (15% interest)</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Amount" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
          <button onClick={() => { store.depositBank(Number(depositAmt)); setDepositAmt(''); }} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-sm">Deposit</button>
        </div>
        <div className="flex gap-2">
          <input type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} placeholder="Amount" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
          <button onClick={() => { store.withdrawBank(Number(withdrawAmt)); setWithdrawAmt(''); }} className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm">Withdraw</button>
        </div>
        <div className="flex gap-2">
          <input type="number" value={investAmt} onChange={e => setInvestAmt(e.target.value)} placeholder="Amount" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
          <button onClick={() => { store.investBank(Number(investAmt)); setInvestAmt(''); }} className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">Invest (30 ticks)</button>
        </div>
      </div>
    </SectionCard>
  );
}

function CasinoLocation() {
  const store = useGameStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [bet, setBet] = useState('100');
  const [result, setResult] = useState<{ win: boolean; amount: number } | null>(null);
  const [rouletteChoice, setRouletteChoice] = useState('red');

  const handleGamble = () => {
    const betAmt = Number(bet);
    if (!selectedGame || betAmt <= 0) return;
    const winnings = store.gamble(selectedGame, betAmt, rouletteChoice);
    setResult({ win: winnings > betAmt, amount: winnings - betAmt });
  };

  return (
    <SectionCard title="🎰 Casino">
      <p className="text-sm text-gray-400 mb-3">Try your luck at various games. Cash: <span className="text-green-400">${store.cash.toLocaleString()}</span></p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {casinoGames.map(game => (
          <button key={game.id} onClick={() => setSelectedGame(game.id)}
            className={`p-2 rounded text-center text-xs transition-colors ${selectedGame === game.id ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            <p className="font-bold">{game.name}</p>
            <p className="text-[10px] text-gray-400">{game.description}</p>
          </button>
        ))}
      </div>

      {selectedGame && (
        <div className="bg-gray-700 rounded p-3 space-y-2">
          <div className="flex gap-2 items-center">
            <label className="text-xs text-gray-400">Bet:</label>
            <input type="number" value={bet} onChange={e => setBet(e.target.value)} className="flex-1 px-2 py-1 bg-gray-600 rounded text-sm text-white" />
          </div>
          {selectedGame === 'roulette' && (
            <div className="flex gap-2">
              {['red', 'black', 'green'].map(c => (
                <button key={c} onClick={() => setRouletteChoice(c)}
                  className={`px-3 py-1 rounded text-xs capitalize ${rouletteChoice === c ? 'bg-amber-600' : 'bg-gray-600'} text-white`}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <button onClick={handleGamble} className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-sm">
            Play!
          </button>
          {result && (
            <p className={`text-center text-sm ${result.win ? 'text-green-400' : 'text-red-400'}`}>
              {result.win ? `You won $${result.amount}!` : `You lost $${Math.abs(result.amount)}!`}
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
}

function LoanSharkLocation() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [borrowAmt, setBorrowAmt] = useState('');
  const [repayAmt, setRepayAmt] = useState('');

  const maxLoan = Math.max(1000, store.level * 5000);
  const interestRate = 0.2;

  return (
    <SectionCard title="🦈 Loan Shark">
      <p className="text-sm text-gray-400 mb-3">Borrow money at high interest. Max loan: <span className="text-green-400">${maxLoan.toLocaleString()}</span></p>
      
      {ext.loanAmount > 0 && (
        <div className="bg-red-900/30 border border-red-800 rounded p-3 mb-3">
          <p className="text-red-300 text-sm font-bold">Outstanding Loan: ${ext.loanAmount.toLocaleString()}</p>
          <p className="text-red-400 text-xs">Due: ${Math.floor(ext.loanAmount * (1 + interestRate)).toLocaleString()} (20% interest)</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <input type="number" value={borrowAmt} onChange={e => setBorrowAmt(e.target.value)} placeholder="Amount" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
          <button onClick={() => { ext.takeLoan(Number(borrowAmt), maxLoan); setBorrowAmt(''); }} className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-sm">Borrow</button>
        </div>
        <div className="flex gap-2">
          <input type="number" value={repayAmt} onChange={e => setRepayAmt(e.target.value)} placeholder="Amount" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
          <button onClick={() => { ext.repayLoan(Number(repayAmt)); setRepayAmt(''); }} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-sm">Repay</button>
        </div>
      </div>
    </SectionCard>
  );
}

function ItemMarketLocation() {
  const store = useGameStore();
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'Melee', 'Primary', 'Secondary', 'Armor', 'Medical', 'Drug', 'Booster', 'Book'];

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <SectionCard title="🏪 Item Market">
      <p className="text-sm text-gray-400 mb-2">Buy and sell items. Cash: <span className="text-green-400">${store.cash.toLocaleString()}</span></p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-2 py-0.5 rounded text-[10px] capitalize ${filter === cat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filtered.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs">
            <div>
              <span className="text-white font-medium">{item.name}</span>
              <span className="text-gray-500 ml-2">{item.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">${item.price.toLocaleString()}</span>
              <button onClick={() => store.buyItem(item.id)} disabled={store.cash < item.price}
                className="px-2 py-0.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white rounded">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AuctionLocation() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const auctionItems = [
    { id: 'rare_pistol', name: 'Rare Golden Pistol', currentBid: 15000, bids: 5, timeLeft: '2h 30m', category: 'Weapon' },
    { id: 'rare_armor', name: 'Military Grade Armor', currentBid: 25000, bids: 3, timeLeft: '5h 15m', category: 'Armor' },
    { id: 'xanax_bulk', name: 'Xanax x10', currentBid: 12000, bids: 8, timeLeft: '1h 45m', category: 'Drug' },
    { id: 'rare_car', name: 'Vintage Sports Car', currentBid: 50000, bids: 2, timeLeft: '12h 00m', category: 'Vehicle' },
  ];

  return (
    <SectionCard title="🔨 Auction House">
      <p className="text-sm text-gray-400 mb-3">Bid on rare items from other players.</p>
      <div className="space-y-2">
        {auctionItems.map(item => (
          <div key={item.id} className="bg-gray-700 rounded p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-[10px] text-gray-400">{item.category} • {item.bids} bids • {item.timeLeft} left</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-sm">${item.currentBid.toLocaleString()}</p>
              <button onClick={() => { setMessage(`Bid placed on ${item.name}!`); }}
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] mt-1">Bid</button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-green-400 text-xs mt-2">{message}</p>}
    </SectionCard>
  );
}

function PointsMarketLocation() {
  const store = useGameStore();
  const [buyAmt, setBuyAmt] = useState('');
  const pointPrice = 50000; // $50k per point

  return (
    <SectionCard title="💎 Points Market">
      <p className="text-sm text-gray-400 mb-3">Buy points with cash. Current price: <span className="text-green-400">${pointPrice.toLocaleString()}/point</span></p>
      <div className="bg-gray-700 rounded p-3 mb-3 text-center">
        <p className="text-xs text-gray-400">Your Points</p>
        <p className="text-2xl font-bold text-purple-400">{store.points}</p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={buyAmt} onChange={e => setBuyAmt(e.target.value)} placeholder="Quantity" className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
        <button onClick={() => {
          const amt = Number(buyAmt);
          const cost = amt * pointPrice;
          if (store.cash >= cost) {
            useGameStore.setState({ cash: store.cash - cost, points: store.points + amt });
          }
          setBuyAmt('');
        }} className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">Buy Points</button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Points are used for: Bazaar, Display Cases, Racing License, Merits, and more.</p>
    </SectionCard>
  );
}

function HospitalLocation() {
  const store = useGameStore();

  return (
    <SectionCard title="🏥 Hospital">
      {store.inHospital ? (
        <div className="space-y-3">
          <div className="bg-red-900/30 border border-red-800 rounded p-4 text-center">
            <p className="text-red-300 font-bold text-lg">You're Hospitalized</p>
            <p className="text-gray-400 text-sm mt-1">Time remaining: {store.hospitalTimer} ticks</p>
            <p className="text-xs text-gray-500 mt-2">Life: {store.life}/{store.maxLife}</p>
          </div>
          <button onClick={() => store.revivePlayer()} disabled={store.energy < 10}
            className="w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium text-sm">
            Self-Revive (10 Energy)
          </button>
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-2">Medical supplies needed:</p>
            <div className="grid grid-cols-2 gap-2">
              {items.filter(i => i.category === 'Medical').map(item => (
                <button key={item.id} onClick={() => store.buyItem(item.id)}
                  className="bg-gray-600 hover:bg-gray-500 rounded p-2 text-xs text-left">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-green-400">+{item.effectValue} HP • ${item.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-900/30 border border-green-800 rounded p-4 text-center">
          <p className="text-green-300 font-bold">All Clear</p>
          <p className="text-gray-400 text-sm mt-1">You're healthy. Life: {store.life}/{store.maxLife}</p>
        </div>
      )}
    </SectionCard>
  );
}

function JailLocation() {
  const store = useGameStore();

  return (
    <SectionCard title="🔒 Jail">
      {store.inJail ? (
        <div className="space-y-3">
          <div className="bg-yellow-900/30 border border-yellow-800 rounded p-4 text-center">
            <p className="text-yellow-300 font-bold text-lg">You're in Jail</p>
            <p className="text-gray-400 text-sm mt-1">Time remaining: {store.jailTimer} ticks</p>
          </div>
          <p className="text-xs text-gray-500 text-center">Wait for your sentence to end or get busted by another player.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-900/30 border border-green-800 rounded p-4 text-center">
            <p className="text-green-300 font-bold">Not in Jail</p>
            <p className="text-gray-400 text-sm mt-1">You're a free citizen.</p>
          </div>
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-2">Jail Records</p>
            <p className="text-xs text-gray-500">Times jailed: {store.crimeLogs.filter(l => !l.success).length}</p>
            <p className="text-xs text-gray-500">Successful busts: 0</p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function MuseumLocation() {
  const ext = useExtendedStore();

  return (
    <SectionCard title="🏛️ Museum & Collections">
      <p className="text-sm text-gray-400 mb-3">Collect rare items and artifacts. Complete sets for rewards.</p>
      <div className="space-y-2">
        {collections.map(col => {
          const owned = ext.collections.includes(col.id);
          return (
            <div key={col.id} className={`rounded p-3 border ${owned ? 'bg-green-900/20 border-green-800' : 'bg-gray-700 border-gray-600'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">{col.icon} {col.name}</p>
                  <p className="text-[10px] text-gray-400">{col.description}</p>
                  <p className="text-[10px] text-amber-400">Value: ${col.value.toLocaleString()}</p>
                </div>
                {owned ? (
                  <span className="text-green-400 text-xs font-bold">✓ Owned</span>
                ) : (
                  <span className="text-gray-500 text-xs">Not found</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function DumpLocation() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleSearch = () => {
    if (store.energy < 1) { setMessage('Not enough energy!'); return; }
    useGameStore.setState({ energy: store.energy - 1 });
    
    const findChance = Math.random();
    if (findChance < 0.1) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const existing = store.inventory.find(i => i.itemId === randomItem.id);
      if (existing) {
        useGameStore.setState({ inventory: store.inventory.map(i => i.itemId === randomItem.id ? { ...i, quantity: i.quantity + 1 } : i) });
      } else {
        useGameStore.setState({ inventory: [...store.inventory, { itemId: randomItem.id, quantity: 1 }] });
      }
      setMessage(`Found: ${randomItem.name}!`);
    } else {
      setMessage('Found nothing useful this time.');
    }
  };

  return (
    <SectionCard title="🗑️ Dump">
      <p className="text-sm text-gray-400 mb-3">Search through the dump for discarded items. Costs 1 energy per search.</p>
      <button onClick={handleSearch} disabled={store.energy < 1}
        className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium text-sm">
        Search Dump (1 Energy)
      </button>
      {message && <p className="text-sm text-center mt-2 text-amber-300">{message}</p>}
    </SectionCard>
  );
}

function ShopsLocation() {
  const store = useGameStore();
  const [shop, setShop] = useState('general');

  const shopItems: Record<string, typeof items> = {
    general: items.filter(i => ['Candy', 'Medical', 'Booster'].includes(i.category)),
    gun: items.filter(i => ['Melee', 'Primary', 'Secondary', 'Temporary'].includes(i.category)),
    pharmacy: items.filter(i => i.category === 'Drug'),
    armor: items.filter(i => i.category === 'Armor'),
    clothing: [],
  };

  return (
    <SectionCard title="🛒 City Shops">
      <div className="flex flex-wrap gap-1 mb-3">
        {Object.keys(shopItems).map(s => (
          <button key={s} onClick={() => setShop(s)}
            className={`px-2 py-1 rounded text-xs capitalize ${shop === s ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
            {s === 'gun' ? 'Gun Shop' : s === 'general' ? 'General Store' : s}
          </button>
        ))}
      </div>
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {(shopItems[shop] || []).map(item => (
          <div key={item.id} className="flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs">
            <span className="text-white">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400">${item.price}</span>
              <button onClick={() => store.buyItem(item.id)} disabled={store.cash < item.price}
                className="px-2 py-0.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white rounded">Buy</button>
            </div>
          </div>
        ))}
        {(!shopItems[shop] || shopItems[shop].length === 0) && (
          <p className="text-gray-500 text-center py-4">This shop is currently empty.</p>
        )}
      </div>
    </SectionCard>
  );
}

function PostOfficeLocation() {
  return (
    <SectionCard title="📮 Post Office">
      <p className="text-sm text-gray-400 mb-3">Send items and messages to other players.</p>
      <div className="bg-gray-700 rounded p-4 text-center">
        <p className="text-gray-500 text-sm">Send items to friends and faction members</p>
        <p className="text-xs text-gray-600 mt-2">Cost: $500 per item sent</p>
      </div>
    </SectionCard>
  );
}

function ChurchLocation() {
  const store = useGameStore();
  const [message, setMessage] = useState('');

  const pray = () => {
    if (store.energy < 1) { setMessage('Not enough energy!'); return; }
    useGameStore.setState({ energy: store.energy - 1, happy: Math.min(store.maxHappy, store.happy + 5) });
    setMessage('You feel blessed. +5 Happy');
  };

  const confess = () => {
    if (store.nerve < 1) { setMessage('Not enough nerve!'); return; }
    useGameStore.setState({ nerve: store.nerve - 1, crimeSkill: store.crimeSkill - 0.05 });
    setMessage('You confessed your sins. Crime skill slightly decreased.');
  };

  return (
    <SectionCard title="⛪ Church">
      <p className="text-sm text-gray-400 mb-3">Find peace and forgiveness in Torn City.</p>
      <div className="space-y-2">
        <button onClick={pray} disabled={store.energy < 1}
          className="w-full py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
          Pray (1 Energy, +5 Happy)
        </button>
        <button onClick={confess} disabled={store.nerve < 1}
          className="w-full py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
          Confess Sins (1 Nerve, -Crime Skill)
        </button>
      </div>
      {message && <p className="text-sm text-center mt-2 text-blue-300">{message}</p>}
    </SectionCard>
  );
}

function CommunityLocation() {
  const store = useGameStore();
  const [tab, setTab] = useState<'events' | 'leaderboard' | 'forums'>('events');
  
  // Simulated leaderboard data
  const leaderboard = [
    { rank: 1, name: 'ShadowKing', level: 85, battles: 1247 },
    { rank: 2, name: 'NightHawk', level: 78, battles: 1089 },
    { rank: 3, name: 'IronFist', level: 72, battles: 956 },
    { rank: 4, name: 'GhostRider', level: 68, battles: 834 },
    { rank: 5, name: 'ThunderBolt', level: 65, battles: 721 },
  ];
  
  // Simulated forum posts
  const forumPosts = [
    { title: 'Best gym for beginners?', author: 'Newbie123', replies: 23 },
    { title: 'Faction recruitment - Dark Shadows', author: 'LeaderX', replies: 15 },
    { title: 'Stock market tips', author: 'TraderPro', replies: 42 },
    { title: 'Looking for OC team', author: 'CriminalMind', replies: 8 },
  ];
  
  return (
    <SectionCard title="👥 Community Center">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setTab('events')} className={`px-3 py-1 rounded text-xs ${tab === 'events' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Events</button>
        <button onClick={() => setTab('leaderboard')} className={`px-3 py-1 rounded text-xs ${tab === 'leaderboard' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Leaderboard</button>
        <button onClick={() => setTab('forums')} className={`px-3 py-1 rounded text-xs ${tab === 'forums' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Forums</button>
      </div>
      
      {tab === 'events' && (
        <div className="space-y-2">
          <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-700 rounded p-3">
            <p className="text-xs text-amber-400 font-bold">📢 City Event - Active Now!</p>
            <p className="text-xs text-gray-300 mt-1">Weekly XSS competition happening now! Top fighters win cash prizes.</p>
            <p className="text-[10px] text-gray-500 mt-1">Ends in: 2d 14h 32m</p>
          </div>
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700 rounded p-3">
            <p className="text-xs text-red-400 font-bold">🎉 Holiday Event</p>
            <p className="text-xs text-gray-300 mt-1">Special holiday items available in shops. Limited time only!</p>
            <p className="text-[10px] text-gray-500 mt-1">Ends in: 5d 8h 15m</p>
          </div>
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700 rounded p-3">
            <p className="text-xs text-purple-400 font-bold">🏆 Tournament</p>
            <p className="text-xs text-gray-300 mt-1">Faction warfare tournament starting soon. Register your faction!</p>
            <p className="text-[10px] text-gray-500 mt-1">Starts in: 1d 6h 45m</p>
          </div>
        </div>
      )}
      
      {tab === 'leaderboard' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-2">Top Fighters This Week</p>
          {leaderboard.map(player => (
            <div key={player.rank} className="flex items-center justify-between bg-gray-700 rounded p-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : player.rank === 3 ? 'text-amber-600' : 'text-gray-500'}`}>
                  #{player.rank}
                </span>
                <div>
                  <p className="text-xs text-white font-medium">{player.name}</p>
                  <p className="text-[10px] text-gray-500">Level {player.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-400 font-bold">{player.battles}</p>
                <p className="text-[10px] text-gray-500">battles</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tab === 'forums' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-2">Recent Forum Posts</p>
          {forumPosts.map((post, idx) => (
            <div key={idx} className="bg-gray-700 rounded p-2">
              <p className="text-xs text-white font-medium">{post.title}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-gray-500">by {post.author}</p>
                <p className="text-[10px] text-gray-500">{post.replies} replies</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ============ JOBS PAGE ============
function JobsPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'jobs' | 'company'>('jobs');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">💼 Jobs & Company</h2>
      
      <div className="flex gap-2">
        <button onClick={() => setTab('jobs')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'jobs' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>City Jobs</button>
        <button onClick={() => setTab('company')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'company' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Your Company</button>
      </div>

      {tab === 'jobs' && (
        <div className="space-y-3">
          {store.currentJob && (
            <SectionCard>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">Current Job: {jobs.find(j => j.id === store.currentJob)?.name}</p>
                  <p className="text-xs text-gray-400">Salary: ${jobs.find(j => j.id === store.currentJob)?.salary.toLocaleString()}/shift</p>
                </div>
                <button onClick={() => store.workJob()} disabled={store.energy < 5}
                  className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
                  Work (5 EN)
                </button>
              </div>
            </SectionCard>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {jobs.map(job => {
              const meetsReqs = store.level >= job.levelReq &&
                (!job.statReq.manualLabor || store.manualLabor >= job.statReq.manualLabor) &&
                (!job.statReq.intelligence || store.intelligence >= job.statReq.intelligence) &&
                (!job.statReq.endurance || store.endurance >= job.statReq.endurance);
              const isCurrent = store.currentJob === job.id;
              
              return (
                <div key={job.id} className={`bg-gray-800 rounded-lg p-3 border ${isCurrent ? 'border-green-700' : meetsReqs ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-white">{job.name}</p>
                      <p className="text-[10px] text-gray-400">{job.company} • Lvl {job.levelReq}+</p>
                      <p className="text-xs text-green-400">${job.salary.toLocaleString()}/shift</p>
                      <div className="flex gap-1 mt-1">
                        {job.statReq.manualLabor ? <span className="text-[9px] bg-orange-900/50 text-orange-300 px-1 rounded">ML:{job.statReq.manualLabor}</span> : null}
                        {job.statReq.intelligence ? <span className="text-[9px] bg-cyan-900/50 text-cyan-300 px-1 rounded">INT:{job.statReq.intelligence}</span> : null}
                        {job.statReq.endurance ? <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-1 rounded">END:{job.statReq.endurance}</span> : null}
                      </div>
                    </div>
                    {!isCurrent && (
                      <button onClick={() => meetsReqs && store.applyJob(job.id)} disabled={!meetsReqs}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-[10px]">
                        Apply
                      </button>
                    )}
                    {isCurrent && <span className="text-green-400 text-[10px] font-bold">✓ Active</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'company' && (
        <div className="space-y-3">
          {ext.companyOwned ? (
            <SectionCard title={`🏢 ${ext.companyName}`}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="text-white font-bold">{ext.companyType}</p>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-xs text-gray-400">Stars</p>
                  <p className="text-amber-400 font-bold">{'⭐'.repeat(ext.companyStars)}</p>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-xs text-gray-400">Employees</p>
                  <p className="text-white font-bold">{ext.companyEmployees}/10</p>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-xs text-gray-400">Daily Profit</p>
                  <p className="text-green-400 font-bold">${ext.companyProfit.toLocaleString()}</p>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="🏢 Start a Company">
              <p className="text-sm text-gray-400 mb-3">Own one of 39 company types. Requires $500,000 and Level 10+.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {companies.slice(0, 9).map(comp => (
                  <div key={comp.id} className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs font-bold text-white">{comp.icon} {comp.name}</p>
                    <p className="text-[10px] text-gray-400">{comp.type}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                if (store.cash >= 500000 && store.level >= 10) {
                  ext.startCompany('My Company', companies[0].type);
                }
              }} disabled={store.cash < 500000 || store.level < 10}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm font-medium">
                Buy Company ($500,000)
              </button>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}

// ============ GYM PAGE ============
function GymPage() {
  const store = useGameStore();
  const [selectedGym, setSelectedGym] = useState('basic');
  const [message, setMessage] = useState('');

  const gym = gyms.find(g => g.id === selectedGym);
  const canUseGym = gym && store.level >= gym.levelReq && (!gym.statReq || Math.max(store.strength, store.speed, store.defense, store.dexterity) >= gym.statReq);

  const handleTrain = (stat: 'strength' | 'speed' | 'defense' | 'dexterity') => {
    if (store.energy < 5) { setMessage('Not enough energy!'); return; }
    if (!canUseGym) { setMessage('Requirements not met for this gym!'); return; }
    store.trainStat(stat, selectedGym);
    setMessage(`Trained ${stat}!`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">💪 Gym</h2>
      <p className="text-gray-400 text-sm">Train your battle stats. Each session costs 5 energy.</p>

      {/* Gym Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {gyms.map(g => {
          const available = store.level >= g.levelReq && (!g.statReq || Math.max(store.strength, store.speed, store.defense, store.dexterity) >= g.statReq);
          return (
            <button key={g.id} onClick={() => setSelectedGym(g.id)}
              className={`p-3 rounded-lg text-left border transition-colors ${
                selectedGym === g.id ? 'bg-amber-600/20 border-amber-600' :
                available ? 'bg-gray-800 border-gray-700 hover:border-gray-500' : 'bg-gray-800 border-gray-800 opacity-50'
              }`}>
              <p className="text-sm font-bold text-white">{g.name}</p>
              <p className="text-[10px] text-gray-400">Multiplier: x{g.multiplier}</p>
              <p className="text-[10px] text-gray-500">Lvl {g.levelReq}+ {g.statReq ? `• ${g.statReq}+ stat` : ''}</p>
            </button>
          );
        })}
      </div>

      {/* Training Buttons */}
      <SectionCard title={`Training at: ${gym?.name || 'Basic Gym'} (x${gym?.multiplier || 1})`}>
        <div className="grid grid-cols-2 gap-3">
          {([
            { stat: 'strength' as const, label: 'Strength', icon: '💪', color: 'bg-red-700 hover:bg-red-600', current: store.strength },
            { stat: 'speed' as const, label: 'Speed', icon: '⚡', color: 'bg-blue-700 hover:bg-blue-600', current: store.speed },
            { stat: 'defense' as const, label: 'Defense', icon: '🛡️', color: 'bg-green-700 hover:bg-green-600', current: store.defense },
            { stat: 'dexterity' as const, label: 'Dexterity', icon: '🎯', color: 'bg-yellow-700 hover:bg-yellow-600', current: store.dexterity },
          ]).map(s => (
            <button key={s.stat} onClick={() => handleTrain(s.stat)} disabled={store.energy < 5 || !canUseGym}
              className={`${s.color} disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg p-4 text-center transition-colors`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="font-bold text-sm mt-1">{s.label}</p>
              <p className="text-xs opacity-75">Current: {s.current}</p>
            </button>
          ))}
        </div>
        {message && <p className="text-sm text-center mt-3 text-amber-300">{message}</p>}
      </SectionCard>
    </div>
  );
}

// ============ CRIMES PAGE (Crimes + Combat + Organized Crime) ============
function CrimesPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'crimes' | 'combat' | 'organized'>('crimes');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🔫 Crimes & Combat</h2>
      
      <div className="flex gap-2">
        <button onClick={() => setTab('crimes')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'crimes' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Crimes</button>
        <button onClick={() => setTab('combat')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'combat' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Combat</button>
        <button onClick={() => setTab('organized')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'organized' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Organized Crime</button>
      </div>

      {tab === 'crimes' && (
        <div className="space-y-2">
          <div className="bg-gray-800 rounded p-3 border border-gray-700 flex justify-between items-center text-sm">
            <span className="text-gray-400">Crime Skill: <span className="text-amber-400 font-bold">{store.crimeSkill.toFixed(1)}</span></span>
            <span className="text-gray-400">Nerve: <span className="text-orange-400 font-bold">{store.nerve}/{store.maxNerve}</span></span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {crimes.map(crime => {
              const canDo = store.nerve >= crime.nerveCost && store.level >= crime.levelReq && !store.inHospital && !store.inJail;
              const successChance = Math.min(95, Math.max(5, 50 + store.crimeSkill * 2 - crime.difficulty + store.dexterity * 0.5));
              
              return (
                <div key={crime.id} className={`bg-gray-800 rounded-lg p-3 border ${canDo ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-white">{crime.name}</p>
                      <p className="text-[10px] text-gray-400">{crime.category} • Lvl {crime.levelReq}+</p>
                      <div className="flex gap-2 mt-1 text-[10px]">
                        <span className="text-orange-400">NV: {crime.nerveCost}</span>
                        <span className="text-green-400">${crime.minCash}-${crime.maxCash}</span>
                        <span className="text-blue-400">{successChance.toFixed(0)}%</span>
                      </div>
                    </div>
                    <button onClick={() => canDo && store.commitCrime(crime.id)} disabled={!canDo}
                      className="px-3 py-1.5 bg-orange-700 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs font-medium">
                      Commit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'combat' && <CombatSection />}

      {tab === 'organized' && (
        <div className="space-y-3">
          {!store.factionName ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-300">You need to join a faction to participate in Organized Crimes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {organizedCrimes.map(oc => {
                const canDo = store.level >= oc.levelReq && store.factionName !== null;
                return (
                  <div key={oc.id} className={`bg-gray-800 rounded-lg p-3 border ${canDo ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
                    <p className="text-sm font-bold text-white">{oc.name}</p>
                    <p className="text-[10px] text-gray-400">Tier: {oc.tier} • Lvl {oc.levelReq}+ • {oc.members} members needed</p>
                    <div className="flex gap-2 mt-1 text-[10px]">
                      <span className="text-green-400">${oc.minReward.toLocaleString()}-${oc.maxReward.toLocaleString()}</span>
                      <span className="text-purple-400">+{oc.respect} respect</span>
                    </div>
                    <button onClick={() => canDo && ext.startOC(oc.id)} disabled={!canDo}
                      className="mt-2 w-full px-2 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs">
                      Plan Operation
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============ COMBAT PAGE (Added to Crimes section) ============
function CombatSection() {
  const store = useGameStore();
  const [message, setMessage] = useState('');
  const [combatResult, setCombatResult] = useState<string | null>(null);

  const handleAttack = (enemyId: string, type: 'mug' | 'hospitalize' | 'leave') => {
    if (store.energy < 5) {
      setMessage('Not enough energy!');
      return;
    }
    if (store.inHospital || store.inJail) {
      setMessage('Cannot attack while in hospital or jail!');
      return;
    }
    
    store.attackPlayer(enemyId, type);
    const enemy = npcEnemies.find(e => e.id === enemyId);
    setCombatResult(`Attacked ${enemy?.name} (${type})`);
    setTimeout(() => setCombatResult(null), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded p-3 border border-gray-700 flex justify-between items-center text-sm">
        <span className="text-gray-400">Battle Power: <span className="text-amber-400 font-bold">{store.strength + store.speed + store.defense + store.dexterity}</span></span>
        <span className="text-gray-400">Energy: <span className="text-green-400 font-bold">{store.energy}/{store.maxEnergy}</span></span>
      </div>

      {combatResult && (
        <div className="bg-blue-900/30 border border-blue-800 rounded p-2 text-center">
          <p className="text-blue-300 text-sm">{combatResult}</p>
        </div>
      )}

      {message && (
        <div className="bg-red-900/30 border border-red-800 rounded p-2 text-center">
          <p className="text-red-300 text-sm">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {npcEnemies.map(enemy => {
          const canAttack = store.energy >= 5 && !store.inHospital && !store.inJail;
          const powerDiff = (store.strength + store.speed + store.defense + store.dexterity) - (enemy.strength + enemy.speed + enemy.defense + enemy.dexterity);
          const difficulty = powerDiff > 100 ? 'Easy' : powerDiff > 0 ? 'Medium' : powerDiff > -100 ? 'Hard' : 'Very Hard';
          const diffColor = powerDiff > 100 ? 'text-green-400' : powerDiff > 0 ? 'text-yellow-400' : powerDiff > -100 ? 'text-orange-400' : 'text-red-400';
          
          return (
            <div key={enemy.id} className={`bg-gray-800 rounded-lg p-3 border ${canAttack ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-white">{enemy.name}</p>
                  <p className="text-[10px] text-gray-400">Level {enemy.level} • {difficulty}</p>
                </div>
                <span className={`text-[10px] font-bold ${diffColor}`}>{difficulty}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] mb-2">
                <span className="text-red-400">STR: {enemy.strength}</span>
                <span className="text-blue-400">SPD: {enemy.speed}</span>
                <span className="text-green-400">DEF: {enemy.defense}</span>
                <span className="text-yellow-400">DEX: {enemy.dexterity}</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">Weapon: {enemy.weapon} • HP: {enemy.life}</p>
              <div className="flex gap-1">
                <button onClick={() => handleAttack(enemy.id, 'leave')} disabled={!canAttack}
                  className="flex-1 px-2 py-1 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-[10px]">
                  Leave
                </button>
                <button onClick={() => handleAttack(enemy.id, 'mug')} disabled={!canAttack}
                  className="flex-1 px-2 py-1 bg-orange-700 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-[10px]">
                  Mug
                </button>
                <button onClick={() => handleAttack(enemy.id, 'hospitalize')} disabled={!canAttack}
                  className="flex-1 px-2 py-1 bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-[10px]">
                  Hosp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ TRAVEL PAGE ============
function TravelPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  if (store.level < 15) {
    return (
      <SectionCard title="✈️ Travel Agency">
        <p className="text-gray-400 text-center py-4">Travel unlocks at Level 15. Current: Level {store.level}</p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">✈️ Travel</h2>
      
      {store.isTraveling ? (
        <SectionCard>
          <div className="text-center py-4">
            <p className="text-blue-300 font-bold text-lg">✈️ In Flight</p>
            <p className="text-gray-400 text-sm mt-1">Flying to {destinations.find(d => d.id === store.travelDestination)?.name}</p>
            <p className="text-amber-400 font-bold mt-2">{store.travelTimer} ticks remaining</p>
          </div>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-sm font-bold text-white">{dest.name}</p>
              <p className="text-[10px] text-gray-400">Flight: {dest.flightTime} min • ${dest.cost}</p>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {dest.items.map(item => (
                  <span key={item} className="text-[9px] bg-gray-700 px-1 rounded text-gray-400">{item}</span>
                ))}
              </div>
              <button onClick={() => { store.travel(dest.id); setMessage(`Flying to ${dest.name}!`); }}
                className="mt-2 w-full px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs">
                Fly (${dest.cost})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Racing (available while traveling or at home) */}
      {ext.racingLicense && (
        <SectionCard title="🏎️ Racing" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-2">Your Car: {ext.racingCar ? cars.find(c => c.id === ext.racingCar)?.name : 'None'}</p>
              <p className="text-xs text-gray-400">Racing Skill: {ext.racingSkill}</p>
              <div className="space-y-1 mt-2">
                {raceTracks.slice(0, 4).map(track => (
                  <button key={track.id} onClick={() => ext.startRace(track.id)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded p-2 text-xs">
                    <span className="text-white">{track.name}</span>
                    <span className="text-gray-400 ml-2">({track.difficulty})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Available Cars:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cars.map(car => (
                  <div key={car.id} className="flex justify-between bg-gray-700/50 rounded p-2 text-xs">
                    <span className="text-white">{car.name}</span>
                    <button onClick={() => ext.buyCar(car.id)} disabled={store.cash < car.price}
                      className="text-green-400">${car.price.toLocaleString()}</button>
                  </div>
                ))}
              </div>
              {!ext.racingLicense && (
                <button onClick={() => {
                  if (store.points >= 1) {
                    useExtendedStore.setState({ racingLicense: true });
                    useGameStore.setState({ points: store.points - 1 });
                  }
                }} className="mt-2 w-full py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs">
                  Buy Racing License (1 Point)
                </button>
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Hunting (South Africa) */}
      {store.travelDestination === 'south_africa' && !store.isTraveling && (
        <SectionCard title="🦁 Hunting" className="mt-4">
          <p className="text-xs text-gray-400 mb-2">Hunt animals in South Africa for cash and experience.</p>
          <div className="grid grid-cols-2 gap-2">
            {huntAnimals.map(animal => (
              <button key={animal.id} onClick={() => ext.hunt(animal.id)} disabled={store.energy < animal.energyCost}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded p-2 text-xs text-left">
                <p className="text-white font-bold">{animal.icon} {animal.name}</p>
                <p className="text-gray-400">{animal.energyCost} EN • ${animal.minReward}-${animal.maxReward}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      )}

      {message && <p className="text-blue-300 text-sm text-center">{message}</p>}
    </div>
  );
}

// ============ EDUCATION PAGE ============
function EducationPage() {
  const store = useGameStore();
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(courses.map(c => c.category))];
  const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">📚 Education</h2>
      
      {store.inEducation && (
        <SectionCard>
          <div className="bg-purple-900/30 border border-purple-800 rounded p-3 text-center">
            <p className="text-purple-300 font-bold">Currently Studying</p>
            <p className="text-white text-sm">{courses.find(c => c.id === store.educationCourse)?.name}</p>
            <p className="text-gray-400 text-xs mt-1">Time remaining: {store.educationTimer} ticks</p>
          </div>
        </SectionCard>
      )}

      <div className="flex flex-wrap gap-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-2 py-1 rounded text-[10px] capitalize ${filter === cat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map(course => {
          const canStart = !store.inEducation && store.cash >= course.cost && store.level >= course.levelReq && !store.inHospital && !store.inJail;
          return (
            <div key={course.id} className={`bg-gray-800 rounded-lg p-3 border ${canStart ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-white">{course.name}</p>
                  <p className="text-[10px] text-gray-400">{course.category} • {course.duration}h • Lvl {course.levelReq}+</p>
                  {course.statBonus && <p className="text-[10px] text-green-400">+{course.bonusAmount} {course.statBonus}</p>}
                  <p className="text-xs text-green-400 mt-1">${course.cost.toLocaleString()}</p>
                </div>
                <button onClick={() => canStart && store.startEducation(course.id)} disabled={!canStart}
                  className="px-2 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs">
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

// ============ PROPERTIES PAGE ============
function PropertiesPage() {
  const store = useGameStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🏠 Properties</h2>
      
      {store.currentProperty && (
        <SectionCard>
          <div className="bg-green-900/20 border border-green-800 rounded p-3 text-center">
            <p className="text-green-300 font-bold">Current Property</p>
            <p className="text-white">{properties.find(p => p.id === store.currentProperty)?.name}</p>
          </div>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {properties.map(prop => {
          const canBuy = store.cash >= prop.price && store.level >= prop.levelReq;
          const owned = store.currentProperty === prop.id;
          return (
            <div key={prop.id} className={`bg-gray-800 rounded-lg p-4 border ${owned ? 'border-green-700' : canBuy ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{prop.name} {owned && <span className="text-green-400 text-xs">(Owned)</span>}</p>
                  <p className="text-xs text-gray-400">Max Happy: {prop.maxHappy} • Upkeep: ${prop.upkeep}/day • Lvl {prop.levelReq}+</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prop.benefits.map(b => (
                      <span key={b} className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-300">{b}</span>
                    ))}
                  </div>
                </div>
                {!owned && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-sm">${prop.price.toLocaleString()}</p>
                    <button onClick={() => canBuy && store.buyProperty(prop.id)} disabled={!canBuy}
                      className="mt-1 px-3 py-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs">Buy</button>
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

// ============ FACTION PAGE ============
function FactionPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'info' | 'warfare' | 'forum'>('info');
  const [factionNameInput, setFactionNameInput] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🏴 Faction</h2>

      {!store.factionName ? (
        <SectionCard title="Join or Create a Faction">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input type="text" value={factionNameInput} onChange={e => setFactionNameInput(e.target.value)} placeholder="Faction name..."
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white" />
              <button onClick={() => {
                if (factionNameInput.trim()) {
                  store.joinFaction(factionNameInput.trim());
                  setMessage(`Joined ${factionNameInput}!`);
                  setFactionNameInput('');
                }
              }} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm">Join</button>
            </div>
            <button onClick={() => {
              if (store.cash >= 50000 && factionNameInput.trim()) {
                store.createFaction(factionNameInput.trim());
                setMessage(`Created faction: ${factionNameInput}!`);
                setFactionNameInput('');
              }
            }} disabled={store.cash < 50000}
              className="w-full py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
              Create New Faction ($50,000)
            </button>
          </div>
          {message && <p className="text-green-400 text-xs mt-2">{message}</p>}
        </SectionCard>
      ) : (
        <>
          <div className="flex gap-2">
            {(['info', 'warfare', 'forum'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-medium capitalize ${tab === t ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div className="space-y-3">
              <SectionCard title={`🏴 ${store.factionName}`}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Rank</p>
                    <p className="text-amber-400 font-bold">{store.factionRank}</p>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Respect</p>
                    <p className="text-white font-bold">{store.factionRespect}</p>
                  </div>
                </div>
              </SectionCard>

              {/* Territory */}
              <SectionCard title="🗺️ Territory">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {territories.map(terr => {
                    const controlled = ext.factionTerritories.find(t => t.territoryId === terr.id)?.controlled;
                    return (
                      <div key={terr.id} className={`rounded p-2 text-xs border ${controlled ? 'bg-green-900/30 border-green-800' : 'bg-gray-700 border-gray-600'}`}>
                        <p className="font-bold text-white">{terr.name}</p>
                        <p className="text-gray-400">{terr.size} blocks • Racket: {terr.racket}</p>
                        {controlled ? (
                          <span className="text-green-400 text-[10px]">✓ Controlled</span>
                        ) : (
                          <button onClick={() => ext.claimTerritory(terr.id)} className="mt-1 px-2 py-0.5 bg-red-700 hover:bg-red-600 text-white rounded text-[10px]">Attack</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Chain */}
              <SectionCard title="⛓️ Chain">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">{ext.chainCount}</p>
                  <p className="text-xs text-gray-400">Current chain hits</p>
                  <p className="text-xs text-gray-500 mt-1">Timer: {ext.chainTimer > 0 ? `${ext.chainTimer} ticks` : 'Inactive'}</p>
                  <button onClick={() => ext.addToChain()} className="mt-2 px-4 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs">
                    Add Hit to Chain
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {tab === 'warfare' && (
            <SectionCard title="💥 Warfare">
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-sm font-bold text-white">Ranked War</p>
                  <p className="text-xs text-gray-400">Compete against other factions for respect and rewards.</p>
                  <button onClick={() => ext.startRankedWar()} className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs">
                    Enlist in War
                  </button>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-sm font-bold text-white">Raid</p>
                  <p className="text-xs text-gray-400">Attack enemy factions to destroy their respect.</p>
                  <button onClick={() => ext.startRaid()} className="mt-2 px-3 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded text-xs">
                    Declare Raid
                  </button>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-sm font-bold text-white">💣 Dirty Bomb</p>
                  <p className="text-xs text-gray-400">Devastating weapon. Reduces enemy respect, causes radiation.</p>
                  <button onClick={() => ext.useDirtyBomb()} disabled={store.cash < 100000}
                    className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-xs">
                    Deploy ($100,000)
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {tab === 'forum' && (
            <SectionCard title="💬 Faction Forum">
              <div className="space-y-2">
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-xs text-amber-400 font-bold">Leader</p>
                  <p className="text-xs text-gray-300">Welcome to the faction! Stay active and participate in OCs and wars.</p>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-xs text-blue-400 font-bold">War Coordinator</p>
                  <p className="text-xs text-gray-300">Next territory war starts in 2 hours. Be ready!</p>
                </div>
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

// ============ MESSAGES PAGE ============
function MessagesPage() {
  const [messages] = useState([
    { id: 1, from: 'System', subject: 'Welcome to Torn City!', body: 'Welcome! Start by training at the gym and committing small crimes.', time: 'Just now', read: false },
    { id: 2, from: 'Bank', subject: 'Bank Account Opened', body: 'Your bank account has been opened. Deposit cash to earn interest.', time: '1m ago', read: false },
    { id: 3, from: 'Faction', subject: 'Faction Invitation', body: 'You have been invited to join a faction. Visit the Faction page to accept.', time: '5m ago', read: true },
  ]);
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">✉️ Messages</h2>
      
      {selectedMsg ? (
        <SectionCard>
          <button onClick={() => setSelectedMsg(null)} className="text-xs text-amber-400 mb-2">← Back to inbox</button>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm font-bold text-white">{messages.find(m => m.id === selectedMsg)?.subject}</p>
            <p className="text-xs text-gray-400">From: {messages.find(m => m.id === selectedMsg)?.from}</p>
            <p className="text-sm text-gray-300 mt-3">{messages.find(m => m.id === selectedMsg)?.body}</p>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Inbox">
          <div className="space-y-1">
            {messages.map(msg => (
              <button key={msg.id} onClick={() => setSelectedMsg(msg.id)}
                className={`w-full text-left bg-gray-700 hover:bg-gray-600 rounded p-3 flex justify-between items-center ${!msg.read ? 'border-l-2 border-amber-500' : ''}`}>
                <div>
                  <p className={`text-sm ${!msg.read ? 'font-bold text-white' : 'text-gray-300'}`}>{msg.subject}</p>
                  <p className="text-[10px] text-gray-400">From: {msg.from} • {msg.time}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'overview' | 'stats' | 'merits' | 'awards' | 'combat_log'>('overview');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">👤 Profile</h2>

      <div className="flex flex-wrap gap-2">
        {(['overview', 'stats', 'merits', 'awards', 'combat_log'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize ${tab === t ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {t === 'combat_log' ? 'Combat Log' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          <SectionCard>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">👤</div>
              <div>
                <h3 className="text-lg font-bold text-white">{store.name}</h3>
                <p className="text-amber-400 text-sm">Level {store.level} • {store.rank}</p>
                <p className="text-xs text-gray-400">Age: {store.age} days</p>
              </div>
            </div>
          </SectionCard>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-gray-800 rounded p-2 border border-gray-700">
              <p className="text-green-400 font-bold">${store.cash.toLocaleString()}</p>
              <p className="text-gray-500">Cash</p>
            </div>
            <div className="bg-gray-800 rounded p-2 border border-gray-700">
              <p className="text-blue-400 font-bold">${store.bank.toLocaleString()}</p>
              <p className="text-gray-500">Bank</p>
            </div>
            <div className="bg-gray-800 rounded p-2 border border-gray-700">
              <p className="text-purple-400 font-bold">{store.points}</p>
              <p className="text-gray-500">Points</p>
            </div>
            <div className="bg-gray-800 rounded p-2 border border-gray-700">
              <p className="text-amber-400 font-bold">{store.factionName || 'None'}</p>
              <p className="text-gray-500">Faction</p>
            </div>
          </div>

          <SectionCard title="Equipment">
            <div className="space-y-1 text-sm">
              <StatusRow label="Weapon" value={items.find(i => i.id === store.equippedWeapon)?.name || 'Fists'} />
              <StatusRow label="Armor" value={store.equippedArmor ? items.find(i => i.id === store.equippedArmor)?.name || 'None' : 'None'} />
              <StatusRow label="Property" value={store.currentProperty ? properties.find(p => p.id === store.currentProperty)?.name || 'None' : 'None'} />
              <StatusRow label="Job" value={store.currentJob ? jobs.find(j => j.id === store.currentJob)?.name || 'None' : 'Unemployed'} />
              <StatusRow label="Married" value={ext.marriedTo || 'No'} />
            </div>
          </SectionCard>

          <SectionCard>
            <button onClick={() => store.resetGame()} className="w-full py-2 bg-red-800 hover:bg-red-700 text-white rounded text-sm">
              Reset Character
            </button>
          </SectionCard>
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-3">
          <SectionCard title="⚔️ Battle Stats">
            <div className="space-y-2">
              <StatBar label="Strength" value={store.strength} color="bg-red-500" />
              <StatBar label="Speed" value={store.speed} color="bg-blue-500" />
              <StatBar label="Defense" value={store.defense} color="bg-green-500" />
              <StatBar label="Dexterity" value={store.dexterity} color="bg-yellow-500" />
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700 text-sm">
              <span className="text-gray-400">Total Battle Power: </span>
              <span className="text-amber-400 font-bold">{(store.strength + store.speed + store.defense + store.dexterity).toLocaleString()}</span>
            </div>
          </SectionCard>

          <SectionCard title="💼 Working Stats">
            <div className="space-y-2">
              <StatBar label="Manual Labor" value={store.manualLabor} color="bg-orange-500" />
              <StatBar label="Intelligence" value={store.intelligence} color="bg-cyan-500" />
              <StatBar label="Endurance" value={store.endurance} color="bg-emerald-500" />
            </div>
          </SectionCard>

          <SectionCard title="📊 History">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <StatusRow label="Total Attacks" value={store.totalAttacks.toString()} />
              <StatusRow label="Total Crimes" value={store.totalCrimes.toString()} />
              <StatusRow label="Mugs" value={store.totalMugs.toString()} />
              <StatusRow label="Hospitalized" value={store.totalHospitalized.toString()} />
              <StatusRow label="Total XP" value={store.totalXpGained.toString()} />
              <StatusRow label="Total Earned" value={`$${store.totalCashEarned.toLocaleString()}`} />
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'merits' && (
        <div className="space-y-3">
          <SectionCard>
            <div className="text-center mb-3">
              <p className="text-xs text-gray-400">Available Merit Points</p>
              <p className="text-2xl font-bold text-amber-400">{store.meritPoints}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'strength', name: 'Strength', desc: '+5 STR', icon: '💪' },
                { id: 'defense', name: 'Defense', desc: '+5 DEF', icon: '🛡️' },
                { id: 'speed', name: 'Speed', desc: '+5 SPD', icon: '⚡' },
                { id: 'dexterity', name: 'Dexterity', desc: '+5 DEX', icon: '🎯' },
                { id: 'life', name: 'Life', desc: '+20 HP', icon: '❤️' },
                { id: 'energy', name: 'Energy', desc: '+5 EN', icon: '🔋' },
                { id: 'nerve', name: 'Nerve', desc: '+5 NV', icon: '🧠' },
                { id: 'happy', name: 'Happy', desc: '+10 HP', icon: '😊' },
                { id: 'crime', name: 'Crime', desc: '+1 Skill', icon: '🔫' },
              ].map(m => (
                <div key={m.id} className="bg-gray-700 rounded p-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{m.icon} {m.name}</p>
                    <p className="text-[10px] text-gray-400">{m.desc} • Current: {store.merits[m.id as keyof typeof store.merits]}</p>
                  </div>
                  <button onClick={() => store.allocateMerit(m.id)} disabled={store.meritPoints <= 0}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white rounded text-xs">+1</button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'awards' && (
        <SectionCard title="🏆 Awards">
          <div className="space-y-2">
            {awards.map(award => {
              const earned = ext.awards.includes(award.id);
              return (
                <div key={award.id} className={`rounded p-2 border flex justify-between items-center ${earned ? 'bg-amber-900/20 border-amber-800' : 'bg-gray-700 border-gray-600'}`}>
                  <div>
                    <p className="text-xs font-bold text-white">{award.icon} {award.name}</p>
                    <p className="text-[10px] text-gray-400">{award.description}</p>
                  </div>
                  {earned ? <span className="text-amber-400 text-xs">✓</span> : <span className="text-gray-500 text-[10px]">Locked</span>}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {tab === 'combat_log' && (
        <SectionCard title="📜 Combat & Crime Log">
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {store.combatLogs.map(log => (
              <div key={log.id} className={`p-2 rounded text-xs ${log.result === 'win' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                <span className={log.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                  {log.result === 'win' ? '✅' : '❌'} {log.type} vs {log.target}
                </span>
                <span className="text-gray-500 ml-2">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
            {store.crimeLogs.map(log => (
              <div key={log.id} className={`p-2 rounded text-xs ${log.success ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                <span className={log.success ? 'text-green-400' : 'text-red-400'}>
                  {log.success ? '✅' : '❌'} {log.crimeName} {log.success && `+$${log.reward}`}
                </span>
                <span className="text-gray-500 ml-2">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
            {store.combatLogs.length === 0 && store.crimeLogs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No combat or crime history yet.</p>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxDisplay = Math.max(value, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(100, (value / maxDisplay) * 100)}%` }} />
      </div>
      <span className="text-xs text-white font-mono w-14 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

export default App;
