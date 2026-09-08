import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from './store';
import { useExtendedStore } from './store2';
import { crimes, gyms, courses, jobs, items, npcEnemies, stocks, properties, destinations, casinoGames } from './data';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, missions, awards, companies, bounties, collections, viruses, marriageCandidates } from './data2';

type MainSection = 'home' | 'items' | 'city' | 'jobs' | 'gym' | 'crimes' | 'travel' | 'education' | 'properties' | 'faction' | 'messages' | 'profile';
type CityLocation = 'bank' | 'casino' | 'loan_shark' | 'item_market' | 'stock_market' | 'auction' | 'points_market' | 'hospital' | 'jail' | 'museum' | 'dump' | 'shops' | 'post_office' | 'church' | 'community';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

// Global notification state
let globalNotifications: Notification[] = [];
let notificationListeners: (() => void)[] = [];

function addNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const notification: Notification = {
    id: Date.now().toString() + Math.random(),
    message,
    type,
    timestamp: Date.now()
  };
  globalNotifications = [notification, ...globalNotifications].slice(0, 5);
  notificationListeners.forEach(fn => fn());
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    globalNotifications = globalNotifications.filter(n => n.id !== notification.id);
    notificationListeners.forEach(fn => fn());
  }, 3000);
}

function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(globalNotifications);
  
  useEffect(() => {
    const listener = () => setNotifications([...globalNotifications]);
    notificationListeners.push(listener);
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== listener);
    };
  }, []);
  
  return notifications;
}

function FloatingNotifications() {
  const notifications = useNotifications();
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`p-3 rounded-lg shadow-lg border animate-slide-in ${
            notif.type === 'success' ? 'bg-green-900/95 border-green-700 text-green-100' :
            notif.type === 'error' ? 'bg-red-900/95 border-red-700 text-red-100' :
            'bg-blue-900/95 border-blue-700 text-blue-100'
          }`}
        >
          <p className="text-sm font-medium">{notif.message}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [section, setSection] = useState<MainSection>('home');
  const [cityLocation, setCityLocation] = useState<CityLocation | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const store = useGameStore();
  const ext = useExtendedStore();

  useEffect(() => {
    const interval = setInterval(() => {
      store.tick();
      ext.tick();
    }, 1000); // 1 tick = 1 second (real-time)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (store.name === 'Player') setShowNameModal(true);
  }, []);

  const handleCityNav = (loc: CityLocation | null) => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {showNameModal && <NameModal onClose={() => setShowNameModal(false)} />}

      {/* Top Status Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-amber-400">🌃 TORN</span>
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">Lv.{store.level}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{store.rank}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MiniBar label="Life" value={store.life} max={store.maxLife} color="bg-red-500" icon="❤️" />
              <MiniBar label="Energy" value={store.energy} max={store.maxEnergy} color="bg-green-500" icon="⚡" />
              <MiniBar label="Nerve" value={store.nerve} max={store.maxNerve} color="bg-orange-500" icon="🧠" />
              <MiniBar label="Happy" value={store.happy} max={store.maxHappy} color="bg-pink-500" icon="😊" />
              <div className="hidden md:flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded">
                <span className="text-xs text-gray-400">💰</span>
                <span className="text-sm text-green-400 font-mono font-bold">${store.cash.toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Status Timers */}
          {(store.inHospital || store.inJail || store.isTraveling || store.inEducation || ext.racingActive || store.bankInvestment > 0) && (
            <div className="flex gap-2 mt-2 text-[10px] overflow-x-auto scrollbar-hide">
              {store.inHospital && (
                <span className="bg-red-900/80 text-red-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-red-700">
                  <span>🏥</span>
                  <span className="font-semibold">Hospital</span>
                  <span className="font-bold font-mono bg-red-800 px-1.5 py-0.5 rounded">{store.hospitalTimer}</span>
                </span>
              )}
              {store.inJail && (
                <span className="bg-yellow-900/80 text-yellow-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-yellow-700">
                  <span>🔒</span>
                  <span className="font-semibold">Jail</span>
                  <span className="font-bold font-mono bg-yellow-800 px-1.5 py-0.5 rounded">{store.jailTimer}</span>
                </span>
              )}
              {store.isTraveling && (
                <span className="bg-blue-900/80 text-blue-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-blue-700">
                  <span>✈️</span>
                  <span className="font-semibold">Travel</span>
                  <span className="font-bold font-mono bg-blue-800 px-1.5 py-0.5 rounded">{store.travelTimer}</span>
                </span>
              )}
              {store.inEducation && (
                <span className="bg-purple-900/80 text-purple-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-purple-700">
                  <span>📚</span>
                  <span className="font-semibold">Study</span>
                  <span className="font-bold font-mono bg-purple-800 px-1.5 py-0.5 rounded">{store.educationTimer}</span>
                </span>
              )}
              {ext.racingActive && (
                <span className="bg-cyan-900/80 text-cyan-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-cyan-700">
                  <span>🏎️</span>
                  <span className="font-semibold">Racing</span>
                </span>
              )}
              {store.bankInvestment > 0 && (
                <span className="bg-green-900/80 text-green-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 border border-green-700">
                  <span>💰</span>
                  <span className="font-semibold">Invest</span>
                  <span className="font-bold font-mono bg-green-800 px-1.5 py-0.5 rounded">{store.bankInvestmentTime}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 hidden md:block sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {mainNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleMainNav(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  section === item.id 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-amber-600 z-50 shadow-2xl">
        <div className="flex justify-around items-center py-2 px-1">
          {mainNavItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => handleMainNav(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[56px] transition-all ${
                section === item.id 
                  ? 'text-amber-400 bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[56px] transition-all ${
              mobileMenuOpen ? 'text-amber-400 bg-gray-700' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-xl mb-0.5">{mobileMenuOpen ? '✕' : '☰'}</span>
            <span className="text-[9px] font-medium">More</span>
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 bg-gray-800 border-t border-gray-700 p-3 shadow-2xl">
            <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto">
              {mainNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleMainNav(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                    section === item.id 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Notifications */}
      <FloatingNotifications />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-6">
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

function MiniBar({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const isLow = pct < 20;
  return (
    <div className="flex items-center gap-1.5">
      {icon && <span className="text-sm">{icon}</span>}
      <span className={`text-[10px] font-medium min-w-[36px] ${isLow ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{label}</span>
      <div className="w-20 h-2.5 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        <div 
          className={`h-full ${color} transition-all duration-300 ${isLow ? 'animate-pulse' : ''}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
      <span className={`text-[10px] font-mono min-w-[45px] text-right ${isLow ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
        {value}/{max}
      </span>
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
    <div className={`bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-md ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
          <h3 className="text-lg font-bold text-amber-400">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

function QuickAmountButtons({ amount, setAmount, maxAmount }: { amount: string; setAmount: (v: string) => void; maxAmount: number }) {
  const percentages = [10, 25, 50, 75, 100];
  
  return (
    <div className="flex gap-1 mt-1">
      {percentages.map(pct => (
        <button
          key={pct}
          onClick={() => setAmount(String(Math.floor(maxAmount * pct / 100)))}
          className="flex-1 px-1 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded text-[9px] font-medium"
        >
          {pct}%
        </button>
      ))}
    </div>
  );
}

function TimerDisplay({ label, time, icon, color = 'amber' }: { label: string; time: number; icon: string; color?: string }) {
  if (time <= 0) return null;
  
  const colorClasses = {
    amber: 'bg-amber-900/50 border-amber-700 text-amber-300',
    red: 'bg-red-900/50 border-red-700 text-red-300',
    blue: 'bg-blue-900/50 border-blue-700 text-blue-300',
    purple: 'bg-purple-900/50 border-purple-700 text-purple-300',
    yellow: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
  };
  
  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-lg p-3 flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[10px] opacity-75">Time remaining</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold font-mono">{time}</p>
        <p className="text-[10px] opacity-75">seconds</p>
      </div>
    </div>
  );
}

// ============ PAGES ============

function HomePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const xpNeeded = Math.floor(100 * Math.pow(1.5, store.level - 1));

  return (
    <div className="space-y-5">
      {/* Active Timers */}
      {(store.inHospital || store.inJail || store.isTraveling || store.inEducation) && (
        <div className="space-y-2">
          <TimerDisplay label="Hospital" time={store.hospitalTimer} icon="🏥" color="red" />
          <TimerDisplay label="Jail" time={store.jailTimer} icon="🔒" color="yellow" />
          <TimerDisplay label="Traveling" time={store.travelTimer} icon="✈️" color="blue" />
          <TimerDisplay label="Education" time={store.educationTimer} icon="📚" color="purple" />
        </div>
      )}

      {/* Character Overview */}
      <SectionCard>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-3xl shadow-lg">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">{store.name}</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded text-xs font-medium">
                Level {store.level}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-300 text-xs">{store.rank}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Age: {store.age} days</p>
          </div>
          <div className="text-right">
            <p className="text-xl text-green-400 font-mono font-bold">${store.cash.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Bank: ${store.bank.toLocaleString()}</p>
          </div>
        </div>
        
        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-medium">Level Progress</span>
            <span className="font-mono">{store.xp} / {xpNeeded} XP</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500" 
              style={{ width: `${(store.xp / xpNeeded) * 100}%` }} 
            />
          </div>
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{store.strength}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">STR</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{store.speed}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">SPD</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{store.defense}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">DEF</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border border-yellow-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{store.dexterity}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">DEX</p>
          </div>
        </div>
      </SectionCard>

      {/* Resource Bars */}
      <SectionCard title="📊 Resources">
        <div className="space-y-3">
          <ResourceBar label="Life" value={store.life} max={store.maxLife} color="bg-red-500" icon="❤️" />
          <ResourceBar label="Energy" value={store.energy} max={store.maxEnergy} color="bg-green-500" icon="⚡" />
          <ResourceBar label="Nerve" value={store.nerve} max={store.maxNerve} color="bg-orange-500" icon="🧠" />
          <ResourceBar label="Happy" value={store.happy} max={store.maxHappy} color="bg-pink-500" icon="😊" />
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-[10px] text-gray-500 text-center">Resources regenerate over time</p>
        </div>
      </SectionCard>
    </div>
  );
}

function ResourceBar({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const isLow = pct < 20;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className={`font-medium ${isLow ? 'text-red-400' : 'text-gray-300'}`}>{label}</span>
          <span className={`font-mono ${isLow ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{value}/{max}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div className={`h-full ${color} transition-all duration-300 ${isLow ? 'animate-pulse' : ''}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function ItemsPage() {
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
  const weapons = items.filter(i => ['Melee', 'Primary', 'Secondary'].includes(i.category));
  const armors = items.filter(i => i.category === 'Armor');

  return (
    <div className="space-y-4">
      <SectionCard title="⚔️ Weapons">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-400">Equipped: <span className="text-white font-bold">{items.find(i => i.id === store.equippedWeapon)?.name || 'Fists'}</span></p>
          {store.equippedWeapon !== 'fists' && (
            <button onClick={() => store.unequipWeapon()} className="px-2 py-0.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs">Unequip</button>
          )}
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {weapons.map(w => {
            const owned = store.inventory.find(i => i.itemId === w.id);
            const isEquipped = store.equippedWeapon === w.id;
            return (
              <div key={w.id} className={`flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs ${isEquipped ? 'border border-amber-600' : ''}`}>
                <span className="text-gray-300">{w.name} (DMG: {w.effectValue}) {isEquipped && <span className="text-amber-400 text-[10px]">✓ Equipped</span>}</span>
                {owned ? (
                  isEquipped ? (
                    <span className="text-[10px] text-amber-400">Active</span>
                  ) : (
                    <button onClick={() => store.useItem(w.id)} className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded">Equip</button>
                  )
                ) : (
                  <button onClick={() => store.buyItem(w.id)} className="px-2 py-0.5 bg-green-700 hover:bg-green-600 text-white rounded">${w.price}</button>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="🛡️ Armor">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-400">Equipped: <span className="text-white font-bold">{store.equippedArmor ? items.find(i => i.id === store.equippedArmor)?.name : 'None'}</span></p>
          {store.equippedArmor && (
            <button onClick={() => store.unequipArmor()} className="px-2 py-0.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs">Unequip</button>
          )}
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {armors.map(a => {
            const owned = store.inventory.find(i => i.itemId === a.id);
            const isEquipped = store.equippedArmor === a.id;
            return (
              <div key={a.id} className={`flex justify-between items-center bg-gray-700/50 rounded p-2 text-xs ${isEquipped ? 'border border-amber-600' : ''}`}>
                <span className="text-gray-300">{a.name} (DEF: {a.effectValue}) {isEquipped && <span className="text-amber-400 text-[10px]">✓ Equipped</span>}</span>
                {owned ? (
                  isEquipped ? (
                    <span className="text-[10px] text-amber-400">Active</span>
                  ) : (
                    <button onClick={() => store.useItem(a.id)} className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded">Equip</button>
                  )
                ) : (
                  <button onClick={() => store.buyItem(a.id)} className="px-2 py-0.5 bg-green-700 hover:bg-green-600 text-white rounded">${a.price}</button>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function BazaarTab() {
  const store = useGameStore();

  return (
    <SectionCard title="🏬 Your Bazaar">
      <p className="text-sm text-gray-400 mb-3">Set up your personal shop to sell items to other players.</p>
      {store.points < 1 && (
        <p className="text-xs text-red-400 mb-2">Requires 1 Point to open a Bazaar. Current: {store.points}</p>
      )}
      <div className="bg-gray-700 rounded p-3 text-center">
        <p className="text-gray-400 text-sm">Your bazaar is {store.points >= 1 ? 'active' : 'locked'}</p>
      </div>
    </SectionCard>
  );
}

function CityPage({ location, onNavigate }: { location: CityLocation | null; onNavigate: (loc: CityLocation | null) => void }) {
  if (!location) {
    return <CityMap onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-4">
      <button onClick={() => onNavigate(null)} className="text-xs text-amber-400 hover:text-amber-300">
        ← Back to City Map
      </button>
      {location === 'bank' && <BankLocation />}
      {location === 'casino' && <CasinoLocation />}
      {location === 'loan_shark' && <LoanSharkLocation />}
      {location === 'item_market' && <ItemMarketLocation />}
      {location === 'stock_market' && <StockMarketLocation />}
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
  { id: 'stock_market', label: 'Stock Market', icon: '📈', district: 'Financial' },
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
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-2">🏙️ Torn City</h2>
        <p className="text-gray-400 text-sm">Navigate to different locations in the city.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cityLocationsList.map(loc => (
          <button key={loc.id} onClick={() => onNavigate(loc.id)}
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition-all border border-gray-700 hover:border-amber-600 hover:shadow-lg group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{loc.icon}</div>
            <p className="text-sm text-white font-semibold">{loc.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{loc.district}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// City location components
function BankLocation() {
  const store = useGameStore();
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [investAmt, setInvestAmt] = useState('');

  return (
    <SectionCard title="🏦 Bank">
      <div className="space-y-3">
        <div className="bg-gray-700 rounded p-3 text-center">
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-xl font-bold text-green-400">${store.bank.toLocaleString()}</p>
          {store.bankInvestment > 0 && (
            <p className="text-xs text-blue-400 mt-1">Investment: ${store.bankInvestment.toLocaleString()} ({store.bankInvestmentTime}s)</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Deposit" className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white mb-1" />
            <QuickAmountButtons amount={depositAmt} setAmount={setDepositAmt} maxAmount={store.cash} />
            <button onClick={() => { 
              const amt = Number(depositAmt);
              if (amt <= 0) { addNotification('❌ Invalid amount', 'error'); return; }
              if (amt > store.cash) { addNotification('❌ Not enough cash', 'error'); return; }
              store.depositBank(amt); 
              addNotification(`✅ Deposited $${amt.toLocaleString()}`, 'success');
              setDepositAmt(''); 
            }} className="w-full px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs mt-1">Deposit</button>
          </div>
          <div>
            <input type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} placeholder="Withdraw" className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white mb-1" />
            <QuickAmountButtons amount={withdrawAmt} setAmount={setWithdrawAmt} maxAmount={store.bank} />
            <button onClick={() => { 
              const amt = Number(withdrawAmt);
              if (amt <= 0) { addNotification('❌ Invalid amount', 'error'); return; }
              if (amt > store.bank) { addNotification('❌ Not enough in bank', 'error'); return; }
              store.withdrawBank(amt); 
              addNotification(`✅ Withdrew $${amt.toLocaleString()}`, 'success');
              setWithdrawAmt(''); 
            }} className="w-full px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs mt-1">Withdraw</button>
          </div>
          <div>
            <input type="number" value={investAmt} onChange={e => setInvestAmt(e.target.value)} placeholder="Invest" className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white mb-1" />
            <QuickAmountButtons amount={investAmt} setAmount={setInvestAmt} maxAmount={store.cash} />
            <button onClick={() => { 
              const amt = Number(investAmt);
              if (amt <= 0) { addNotification('❌ Invalid amount', 'error'); return; }
              if (amt > store.cash) { addNotification('❌ Not enough cash', 'error'); return; }
              store.investBank(amt); 
              addNotification(`✅ Invested $${amt.toLocaleString()} (15% return in 30s)`, 'success');
              setInvestAmt(''); 
            }} className="w-full px-2 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs mt-1">Invest (15%)</button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function CasinoLocation() {
  const store = useGameStore();
  const [bet, setBet] = useState('100');
  const [result, setResult] = useState('');

  const handleGamble = (game: string) => {
    const winnings = store.gamble(game, Number(bet));
    if (winnings > Number(bet)) {
      setResult(`🎉 Won $${(winnings - Number(bet)).toLocaleString()}!`);
    } else if (winnings === Number(bet)) {
      setResult('🤝 Break even');
    } else {
      setResult(`💸 Lost $${Number(bet).toLocaleString()}`);
    }
  };

  return (
    <SectionCard title="🎰 Casino">
      <div className="space-y-3">
        <input type="number" value={bet} onChange={e => setBet(e.target.value)} placeholder="Bet amount" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
        {result && <p className="text-center text-sm font-bold">{result}</p>}
        <div className="grid grid-cols-2 gap-2">
          {casinoGames.map(game => (
            <button key={game.id} onClick={() => handleGamble(game.id)} disabled={store.cash < Number(bet)}
              className="py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs">
              {game.name}
            </button>
          ))}
        </div>
      </div>
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
  return (
    <SectionCard title="🔨 Auction House">
      <p className="text-sm text-gray-400 mb-3">Bid on rare items from other players.</p>
      <div className="bg-gray-700 rounded p-4 text-center">
        <p className="text-gray-500 text-sm">Auction feature coming soon</p>
      </div>
    </SectionCard>
  );
}

function PointsMarketLocation() {
  const store = useGameStore();
  return (
    <SectionCard title="💎 Points Market">
      <p className="text-sm text-gray-400 mb-3">Buy points with cash or sell points for cash.</p>
      <div className="bg-gray-700 rounded p-3 text-center">
        <p className="text-xs text-gray-400">Your Points</p>
        <p className="text-xl font-bold text-purple-400">{store.points}</p>
      </div>
    </SectionCard>
  );
}

function StockMarketLocation() {
  const store = useGameStore();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [shares, setShares] = useState('1');

  return (
    <SectionCard title="📈 Stock Market">
      <p className="text-sm text-gray-400 mb-3">Invest in Torn City companies. Prices fluctuate over time.</p>
      
      <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
        {stocks.map(stock => {
          const currentPrice = store.stockPrices[stock.id] || stock.price;
          const holding = store.stockHoldings.find(h => h.stockId === stock.id);
          const priceChange = currentPrice - stock.price;
          const changePercent = ((priceChange / stock.price) * 100).toFixed(1);
          
          return (
            <button key={stock.id} onClick={() => setSelectedStock(stock.id)}
              className={`w-full text-left bg-gray-700 hover:bg-gray-600 rounded p-2 transition-colors ${selectedStock === stock.id ? 'border border-amber-600' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-white">{stock.name}</p>
                  <p className="text-[10px] text-gray-400">{stock.benefit || 'No special benefit'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-400">${currentPrice}</p>
                  <p className={`text-[10px] ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '▲' : '▼'} {changePercent}%
                  </p>
                </div>
              </div>
              {holding && (
                <p className="text-[10px] text-amber-400 mt-1">
                  Owned: {holding.shares} shares (Avg: ${holding.avgPrice.toFixed(0)})
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selectedStock && (
        <div className="bg-gray-700 rounded p-3 space-y-2">
          <p className="text-xs font-bold text-white">{stocks.find(s => s.id === selectedStock)?.name}</p>
          <div className="flex gap-2">
            <input type="number" value={shares} onChange={e => setShares(e.target.value)} min="1"
              className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-xs text-white" />
            <button onClick={() => { store.buyStock(selectedStock, Number(shares)); setShares('1'); }}
              className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs">Buy</button>
            <button onClick={() => { store.sellStock(selectedStock, Number(shares)); setShares('1'); }}
              className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs">Sell</button>
          </div>
        </div>
      )}
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
            <p className="text-red-300 font-bold text-lg">You're in the Hospital</p>
            <p className="text-gray-400 text-sm mt-1">Time remaining: {store.hospitalTimer}s</p>
          </div>
          <button onClick={() => store.revivePlayer()} disabled={store.energy < 10}
            className="w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
            Self-Revive (10 Energy)
          </button>
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
  const bailCost = Math.floor(store.jailTimer * 500);

  return (
    <SectionCard title="🔒 Jail">
      {store.inJail ? (
        <div className="space-y-3">
          <div className="bg-yellow-900/30 border border-yellow-800 rounded p-4 text-center">
            <p className="text-yellow-300 font-bold text-lg">You're in Jail</p>
            <p className="text-gray-400 text-sm mt-1">Time remaining: {store.jailTimer} seconds</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {
              const wasInJail = store.inJail;
              store.escapeJail();
              setTimeout(() => {
                const nowInJail = useGameStore.getState().inJail;
                if (wasInJail && !nowInJail) {
                  addNotification('✅ Escaped successfully!', 'success');
                } else {
                  addNotification('❌ Escape failed! Time increased.', 'error');
                }
              }, 100);
            }} className="py-2 bg-orange-700 hover:bg-orange-600 text-white rounded text-sm">
              Escape (40% chance)
            </button>
            <button onClick={() => {
              if (store.cash >= bailCost) {
                store.bailFromJail();
                addNotification('✅ Bailed out!', 'success');
              } else {
                addNotification('❌ Not enough cash!', 'error');
              }
            }} disabled={store.cash < bailCost} className="py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
              Bail (${bailCost.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-900/30 border border-green-800 rounded p-4 text-center">
          <p className="text-green-300 font-bold">Not in Jail</p>
          <p className="text-gray-400 text-sm mt-1">You're a free citizen.</p>
        </div>
      )}
    </SectionCard>
  );
}

function MuseumLocation() {
  const ext = useExtendedStore();

  return (
    <SectionCard title="🏛️ Museum & Collections">
      <p className="text-sm text-gray-400 mb-3">Collect rare items and artifacts.</p>
      <div className="space-y-2">
        {collections.map(col => {
          const owned = ext.collections.includes(col.id);
          return (
            <div key={col.id} className={`rounded p-3 border ${owned ? 'bg-green-900/20 border-green-800' : 'bg-gray-700 border-gray-600'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">{col.icon} {col.name}</p>
                  <p className="text-[10px] text-gray-400">{col.description}</p>
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

  const handleSearch = () => {
    if (store.energy < 1) { 
      addNotification('❌ Not enough energy!', 'error');
      return; 
    }
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
      addNotification(`✅ Found: ${randomItem.name}!`, 'success');
    } else {
      addNotification('Found nothing useful.', 'info');
    }
  };

  return (
    <SectionCard title="🗑️ Dump">
      <p className="text-sm text-gray-400 mb-3">Search through the dump for items. Costs 1 energy.</p>
      <button onClick={handleSearch} disabled={store.energy < 1}
        className="w-full py-2 bg-orange-700 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
        Search Dump (1 Energy)
      </button>
    </SectionCard>
  );
}

function ShopsLocation() {
  return (
    <SectionCard title="🛒 Shops">
      <p className="text-sm text-gray-400 mb-3">Various shops around the city.</p>
      <div className="bg-gray-700 rounded p-4 text-center">
        <p className="text-gray-500 text-sm">Visit the Item Market for shopping</p>
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
      </div>
    </SectionCard>
  );
}

function ChurchLocation() {
  const store = useGameStore();

  const pray = () => {
    if (store.energy < 1) { 
      addNotification('❌ Not enough energy!', 'error');
      return; 
    }
    useGameStore.setState({ energy: store.energy - 1, happy: Math.min(store.maxHappy, store.happy + 5) });
    addNotification('✅ You feel blessed. +5 Happy', 'success');
  };

  return (
    <SectionCard title="⛪ Church">
      <p className="text-sm text-gray-400 mb-3">Find peace and forgiveness in Torn City.</p>
      <button onClick={pray} disabled={store.energy < 1}
        className="w-full py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
        Pray (1 Energy, +5 Happy)
      </button>
    </SectionCard>
  );
}

function CommunityLocation() {
  const store = useGameStore();
  const [tab, setTab] = useState<'news' | 'events' | 'hall_of_fame'>('news');
  
  // Simulated news based on game state
  const newsItems = [
    { title: 'New Faction War Declared', desc: 'Two major factions are at war in downtown!', time: '2h ago' },
    { title: 'Record Heist Successful', desc: 'A crew pulled off the biggest bank heist in Torn history!', time: '5h ago' },
    { title: 'Stock Market Update', desc: 'Torn Airlines shares surge 15% after new routes announced.', time: '8h ago' },
    { title: 'Hospital Overcrowded', desc: 'After major faction war, hospital sees record admissions.', time: '12h ago' },
  ];

  const events = [
    { name: 'Weekly XSS Competition', status: 'Active', endsIn: '2d 14h' },
    { name: 'Holiday Event', status: 'Active', endsIn: '5d 8h' },
    { name: 'Faction Warfare Tournament', status: 'Starting Soon', endsIn: '1d 6h' },
  ];

  const hallOfFame = [
    { rank: 1, name: 'ShadowKing', stat: '12,450 battles' },
    { rank: 2, name: 'NightHawk', stat: '10,890 battles' },
    { rank: 3, name: 'IronFist', stat: '9,560 battles' },
  ];

  return (
    <SectionCard title="👥 Community Center">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setTab('news')} className={`px-3 py-1 rounded text-xs ${tab === 'news' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>News</button>
        <button onClick={() => setTab('events')} className={`px-3 py-1 rounded text-xs ${tab === 'events' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Events</button>
        <button onClick={() => setTab('hall_of_fame')} className={`px-3 py-1 rounded text-xs ${tab === 'hall_of_fame' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Hall of Fame</button>
      </div>

      {tab === 'news' && (
        <div className="space-y-2">
          {newsItems.map((news, idx) => (
            <div key={idx} className="bg-gray-700 rounded p-3">
              <p className="text-xs font-bold text-white">{news.title}</p>
              <p className="text-[10px] text-gray-400 mt-1">{news.desc}</p>
              <p className="text-[10px] text-gray-500 mt-1">{news.time}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-2">
          {events.map((event, idx) => (
            <div key={idx} className="bg-gray-700 rounded p-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">{event.name}</p>
                <p className="text-[10px] text-gray-400">{event.status}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-400 font-bold">{event.endsIn}</p>
                <p className="text-[10px] text-gray-500">remaining</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'hall_of_fame' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-2">Top Fighters</p>
          {hallOfFame.map(player => (
            <div key={player.rank} className="bg-gray-700 rounded p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`}>
                  #{player.rank}
                </span>
                <p className="text-xs font-bold text-white">{player.name}</p>
              </div>
              <p className="text-[10px] text-gray-400">{player.stat}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// Continue with other pages...
function JobsPage() {
  const store = useGameStore();
  const currentJob = jobs.find(j => j.id === store.currentJob);

  const handleApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (store.level < job.levelReq) {
      addNotification(`❌ Need Level ${job.levelReq} to apply`, 'error');
      return;
    }
    if (job.statReq.manualLabor && store.manualLabor < job.statReq.manualLabor) {
      addNotification(`❌ Need ${job.statReq.manualLabor} Manual Labor`, 'error');
      return;
    }
    if (job.statReq.intelligence && store.intelligence < job.statReq.intelligence) {
      addNotification(`❌ Need ${job.statReq.intelligence} Intelligence`, 'error');
      return;
    }
    if (job.statReq.endurance && store.endurance < job.statReq.endurance) {
      addNotification(`❌ Need ${job.statReq.endurance} Endurance`, 'error');
      return;
    }
    
    store.applyJob(jobId);
    addNotification(`✅ Applied to ${job.name}!`, 'success');
  };

  const handleWork = () => {
    if (store.energy < 5) {
      addNotification('❌ Not enough energy! Need 5 energy', 'error');
      return;
    }
    if (!store.currentJob) {
      addNotification('❌ No job selected!', 'error');
      return;
    }
    
    store.workJob();
    if (currentJob) {
      addNotification(`✅ Worked shift! Earned $${currentJob.salary}`, 'success');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">💼 Jobs</h2>
      
      {currentJob && (
        <SectionCard title={`Current Job: ${currentJob.name}`}>
          <div className="space-y-3">
            <div className="bg-gray-700 rounded p-3">
              <p className="text-sm text-gray-300">{currentJob.company}</p>
              <p className="text-xs text-green-400 mt-1">Salary: ${currentJob.salary}/shift</p>
            </div>
            <button onClick={handleWork} disabled={store.energy < 5}
              className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-bold">
              Work Shift (5 Energy)
            </button>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Available Jobs">
        <div className="space-y-2">
          {jobs.map(job => {
            const canApply = store.level >= job.levelReq && 
              (!job.statReq.manualLabor || store.manualLabor >= job.statReq.manualLabor) &&
              (!job.statReq.intelligence || store.intelligence >= job.statReq.intelligence) &&
              (!job.statReq.endurance || store.endurance >= job.statReq.endurance);
            const isCurrentJob = store.currentJob === job.id;

            return (
              <div key={job.id} className={`bg-gray-700 rounded p-3 ${isCurrentJob ? 'border-2 border-amber-600' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{job.name}</p>
                    <p className="text-[10px] text-gray-400">{job.company} • Lvl {job.levelReq}+</p>
                    <p className="text-xs text-green-400 mt-1">${job.salary}/shift</p>
                    {(job.statReq.manualLabor || job.statReq.intelligence || job.statReq.endurance) && (
                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                        {job.statReq.manualLabor && <span>ML: {job.statReq.manualLabor}</span>}
                        {job.statReq.intelligence && <span>INT: {job.statReq.intelligence}</span>}
                        {job.statReq.endurance && <span>END: {job.statReq.endurance}</span>}
                      </div>
                    )}
                  </div>
                  {isCurrentJob ? (
                    <span className="text-xs text-amber-400 font-bold">Current Job</span>
                  ) : (
                    <button onClick={() => handleApply(job.id)} disabled={!canApply}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 disabled:text-gray-500 text-white rounded text-xs">
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function GymPage() {
  const store = useGameStore();
  const [selectedGym, setSelectedGym] = useState('basic');
  const [message, setMessage] = useState('');
  const [lastGain, setLastGain] = useState<{stat: string; gain: number} | null>(null);

  const gym = gyms.find(g => g.id === selectedGym);
  const canUseGym = gym && store.level >= gym.levelReq && (!gym.statReq || Math.max(store.strength, store.speed, store.defense, store.dexterity) >= gym.statReq);

  const handleTrain = (stat: 'strength' | 'speed' | 'defense' | 'dexterity') => {
    if (store.energy < 5) { 
      addNotification('❌ Not enough energy! Need 5 energy', 'error');
      return; 
    }
    if (!canUseGym) { 
      addNotification('❌ Requirements not met for this gym!', 'error');
      return; 
    }
    
    const gain = store.trainStat(stat, selectedGym);
    if (gain && gain > 0) {
      setLastGain({ stat, gain });
      addNotification(`✅ Trained ${stat}! +${gain}`, 'success');
      setTimeout(() => setLastGain(null), 2000);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-2">💪 Gym</h2>
        <p className="text-gray-400 text-sm">Train your battle stats. Each session costs 5 energy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {gyms.map(g => {
          const available = store.level >= g.levelReq && (!g.statReq || Math.max(store.strength, store.speed, store.defense, store.dexterity) >= g.statReq);
          return (
            <button key={g.id} onClick={() => setSelectedGym(g.id)}
              className={`p-4 rounded-xl text-left border-2 transition-all ${
                selectedGym === g.id ? 'bg-amber-600/20 border-amber-600 shadow-lg' :
                available ? 'bg-gray-800 border-gray-700 hover:border-gray-500 hover:shadow-md' : 'bg-gray-800 border-gray-800 opacity-50'
              }`}>
              <p className="text-sm font-bold text-white mb-1">{g.name}</p>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="bg-gray-700 px-2 py-0.5 rounded text-amber-400 font-medium">x{g.multiplier}</span>
                <span className="text-gray-500">Lvl {g.levelReq}+</span>
              </div>
              {g.statReq && <p className="text-[10px] text-gray-500 mt-1">{g.statReq}+ stat required</p>}
            </button>
          );
        })}
      </div>

      <SectionCard title={`Training at: ${gym?.name || 'Basic Gym'} (x${gym?.multiplier || 1})`}>
        <div className="grid grid-cols-2 gap-3">
          {([
            { stat: 'strength' as const, label: 'Strength', icon: '💪', color: 'bg-gradient-to-br from-red-700 to-red-600 hover:from-red-600 hover:to-red-500', current: store.strength },
            { stat: 'speed' as const, label: 'Speed', icon: '⚡', color: 'bg-gradient-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500', current: store.speed },
            { stat: 'defense' as const, label: 'Defense', icon: '🛡️', color: 'bg-gradient-to-br from-green-700 to-green-600 hover:from-green-600 hover:to-green-500', current: store.defense },
            { stat: 'dexterity' as const, label: 'Dexterity', icon: '🎯', color: 'bg-gradient-to-br from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500', current: store.dexterity },
          ]).map(s => (
            <button key={s.stat} onClick={() => handleTrain(s.stat)} disabled={store.energy < 5 || !canUseGym}
              className={`${s.color} disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white rounded-xl p-5 text-center transition-all shadow-md hover:shadow-lg disabled:shadow-none`}>
              <span className="text-3xl">{s.icon}</span>
              <p className="font-bold text-sm mt-2">{s.label}</p>
              <p className="text-xs opacity-75 mt-1">Current: {s.current}</p>
            </button>
          ))}
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.includes('❌') ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-green-900/30 border border-green-700 text-green-300'
          }`}>
            {message}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function CrimesPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'crimes' | 'combat' | 'organized'>('crimes');
  const [lastCrimeResult, setLastCrimeResult] = useState<{success: boolean; reward?: number; jailed?: boolean} | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-2">🔫 Crimes & Combat</h2>
        <p className="text-gray-400 text-sm">Commit crimes, fight enemies, or plan organized operations.</p>
      </div>
      
      <div className="flex gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
        <button onClick={() => setTab('crimes')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'crimes' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          🔫 Crimes
        </button>
        <button onClick={() => setTab('combat')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'combat' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          ⚔️ Combat
        </button>
        <button onClick={() => setTab('organized')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'organized' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          🕵️ Organized
        </button>
      </div>

      {tab === 'crimes' && (
        <div className="space-y-2">
          <div className="bg-gray-800 rounded p-3 border border-gray-700 flex justify-between items-center text-sm">
            <span className="text-gray-400">Crime Skill: <span className="text-amber-400 font-bold">{store.crimeSkill.toFixed(1)}</span></span>
            <span className="text-gray-400">Nerve: <span className="text-orange-400 font-bold">{store.nerve}/{store.maxNerve}</span></span>
          </div>

          {/* Last Crime Result */}
          {lastCrimeResult && (
            <div className={`rounded-lg p-3 border ${lastCrimeResult.success ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
              {lastCrimeResult.success ? (
                <p className="text-green-300 text-sm font-bold">✅ Success! Earned ${lastCrimeResult.reward?.toLocaleString()}</p>
              ) : (
                <p className="text-red-300 text-sm font-bold">❌ Failed! {lastCrimeResult.jailed ? 'You were sent to jail!' : 'Better luck next time.'}</p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {crimes.map(crime => {
              const canDo = store.nerve >= crime.nerveCost && store.level >= crime.levelReq && !store.inHospital && !store.inJail;
              const successChance = Math.min(95, Math.max(5, 50 + store.crimeSkill * 2 - crime.difficulty + store.dexterity * 0.5));
              
              const handleCrime = () => {
                if (!canDo) return;
                const prevJail = store.inJail;
                const prevCash = store.cash;
                store.commitCrime(crime.id);
                
                // Check result after commit
                setTimeout(() => {
                  const newState = useGameStore.getState();
                  const success = newState.cash > prevCash;
                  const jailed = !prevJail && newState.inJail;
                  const reward = success ? newState.cash - prevCash : 0;
                  setLastCrimeResult({ success, reward, jailed });
                  setTimeout(() => setLastCrimeResult(null), 3000);
                }, 100);
              };
              
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
                    <button onClick={handleCrime} disabled={!canDo}
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

function CombatSection() {
  const store = useGameStore();
  const [combatResult, setCombatResult] = useState<{won: boolean; enemy: string; type: string; hospitalized?: boolean} | null>(null);

  const handleAttack = (enemyId: string, type: 'mug' | 'hospitalize' | 'leave') => {
    if (store.energy < 5) {
      addNotification('❌ Not enough energy!', 'error');
      return;
    }
    if (store.inHospital || store.inJail) {
      addNotification('❌ Cannot attack while in hospital or jail!', 'error');
      return;
    }
    
    const enemy = npcEnemies.find(e => e.id === enemyId);
    const prevHospitalized = store.inHospital;
    
    store.attackPlayer(enemyId, type);
    
    // Check result after attack
    setTimeout(() => {
      const newState = useGameStore.getState();
      const won = !newState.inHospital || prevHospitalized;
      const hospitalized = !prevHospitalized && newState.inHospital;
      setCombatResult({ 
        won: !hospitalized, 
        enemy: enemy?.name || 'Unknown', 
        type,
        hospitalized 
      });
      setTimeout(() => setCombatResult(null), 4000);
    }, 100);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded p-3 border border-gray-700 flex justify-between items-center text-sm">
        <span className="text-gray-400">Battle Power: <span className="text-amber-400 font-bold">{store.strength + store.speed + store.defense + store.dexterity}</span></span>
        <span className="text-gray-400">Energy: <span className="text-green-400 font-bold">{store.energy}/{store.maxEnergy}</span></span>
      </div>

      {/* Combat Result */}
      {combatResult && (
        <div className={`rounded-lg p-3 border ${combatResult.won ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
          {combatResult.won ? (
            <div>
              <p className="text-green-300 text-sm font-bold">✅ Victory!</p>
              <p className="text-xs text-gray-400">Defeated {combatResult.enemy} ({combatResult.type})</p>
            </div>
          ) : (
            <div>
              <p className="text-red-300 text-sm font-bold">❌ Defeated!</p>
              <p className="text-xs text-gray-400">Lost to {combatResult.enemy}</p>
              {combatResult.hospitalized && (
                <p className="text-xs text-red-400 mt-1">🏥 You were sent to the hospital!</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {npcEnemies.map(enemy => {
          const canAttack = store.energy >= 5 && !store.inHospital && !store.inJail;
          
          return (
            <div key={enemy.id} className={`bg-gray-800 rounded-lg p-3 border ${canAttack ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-white">{enemy.name}</p>
                  <p className="text-[10px] text-gray-400">Level {enemy.level}</p>
                </div>
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

function TravelPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'travel' | 'racing' | 'hunting'>('travel');
  const [message, setMessage] = useState('');

  if (store.level < 15 && tab === 'travel') {
    return (
      <SectionCard title="✈️ Travel Agency">
        <p className="text-gray-400 text-center py-4">Travel unlocks at Level 15. Current: Level {store.level}</p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">✈️ Travel & Activities</h2>
      
      <div className="flex gap-2">
        <button onClick={() => setTab('travel')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'travel' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Travel</button>
        <button onClick={() => setTab('racing')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'racing' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Racing</button>
        <button onClick={() => setTab('hunting')} className={`px-3 py-1.5 rounded text-xs font-medium ${tab === 'hunting' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Hunting</button>
      </div>

      {tab === 'travel' && (
        <>
          {store.isTraveling ? (
            <SectionCard>
              <div className="text-center py-4">
                <p className="text-blue-300 font-bold text-lg">✈️ In Flight</p>
                <p className="text-gray-400 text-sm mt-1">Flying to {destinations.find(d => d.id === store.travelDestination)?.name}</p>
                <p className="text-amber-400 font-bold mt-2">{store.travelTimer}s remaining</p>
              </div>
            </SectionCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {destinations.map(dest => (
                <div key={dest.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <p className="text-sm font-bold text-white">{dest.name}</p>
                  <p className="text-[10px] text-gray-400">Flight: {dest.flightTime} min • ${dest.cost}</p>
                  <button onClick={() => { 
                    store.travel(dest.id); 
                    addNotification(`✈️ Flying to ${dest.name}!`, 'success');
                  }}
                    className="mt-2 w-full px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs">
                    Fly (${dest.cost})
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'racing' && (
        <div className="space-y-3">
          <SectionCard title="🏎️ Racing">
            <div className="grid grid-cols-2 gap-3 text-center text-xs mb-3">
              <div className="bg-gray-700 rounded p-2">
                <p className="text-gray-400">Racing Skill</p>
                <p className="text-amber-400 font-bold text-lg">{ext.racingSkill}</p>
              </div>
              <div className="bg-gray-700 rounded p-2">
                <p className="text-gray-400">Current Car</p>
                <p className="text-white font-bold">{ext.racingCar ? cars.find(c => c.id === ext.racingCar)?.name : 'None'}</p>
              </div>
            </div>

            {!ext.racingLicense ? (
              <button onClick={() => {
                if (store.points >= 1) {
                  useExtendedStore.setState({ racingLicense: true });
                  useGameStore.setState({ points: store.points - 1 });
                  addNotification('✅ Racing license purchased!', 'success');
                } else {
                  addNotification('❌ Need 1 Point to buy racing license', 'error');
                }
              }} className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">
                Buy Racing License (1 Point)
              </button>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-2">Available Cars:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cars.map(car => {
                    const owned = ext.ownedCars.includes(car.id);
                    const canBuy = store.cash >= car.price && !owned;
                    return (
                      <div key={car.id} className={`bg-gray-700 rounded p-2 ${owned ? 'border border-green-700' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-white">{car.name}</p>
                            <p className="text-[10px] text-gray-400">{car.class} • Lvl {car.levelReq}+</p>
                            <div className="flex gap-2 mt-1 text-[10px]">
                              <span className="text-blue-400">SPD: {car.speed}</span>
                              <span className="text-green-400">ACC: {car.acceleration}</span>
                              <span className="text-yellow-400">HDL: {car.handling}</span>
                            </div>
                          </div>
                          {owned ? (
                            <button onClick={() => useExtendedStore.setState({ racingCar: car.id })}
                              className={`px-2 py-1 rounded text-[10px] ${ext.racingCar === car.id ? 'bg-green-700 text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'}`}>
                              {ext.racingCar === car.id ? 'Equipped' : 'Equip'}
                            </button>
                          ) : (
                            <button onClick={() => { 
                              ext.buyCar(car.id); 
                              addNotification(`✅ Bought ${car.name}!`, 'success');
                            }}
                              disabled={!canBuy}
                              className="px-2 py-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white rounded text-[10px]">
                              ${car.price.toLocaleString()}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {ext.racingCar && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Race Tracks:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {raceTracks.map(track => (
                        <button key={track.id} onClick={() => { 
                          ext.startRace(track.id); 
                          addNotification(`🏎️ Racing on ${track.name}!`, 'success');
                        }}
                          className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-left">
                          <p className="text-xs font-bold text-white">{track.name}</p>
                          <p className="text-[10px] text-gray-400">Difficulty: {track.difficulty} • {track.length}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </SectionCard>
        </div>
      )}

      {tab === 'hunting' && (
        <SectionCard title="🦁 Hunting (South Africa)">
          <div className="grid grid-cols-2 gap-3 text-center text-xs mb-3">
            <div className="bg-gray-700 rounded p-2">
              <p className="text-gray-400">Hunting Skill</p>
              <p className="text-amber-400 font-bold text-lg">{ext.huntingSkill}</p>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <p className="text-gray-400">Total Hunts</p>
              <p className="text-white font-bold text-lg">{ext.totalHunts}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-2">Available Animals:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {huntAnimals.map(animal => {
              const canHunt = store.energy >= animal.energyCost;
              const successChance = Math.max(10, 80 - animal.difficulty * 0.5 + ext.huntingSkill * 2);
              return (
                <div key={animal.id} className={`bg-gray-700 rounded p-2 ${canHunt ? '' : 'opacity-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white">{animal.icon} {animal.name}</p>
                      <p className="text-[10px] text-gray-400">Difficulty: {animal.difficulty}</p>
                      <div className="flex gap-2 mt-1 text-[10px]">
                        <span className="text-green-400">${animal.minReward}-${animal.maxReward}</span>
                        <span className="text-blue-400">{successChance.toFixed(0)}%</span>
                      </div>
                    </div>
                    <button onClick={() => { 
                      ext.hunt(animal.id); 
                      addNotification(`🦁 Hunting ${animal.name}...`, 'info');
                    }}
                      disabled={!canHunt}
                      className="px-2 py-1 bg-orange-700 hover:bg-orange-600 disabled:bg-gray-600 text-white rounded text-[10px]">
                      {animal.energyCost} EN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {message && <p className="text-blue-300 text-sm text-center">{message}</p>}
    </div>
  );
}

function EducationPage() {
  const store = useGameStore();
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(courses.map(c => c.category))];
  const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter);

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    if (store.inEducation) {
      addNotification('❌ Already studying another course!', 'error');
      return;
    }
    if (store.cash < course.cost) {
      addNotification(`❌ Not enough cash! Need $${course.cost.toLocaleString()}`, 'error');
      return;
    }
    if (store.level < course.levelReq) {
      addNotification(`❌ Need Level ${course.levelReq}!`, 'error');
      return;
    }
    
    store.startEducation(courseId);
    let message = `✅ Enrolled in ${course.name}!`;
    if (course.statBonus) {
      message += ` (+${course.bonusAmount} ${course.statBonus})`;
    }
    addNotification(message, 'success');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">📚 Education</h2>
      
      {store.inEducation && (
        <SectionCard>
          <div className="bg-purple-900/30 border border-purple-800 rounded p-4">
            <p className="text-purple-300 font-bold text-center">Currently Studying</p>
            <p className="text-white text-sm text-center mt-2">{courses.find(c => c.id === store.educationCourse)?.name}</p>
            <p className="text-gray-400 text-xs text-center mt-1">Time remaining: {store.educationTimer}s</p>
            {courses.find(c => c.id === store.educationCourse)?.statBonus && (
              <p className="text-green-400 text-xs text-center mt-2">
                Reward: +{courses.find(c => c.id === store.educationCourse)?.bonusAmount} {courses.find(c => c.id === store.educationCourse)?.statBonus}
              </p>
            )}
          </div>
        </SectionCard>
      )}

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Education Benefits:</strong> Courses provide permanent stat boosts, unlock job opportunities, and improve working stats. Some courses also provide gym bonuses and crime benefits.
        </p>
      </div>

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
          const canStart = !store.inEducation && store.cash >= course.cost && store.level >= course.levelReq;
          return (
            <div key={course.id} className={`bg-gray-800 rounded-lg p-3 border ${canStart ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <p className="text-sm font-bold text-white">{course.name}</p>
              <p className="text-[10px] text-gray-400">{course.category} • Lvl {course.levelReq}+</p>
              <div className="flex gap-2 mt-1 text-[10px]">
                <span className="text-green-400">${course.cost.toLocaleString()}</span>
                <span className="text-blue-400">{course.duration}s</span>
              </div>
              {course.statBonus && (
                <p className="text-[10px] text-purple-400 mt-1">
                  Reward: +{course.bonusAmount} {course.statBonus}
                </p>
              )}
              <button onClick={() => handleEnroll(course.id)} disabled={!canStart}
                className="mt-2 w-full px-2 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs">
                Enroll
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PropertiesPage() {
  const store = useGameStore();
  const currentProperty = properties.find(p => p.id === store.currentProperty);

  const handleBuy = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;
    
    if (store.cash < prop.price) {
      addNotification(`❌ Not enough cash! Need $${prop.price.toLocaleString()}`, 'error');
      return;
    }
    if (store.level < prop.levelReq) {
      addNotification(`❌ Need Level ${prop.levelReq}!`, 'error');
      return;
    }
    
    store.buyProperty(propertyId);
    addNotification(`✅ Purchased ${prop.name}! Max Happy: ${prop.maxHappy}`, 'success');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">🏠 Properties</h2>
      
      {currentProperty && (
        <SectionCard title={`Current Property: ${currentProperty.name}`}>
          <div className="bg-gray-700 rounded p-3">
            <p className="text-sm text-gray-300">Max Happy: <span className="text-pink-400 font-bold">{currentProperty.maxHappy}</span></p>
            <p className="text-xs text-gray-400 mt-1">Upkeep: ${currentProperty.upkeep}/day</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {currentProperty.benefits.map(b => (
                <span key={b} className="bg-gray-600 px-2 py-0.5 rounded text-[10px] text-gray-200">{b}</span>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      <div className="bg-pink-900/20 border border-pink-800 rounded-lg p-3">
        <p className="text-xs text-pink-300">
          💡 <strong>Property Benefits:</strong> Properties increase your maximum Happy bar. Higher happy means better gym gains and overall performance. Each property has unique benefits and upkeep costs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {properties.map(prop => {
          const canBuy = store.cash >= prop.price && store.level >= prop.levelReq;
          const owned = store.currentProperty === prop.id;
          return (
            <div key={prop.id} className={`bg-gray-800 rounded-lg p-4 border ${owned ? 'border-green-700' : canBuy ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-white">{prop.name} {owned && <span className="text-green-400 text-xs">(Owned)</span>}</h4>
                  <p className="text-xs text-gray-400 mt-1">Max Happy: <span className="text-pink-400 font-bold">{prop.maxHappy}</span> • Upkeep: ${prop.upkeep}/day</p>
                  <p className="text-[10px] text-gray-500">Lvl {prop.levelReq}+</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prop.benefits.map(b => (
                      <span key={b} className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-300">{b}</span>
                    ))}
                  </div>
                </div>
                {!owned && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-sm">${prop.price.toLocaleString()}</p>
                    <button onClick={() => handleBuy(prop.id)} disabled={!canBuy}
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

function FactionPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'info' | 'warfare' | 'forum'>('info');
  const [factionNameInput, setFactionNameInput] = useState('');

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
                  addNotification(`✅ Joined ${factionNameInput}!`, 'success');
                  setFactionNameInput('');
                }
              }} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm">Join</button>
            </div>
            <button onClick={() => {
              if (store.cash >= 50000 && factionNameInput.trim()) {
                store.createFaction(factionNameInput.trim());
                addNotification(`✅ Created faction: ${factionNameInput}!`, 'success');
                setFactionNameInput('');
              }
            }} disabled={store.cash < 50000}
              className="w-full py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-sm">
              Create New Faction ($50,000)
            </button>
          </div>
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

              <SectionCard title="⛓️ Chain">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">{ext.chainCount}</p>
                  <p className="text-xs text-gray-400">Current chain hits</p>
                  <p className="text-xs text-gray-500 mt-1">Timer: {ext.chainTimer > 0 ? `${ext.chainTimer}s` : 'Inactive'}</p>
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
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

function MessagesPage() {
  const [messages] = useState([
    { id: 1, from: 'System', subject: 'Welcome to Torn City!', body: 'Welcome! Start by training at the gym and committing small crimes.', time: 'Just now', read: false },
    { id: 2, from: 'Bank', subject: 'Bank Account Opened', body: 'Your bank account has been opened. Deposit cash to earn interest.', time: '1m ago', read: false },
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

function ProfilePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'overview' | 'stats' | 'merits' | 'missions' | 'bounty' | 'marriage' | 'hacking' | 'upgrades'>('overview');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-400">👤 Profile</h2>

      <div className="flex flex-wrap gap-2">
        {(['overview', 'stats', 'merits', 'upgrades', 'missions', 'bounty', 'marriage', 'hacking'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize ${tab === t ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {t === 'hacking' ? 'Hacking' : t}
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
            <p className="text-[10px] text-gray-500 mt-2">💡 Train at Gym to increase battle stats</p>
          </SectionCard>

          <SectionCard title="💼 Working Stats">
            <div className="space-y-2">
              <StatBar label="Manual Labor" value={store.manualLabor} color="bg-orange-500" />
              <StatBar label="Intelligence" value={store.intelligence} color="bg-purple-500" />
              <StatBar label="Endurance" value={store.endurance} color="bg-cyan-500" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">💡 Work at Jobs to increase working stats</p>
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
              {([
                { id: 'strength', name: 'Strength', desc: '+5 STR', icon: '💪' },
                { id: 'defense', name: 'Defense', desc: '+5 DEF', icon: '🛡️' },
                { id: 'speed', name: 'Speed', desc: '+5 SPD', icon: '⚡' },
                { id: 'dexterity', name: 'Dexterity', desc: '+5 DEX', icon: '🎯' },
              ]).map(m => (
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

      {tab === 'upgrades' && (
        <div className="space-y-3">
          <SectionCard title="⚡ Energy Upgrades">
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-white">Donator Status</p>
                    <p className="text-xs text-gray-400 mt-1">Increase max Energy from 150 to 250</p>
                  </div>
                  {store.isDonator ? (
                    <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded text-xs font-bold">✓ Active</span>
                  ) : (
                    <button onClick={() => store.buyDonator()} disabled={store.points < 30}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded text-xs font-bold">
                      30 Points
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  <p>Current Max Energy: <span className="text-amber-400 font-bold">{store.maxEnergy}</span></p>
                  {store.isDonator && <p className="text-green-400 mt-1">✓ Donator benefits active</p>}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="📊 Bar Information">
            <div className="space-y-3 text-xs">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚡</span>
                  <p className="font-bold text-white">Energy Bar</p>
                </div>
                <p className="text-gray-400">Default: 150 | Donator: 250</p>
                <p className="text-gray-500 text-[10px] mt-1">Used for gym training, combat, and various activities</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🧠</span>
                  <p className="font-bold text-white">Nerve Bar (NNB)</p>
                </div>
                <p className="text-gray-400">Default: 10 | Max: 60</p>
                <p className="text-gray-500 text-[10px] mt-1">Increases with successful crimes. Used for committing crimes</p>
                <p className="text-amber-400 mt-1">Current NNB: <span className="font-bold">{store.maxNerve}</span>/60</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">😊</span>
                  <p className="font-bold text-white">Happy Bar</p>
                </div>
                <p className="text-gray-400">Default: 150 | Property dependent</p>
                <p className="text-gray-500 text-[10px] mt-1">Increases with better properties. Affects gym gains</p>
                <p className="text-amber-400 mt-1">Current Max: <span className="font-bold">{store.maxHappy}</span></p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">❤️</span>
                  <p className="font-bold text-white">Life Bar</p>
                </div>
                <p className="text-gray-400">Base: 100 | +50 per level</p>
                <p className="text-gray-500 text-[10px] mt-1">Increases automatically when you level up</p>
                <p className="text-amber-400 mt-1">Current Max: <span className="font-bold">{store.maxLife}</span> (Level {store.level})</p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'missions' && (
        <div className="space-y-3">
          <SectionCard title="📋 Missions">
            <p className="text-xs text-gray-400 mb-3">Complete missions to earn credits and rewards. Credits: <span className="text-amber-400 font-bold">{ext.missionCredits}</span></p>
            
            {ext.activeMission ? (
              <div className="bg-blue-900/30 border border-blue-700 rounded p-3">
                <p className="text-sm font-bold text-white">Active Mission: {missions.find(m => m.id === ext.activeMission)?.name}</p>
                <p className="text-xs text-gray-400 mt-1">{missions.find(m => m.id === ext.activeMission)?.description}</p>
                <button onClick={() => {
                  const mission = missions.find(m => m.id === ext.activeMission);
                  if (mission) {
                    useGameStore.setState({ 
                      cash: store.cash + mission.reward,
                      totalCashEarned: store.totalCashEarned + mission.reward
                    });
                    useExtendedStore.setState({
                      activeMission: null,
                      completedMissions: [...ext.completedMissions, mission.id],
                      missionCredits: ext.missionCredits + mission.credits
                    });
                  }
                }} className="mt-2 w-full py-2 bg-green-700 hover:bg-green-600 text-white rounded text-xs">
                  Complete Mission
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {missions.map(mission => {
                  const canStart = store.level >= mission.levelReq;
                  return (
                    <div key={mission.id} className={`bg-gray-700 rounded p-2 ${canStart ? '' : 'opacity-50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-white">{mission.name}</p>
                          <p className="text-[10px] text-gray-400">{mission.description}</p>
                          <div className="flex gap-2 mt-1 text-[10px]">
                            <span className="text-green-400">${mission.reward.toLocaleString()}</span>
                            <span className="text-amber-400">+{mission.credits} credits</span>
                          </div>
                        </div>
                        <button onClick={() => ext.startMission(mission.id)} disabled={!canStart}
                          className="px-2 py-1 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded text-[10px]">
                          Start
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {tab === 'bounty' && (
        <div className="space-y-3">
          <SectionCard title="🎯 Bounty Hunter">
            <p className="text-xs text-gray-400 mb-3">Collect bounties by hunting down targets. Bounties collected: <span className="text-amber-400 font-bold">{ext.bountiesCollected}</span></p>
            
            <div className="space-y-2">
              {bounties.map(bounty => {
                const isActive = ext.activeBounties.includes(bounty.id);
                const canTake = store.level >= bounty.difficulty * 3 && !isActive;
                return (
                  <div key={bounty.id} className={`bg-gray-700 rounded p-2 ${isActive ? 'border border-amber-600' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-white">{bounty.target}</p>
                        <p className="text-[10px] text-gray-400">Difficulty: {bounty.difficulty} • Time limit: {bounty.timeLimit} min</p>
                        <p className="text-[10px] text-green-400 mt-1">Reward: ${bounty.reward.toLocaleString()}</p>
                      </div>
                      {isActive ? (
                        <button onClick={() => {
                          useGameStore.setState({ 
                            cash: store.cash + bounty.reward,
                            totalCashEarned: store.totalCashEarned + bounty.reward
                          });
                          useExtendedStore.setState({
                            activeBounties: ext.activeBounties.filter(b => b !== bounty.id),
                            bountiesCollected: ext.bountiesCollected + 1
                          });
                        }} className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-[10px]">
                          Collect
                        </button>
                      ) : (
                        <button onClick={() => ext.acceptBounty(bounty.id)} disabled={!canTake}
                          className="px-2 py-1 bg-amber-700 hover:bg-amber-600 disabled:bg-gray-600 text-white rounded text-[10px]">
                          Accept
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'marriage' && (
        <div className="space-y-3">
          <SectionCard title="💍 Marriage">
            {ext.marriedTo ? (
              <div className="bg-pink-900/30 border border-pink-700 rounded p-3 text-center">
                <p className="text-sm font-bold text-white">Married to: {marriageCandidates.find(c => c.id === ext.marriedTo)?.name}</p>
                <p className="text-xs text-gray-400 mt-1">Marriage days: {ext.marriageDays}</p>
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {marriageCandidates.find(c => c.id === ext.marriedTo)?.benefits.map(b => (
                    <span key={b} className="bg-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-300">{b}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-2">Propose to a candidate:</p>
                {marriageCandidates.map(candidate => (
                  <div key={candidate.id} className="bg-gray-700 rounded p-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-white">{candidate.name}</p>
                        <p className="text-[10px] text-gray-400">Level {candidate.level}</p>
                        <div className="flex gap-2 mt-1 text-[10px]">
                          <span className="text-red-400">STR: {candidate.stats.strength}</span>
                          <span className="text-blue-400">SPD: {candidate.stats.speed}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.benefits.map(b => (
                            <span key={b} className="bg-gray-600 px-1.5 py-0.5 rounded text-[9px] text-gray-300">{b}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => ext.proposeMarriage(candidate.id)}
                        className="px-2 py-1 bg-pink-700 hover:bg-pink-600 text-white rounded text-[10px]">
                        Propose
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {tab === 'hacking' && (
        <div className="space-y-3">
          <SectionCard title="💻 Hacking & Viruses">
            <p className="text-xs text-gray-400 mb-3">Create and sell viruses. Hacking skill: <span className="text-amber-400 font-bold">{ext.hackingSkill}</span></p>
            
            <div className="space-y-2">
              {viruses.map(virus => {
                const canCreate = store.level >= virus.level;
                const created = ext.createdViruses.includes(virus.id);
                return (
                  <div key={virus.id} className={`bg-gray-700 rounded p-2 ${created ? 'border border-green-700' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-white">{virus.name}</p>
                        <p className="text-[10px] text-gray-400">{virus.effect}</p>
                        <div className="flex gap-2 mt-1 text-[10px]">
                          <span className="text-red-400">Cost: ${virus.cost.toLocaleString()}</span>
                          <span className="text-green-400">Sell: ${virus.sellPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      {created ? (
                        <span className="text-[10px] text-green-400 font-bold">✓ Created</span>
                      ) : (
                        <button onClick={() => {
                          if (store.cash >= virus.cost) {
                            useGameStore.setState({ cash: store.cash - virus.cost });
                            ext.createVirus(virus.id);
                          }
                        }} disabled={!canCreate || store.cash < virus.cost}
                          className="px-2 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded text-[10px]">
                          Create
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
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
