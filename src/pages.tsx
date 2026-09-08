import { useState } from 'react';
import { useGameStore } from './store';
import { useExtendedStore } from './store2';
import { organizedCrimes, territories, cars, raceTracks, huntAnimals, missions, awards, companies, bounties, collections, viruses, marriageCandidates } from './data2';
import { items } from './data';

// ============ FACTION WARFARE PAGE ============
export function FactionWarfarePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'territory' | 'chain' | 'raid' | 'war' | 'bomb'>('territory');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">⚔️ Faction Warfare</h2>
      <p className="text-gray-400">Manage territory, chains, raids, and wars for your faction.</p>

      {!store.factionName ? (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300">
          You need to join or create a faction first!
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {(['territory', 'chain', 'raid', 'war', 'bomb'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg font-medium capitalize text-sm transition-colors ${
                  tab === t ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {t === 'territory' && '🗺️ Territory'}
                {t === 'chain' && '⛓️ Chain'}
                {t === 'raid' && '💥 Raids'}
                {t === 'war' && '🏆 Ranked War'}
                {t === 'bomb' && '💣 Dirty Bomb'}
              </button>
            ))}
          </div>

          {message && (
            <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
          )}

          {tab === 'territory' && (
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="font-bold text-white mb-2">Your Territories ({ext.factionTerritories.filter(t => t.controlled).length})</h3>
                {ext.factionTerritories.length === 0 ? (
                  <p className="text-gray-500 text-sm">No territories controlled yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ext.factionTerritories.filter(t => t.controlled).map(ft => {
                      const territory = territories.find(t => t.id === ft.territoryId);
                      return (
                        <div key={ft.territoryId} className="bg-gray-700 rounded p-3">
                          <h4 className="font-bold text-white text-sm">{territory?.name}</h4>
                          <p className="text-xs text-gray-400">Respect: {ft.respect} | Racket: Lvl {ft.racketLevel}</p>
                          <p className="text-xs text-green-400">Daily: +{territory?.dailyRespect} respect</p>
                          {territory?.racket && <p className="text-xs text-amber-400">Racket: {territory.racket}</p>}
                          <button
                            onClick={() => { ext.attackTerritory(ft.territoryId); setMessage('Defending territory...'); }}
                            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
                          >
                            Defend
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="font-bold text-white mb-2">Available Territories</h3>
                <div className="space-y-2">
                  {territories.filter(t => !ext.factionTerritories.find(ft => ft.territoryId === t.id)).map(t => (
                    <div key={t.id} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                        <p className="text-xs text-gray-400">{t.district} | Level {t.level} | +{t.dailyRespect} respect/day</p>
                        {t.racket && <p className="text-xs text-amber-400">Racket: {t.racket}</p>}
                      </div>
                      <button
                        onClick={() => { ext.claimTerritory(t.id); setMessage(`Claimed ${t.name}!`); }}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-medium"
                      >
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'chain' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                <h3 className="text-lg font-bold text-amber-400 mb-4">⛓️ Faction Chain</h3>
                <div className="text-4xl font-bold text-white mb-2">{ext.chain.hits}</div>
                <p className="text-gray-400">Best: {ext.chain.best} hits</p>
                {ext.chain.active && <p className="text-orange-400 mt-2">Timer: {ext.chain.timer}s</p>}
                {ext.chain.cooldown > 0 && <p className="text-red-400 mt-2">Cooldown: {ext.chain.cooldown}s</p>}

                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                  {[10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].map(m => (
                    <span key={m} className={`px-2 py-1 rounded ${ext.chain.hits >= m ? 'bg-green-700 text-green-300' : 'bg-gray-700 text-gray-500'}`}>
                      {m >= 1000 ? `${m/1000}k` : m}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => { ext.advanceChain(); setMessage('Chain hit added!'); }}
                  disabled={ext.chain.cooldown > 0}
                  className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 text-white rounded-lg font-bold"
                >
                  Hit Chain!
                </button>
              </div>
            </div>
          )}

          {tab === 'raid' && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-amber-400 mb-4">💥 Faction Raids</h3>
              <p className="text-gray-400 mb-4">Attack rival factions to destroy their respect.</p>
              <div className="space-y-3">
                {['The Mafia', 'Street Kings', 'Dark Brotherhood', 'Iron Fist'].map(faction => (
                  <div key={faction} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{faction}</h4>
                      <p className="text-xs text-gray-400">Respect: {Math.floor(Math.random() * 5000 + 1000)}</p>
                    </div>
                    <button
                      onClick={() => {
                        const won = Math.random() < 0.5;
                        if (won) {
                          useExtendedStore.setState({ raidsWon: ext.raidsWon + 1 });
                          setMessage(`Raid on ${faction} successful!`);
                        } else {
                          setMessage(`Raid on ${faction} failed!`);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded font-medium"
                    >
                      Raid
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">Raids Won: <span className="text-amber-400">{ext.raidsWon}</span></p>
            </div>
          )}

          {tab === 'war' && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-amber-400 mb-4">🏆 Ranked Wars</h3>
              <p className="text-gray-400 mb-4">Compete against matched factions for glory and rewards.</p>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">Active War</h4>
                      <p className="text-xs text-gray-400">vs The Syndicate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">Score: {ext.factionWars * 100}</p>
                      <p className="text-xs text-gray-400">Wars: {ext.factionWars}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const won = Math.random() < 0.5;
                      if (won) {
                        useExtendedStore.setState({ factionWars: ext.factionWars + 1 });
                        setMessage('War victory! +100 score');
                      } else {
                        setMessage('War defeat!');
                      }
                    }}
                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium"
                  >
                    Fight in War
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'bomb' && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-amber-400 mb-4">💣 Dirty Bomb</h3>
              <p className="text-gray-400 mb-4">Deploy a dirty bomb to devastate enemy factions.</p>
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-red-300">⚠️ Warning</h4>
                <p className="text-sm text-gray-300">Dirty bombs cause radiation, hospital time, and destroy rackets.</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• Reduces target faction respect</li>
                  <li>• Causes radiation poisoning</li>
                  <li>• Hospital time for enemies</li>
                  <li>• Cancels active Organized Crimes</li>
                  <li>• Destroys active rackets</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  useExtendedStore.setState({ dirtyBombsUsed: ext.dirtyBombsUsed + 1 });
                  setMessage('Dirty bomb deployed! 💥');
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
              >
                💣 Deploy Dirty Bomb
              </button>
              <p className="text-sm text-gray-400 mt-4">Bombs used: <span className="text-red-400">{ext.dirtyBombsUsed}</span></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============ ORGANIZED CRIME PAGE ============
export function OrganizedCrimePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleOC = (ocId: string) => {
    if (!store.factionName) {
      setMessage('You need a faction to do Organized Crime!');
      return;
    }
    ext.startOrganizedCrime(ocId);
    setMessage('Organized Crime initiated!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🕵️ Organized Crime</h2>
      <p className="text-gray-400">Coordinate with faction members for large-scale criminal operations.</p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {organizedCrimes.map(oc => {
          const canDo = store.factionName && store.level >= oc.levelReq;
          return (
            <div key={oc.id} className={`bg-gray-800 rounded-lg p-4 border ${canDo ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {oc.name}
                    <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded">Tier {oc.tier}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Members: {oc.members}</span>
                    <span>Nerve: {oc.nerveCost}</span>
                    <span>Duration: {oc.duration} ticks</span>
                    <span>Lvl {oc.levelReq}+</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs">
                    <span className="text-green-400">${oc.minReward.toLocaleString()} - ${oc.maxReward.toLocaleString()}</span>
                    <span className="text-amber-400">+{oc.respectReward} respect</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {oc.roles.map(role => (
                      <span key={role} className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">{role}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => canDo && handleOC(oc.id)}
                  disabled={!canDo}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
                >
                  Start OC
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ RACING PAGE ============
export function RacingPage() {
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');

  const handleRace = () => {
    if (!selectedTrack) {
      setMessage('Select a track first!');
      return;
    }
    ext.startRace(selectedTrack);
    setMessage('Race completed!');
  };

  const handleBuyCar = (carId: string) => {
    ext.buyCar(carId);
    setMessage('Car purchased!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏎️ Raceway</h2>
      <p className="text-gray-400">Race cars and improve your racing skill.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-gray-400">Racing Skill:</span> <span className="text-amber-400">{ext.racing.racingSkill.toFixed(1)}/100</span></div>
          <div><span className="text-gray-400">Races Won:</span> <span className="text-white">{ext.racing.racesWon}</span></div>
          <div><span className="text-gray-400">Total Races:</span> <span className="text-white">{ext.racing.racesTotal}</span></div>
          <div><span className="text-gray-400">Win Rate:</span> <span className="text-green-400">{ext.racing.racesTotal > 0 ? ((ext.racing.racesWon / ext.racing.racesTotal) * 100).toFixed(1) : 0}%</span></div>
        </div>
      </div>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold text-white mb-3">Your Cars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cars.filter(c => ext.racing.ownedCars.includes(c.id)).map(car => (
            <div key={car.id} className={`bg-gray-700 rounded p-3 ${ext.racing.currentCar === car.id ? 'border-2 border-amber-500' : ''}`}>
              <h4 className="font-bold text-white">{car.name}</h4>
              <p className="text-xs text-gray-400">{car.class} Class</p>
              <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                <div>SPD: {car.speed}</div>
                <div>ACC: {car.acceleration}</div>
                <div>HND: {car.handling}</div>
              </div>
              {ext.racing.currentCar !== car.id && (
                <button
                  onClick={() => useExtendedStore.setState({ racing: { ...ext.racing, currentCar: car.id } })}
                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
                >
                  Equip
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold text-white mb-3">Available Cars</h3>
        <div className="space-y-2">
          {cars.filter(c => !ext.racing.ownedCars.includes(c.id)).map(car => (
            <div key={car.id} className="bg-gray-700 rounded p-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm">{car.name}</h4>
                <p className="text-xs text-gray-400">{car.class} | Lvl {car.levelReq}+</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-sm">${car.price.toLocaleString()}</p>
                <button
                  onClick={() => handleBuyCar(car.id)}
                  className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="font-bold text-white mb-3">Race Tracks</h3>
        <div className="space-y-2">
          {raceTracks.map(track => (
            <div key={track.id} className="bg-gray-700 rounded p-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm">{track.name}</h4>
                <p className="text-xs text-gray-400">Difficulty: {'⭐'.repeat(track.difficulty)} | {track.length}</p>
              </div>
              <button
                onClick={() => { setSelectedTrack(track.id); handleRace(); }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium"
              >
                Race
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ HUNTING PAGE ============
export function HuntingPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleHunt = (animalId: string) => {
    if (store.energy < 5) {
      setMessage('Not enough energy!');
      return;
    }
    ext.goHunting(animalId);
    setMessage('Hunting...');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🦁 Hunting</h2>
      <p className="text-gray-400">Travel to South Africa and hunt exotic animals for profit.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><span className="text-gray-400">Hunting Skill:</span> <span className="text-amber-400">{ext.hunting.huntingSkill.toFixed(1)}/100</span></div>
          <div><span className="text-gray-400">Total Hunts:</span> <span className="text-white">{ext.hunting.totalHunts}</span></div>
          <div><span className="text-gray-400">Species Found:</span> <span className="text-white">{Object.keys(ext.hunting.animalsKilled).length}</span></div>
        </div>
      </div>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {huntAnimals.map(animal => {
          const successChance = Math.min(90, 50 + ext.hunting.huntingSkill * 2 - animal.difficulty);
          return (
            <div key={animal.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white">{animal.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Difficulty: {'⭐'.repeat(Math.ceil(animal.difficulty / 20))}</span>
                    <span>Energy: {animal.energyCost}</span>
                    <span>${animal.minReward}-${animal.maxReward}</span>
                    <span className={successChance > 60 ? 'text-green-400' : successChance > 40 ? 'text-yellow-400' : 'text-red-400'}>
                      Success: {successChance.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Killed: {ext.hunting.animalsKilled[animal.id] || 0} times</p>
                </div>
                <button
                  onClick={() => handleHunt(animal.id)}
                  disabled={store.energy < animal.energyCost}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
                >
                  Hunt
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ MISSIONS PAGE ============
export function MissionsPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleStart = (missionId: string) => {
    ext.startMission(missionId);
    setMessage('Mission accepted!');
  };

  const handleComplete = () => {
    ext.completeMission();
    setMessage('Mission completed!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">📋 Missions</h2>
      <p className="text-gray-400">Complete missions for NPCs to earn rewards and credits.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex gap-4 text-sm">
          <div><span className="text-gray-400">Credits:</span> <span className="text-amber-400">{ext.missionState.credits}</span></div>
          <div><span className="text-gray-400">Completed:</span> <span className="text-white">{ext.missionState.completedMissions.length}</span></div>
        </div>
      </div>

      {ext.missionState.activeMission && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
          <h3 className="font-bold text-green-300">Active Mission: {missions.find(m => m.id === ext.missionState.activeMission)?.name}</h3>
          <p className="text-sm text-gray-300">{missions.find(m => m.id === ext.missionState.activeMission)?.objective}</p>
          <button
            onClick={handleComplete}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium"
          >
            Complete Mission
          </button>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {missions.map(mission => {
          const completed = ext.missionState.completedMissions.includes(mission.id);
          const active = ext.missionState.activeMission === mission.id;
          const canStart = store.level >= mission.levelReq && !ext.missionState.activeMission;

          return (
            <div key={mission.id} className={`bg-gray-800 rounded-lg p-4 border ${completed ? 'border-green-700' : canStart ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {mission.name}
                    {completed && <span className="text-green-400 text-xs">✅</span>}
                  </h4>
                  <p className="text-sm text-gray-400">{mission.description}</p>
                  <p className="text-xs text-amber-400 mt-1">NPC: {mission.npc}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Objective: {mission.objective}</span>
                    <span>Lvl {mission.levelReq}+</span>
                    <span className="text-green-400">${mission.reward.toLocaleString()}</span>
                    <span className="text-purple-400">+{mission.xpReward} XP</span>
                  </div>
                </div>
                {!completed && !active && (
                  <button
                    onClick={() => canStart && handleStart(mission.id)}
                    disabled={!canStart}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ AWARDS PAGE ============
export function AwardsPage() {
  const store = useGameStore();
  const ext = useExtendedStore();

  const checkAward = (award: typeof awards[0]): boolean => {
    try {
      const req = award.requirement;
      if (req.includes('totalCrimes')) return store.totalCrimes >= parseInt(req.split('>=')[1]);
      if (req.includes('totalAttacks')) return store.totalAttacks >= parseInt(req.split('>=')[1]);
      if (req.includes('totalMugs')) return store.totalMugs >= parseInt(req.split('>=')[1]);
      if (req.includes('totalHospitalized')) return store.totalHospitalized >= parseInt(req.split('>=')[1]);
      if (req.includes('level')) return store.level >= parseInt(req.split('>=')[1]);
      if (req.includes('totalCashEarned')) return store.totalCashEarned >= parseInt(req.split('>=')[1]);
    } catch { return false; }
    return false;
  };

  const earnedCount = awards.filter(a => checkAward(a)).length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏆 Awards</h2>
      <p className="text-gray-400">Earn awards by completing achievements. Progress: {earnedCount}/{awards.length}</p>

      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${(earnedCount / awards.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {awards.map(award => {
          const earned = checkAward(award);
          return (
            <div key={award.id} className={`bg-gray-800 rounded-lg p-4 border ${earned ? 'border-amber-600' : 'border-gray-700 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{award.icon}</span>
                <div>
                  <h4 className="font-bold text-white text-sm">{award.name}</h4>
                  <p className="text-xs text-gray-400">{award.description}</p>
                  <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${earned ? 'bg-amber-900 text-amber-300' : 'bg-gray-700 text-gray-500'}`}>
                    {award.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ COMPANY PAGE ============
export function CompanyPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleBuy = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (!company || store.cash < company.cost) {
      setMessage('Not enough cash!');
      return;
    }
    useGameStore.setState({ cash: store.cash - company.cost });
    ext.buyCompany(companyId);
    setMessage(`Bought ${company.name}!`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏢 Companies</h2>
      <p className="text-gray-400">Own and manage your own company.</p>

      {ext.companyState.ownedCompany && (
        <div className="bg-green-900/50 border border-green-700 rounded-xl p-6">
          <h3 className="font-bold text-green-300 text-lg">Your Company: {companies.find(c => c.id === ext.companyState.ownedCompany)?.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
            <div><span className="text-gray-400">Level:</span> <span className="text-white">{ext.companyState.companyLevel}</span></div>
            <div><span className="text-gray-400">Stars:</span> <span className="text-amber-400">{'⭐'.repeat(ext.companyState.companyStars)}</span></div>
            <div><span className="text-gray-400">Employees:</span> <span className="text-white">{ext.companyState.employees}/{companies.find(c => c.id === ext.companyState.ownedCompany)?.maxEmployees}</span></div>
            <div><span className="text-gray-400">Profit:</span> <span className="text-green-400">${ext.companyState.companyProfit.toLocaleString()}</span></div>
          </div>
          <button
            onClick={() => { ext.workCompany(); setMessage('Worked at company!'); }}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium"
          >
            Work Shift
          </button>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {companies.map(company => {
          const owned = ext.companyState.ownedCompany === company.id;
          const canBuy = store.cash >= company.cost && store.level >= company.levelReq && !ext.companyState.ownedCompany;
          return (
            <div key={company.id} className={`bg-gray-800 rounded-lg p-4 border ${owned ? 'border-green-700' : canBuy ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white">{company.name} {owned && <span className="text-green-400 text-xs">(Owned)</span>}</h4>
                  <p className="text-sm text-gray-400">{company.type}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Lvl {company.levelReq}+</span>
                    <span>Max Staff: {company.maxEmployees}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {company.specialties.map(s => (
                      <span key={s} className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">{s}</span>
                    ))}
                  </div>
                </div>
                {!owned && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${company.cost.toLocaleString()}</p>
                    <button
                      onClick={() => canBuy && handleBuy(company.id)}
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

// ============ BOUNTY PAGE ============
export function BountyPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleTake = (bountyId: string) => {
    ext.takeBounty(bountyId);
    setMessage('Bounty accepted!');
  };

  const handleHunt = () => {
    ext.huntBounty();
    setMessage('Hunting target...');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🎯 Bounties</h2>
      <p className="text-gray-400">Take bounties on criminals and hunt them down for rewards.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <p className="text-sm"><span className="text-gray-400">Bounties Completed:</span> <span className="text-amber-400">{ext.bountiesCompleted}</span></p>
      </div>

      {ext.activeBounty && (
        <div className="bg-orange-900/50 border border-orange-700 rounded-lg p-4">
          <h3 className="font-bold text-orange-300">Active Bounty: {bounties.find(b => b.id === ext.activeBounty)?.target}</h3>
          <p className="text-sm text-gray-300">Reward: ${bounties.find(b => b.id === ext.activeBounty)?.reward.toLocaleString()}</p>
          <button
            onClick={handleHunt}
            className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium"
          >
            Hunt Target
          </button>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {bounties.map(bounty => (
          <div key={bounty.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h4 className="font-bold text-white">{bounty.target}</h4>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                  <span>Lvl {bounty.level}</span>
                  <span>STR: {bounty.strength}</span>
                  <span>SPD: {bounty.speed}</span>
                  <span>DEF: {bounty.defense}</span>
                  <span>DEX: {bounty.dexterity}</span>
                </div>
                <p className="text-sm text-green-400 mt-1">Reward: ${bounty.reward.toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleTake(bounty.id)}
                disabled={!!ext.activeBounty}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
              >
                Take Bounty
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ COLLECTIONS PAGE ============
export function CollectionsPage() {
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleCollect = (collectionId: string, itemId: string) => {
    ext.collectItem(collectionId, itemId);
    setMessage('Item added to collection!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏛️ Museum & Collections</h2>
      <p className="text-gray-400">Collect items to complete collections and earn rewards.</p>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-4">
        {collections.map(collection => {
          const collected = ext.collectionState.collected[collection.id] || [];
          const completed = ext.collectionState.completedCollections.includes(collection.id);
          const progress = (collected.length / collection.items.length) * 100;

          return (
            <div key={collection.id} className={`bg-gray-800 rounded-xl p-4 border ${completed ? 'border-amber-600' : 'border-gray-700'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white">{collection.name}</h3>
                {completed && <span className="text-amber-400 text-sm">✅ Complete! +${collection.reward.toLocaleString()}</span>}
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {collection.items.map(item => {
                  const has = collected.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => !has && handleCollect(collection.id, item)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        has ? 'bg-green-700 text-green-300' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {has ? '✅' : '❓'} {item}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">{collected.length}/{collection.items.length} collected</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ MARRIAGE PAGE ============
export function MarriagePage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handlePropose = (candidateId: string) => {
    ext.proposeMarriage(candidateId);
    setMessage('Proposal sent!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">💍 Marriage</h2>
      <p className="text-gray-400">Find a partner and get married for shared benefits.</p>

      {ext.marriageState.married ? (
        <div className="bg-pink-900/50 border border-pink-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-pink-300">💕 Married to {ext.marriageState.spouse}</h3>
          <p className="text-gray-300 mt-2">Marriage Duration: {ext.marriageState.marriageDays} days</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-gray-400">Marriage Benefits:</p>
            <ul className="text-gray-300 space-y-1">
              <li>• Shared housing</li>
              <li>• Happiness bonus</li>
              <li>• Joint bank account</li>
              <li>• Marriage perks</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {message && (
            <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
          )}

          <div className="space-y-3">
            {marriageCandidates.map(candidate => (
              <div key={candidate.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{candidate.name}</h4>
                    <p className="text-xs text-gray-400">Level {candidate.level} | Total Stats: {candidate.stats}</p>
                  </div>
                  <button
                    onClick={() => handlePropose(candidate.id)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-medium"
                  >
                    💍 Propose
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============ VIRUS/HACKING PAGE ============
export function HackingPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [message, setMessage] = useState('');

  const handleCreate = (virusId: string) => {
    const virus = viruses.find(v => v.id === virusId);
    if (!virus || store.cash < virus.cost) {
      setMessage('Not enough cash!');
      return;
    }
    useGameStore.setState({ cash: store.cash - virus.cost });
    ext.createVirus(virusId);
    setMessage(`Created ${virus.name}!`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">💻 Virus Programming</h2>
      <p className="text-gray-400">Create and sell viruses for profit and crime.</p>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-400">Hacking Skill:</span> <span className="text-amber-400">{ext.virusState.hackingSkill.toFixed(1)}</span></div>
          <div><span className="text-gray-400">Viruses Created:</span> <span className="text-white">{ext.virusState.createdViruses.length}</span></div>
          <div><span className="text-gray-400">Viruses Sold:</span> <span className="text-white">{ext.virusState.virusesSold}</span></div>
        </div>
      </div>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      <div className="space-y-3">
        {viruses.map(virus => {
          const created = ext.virusState.createdViruses.includes(virus.id);
          const canCreate = store.cash >= virus.cost && store.level >= virus.levelReq && !created;
          return (
            <div key={virus.id} className={`bg-gray-800 rounded-lg p-4 border ${created ? 'border-green-700' : canCreate ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {virus.name}
                    {created && <span className="text-green-400 text-xs">✅ Created</span>}
                  </h4>
                  <p className="text-sm text-gray-400">{virus.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{virus.effect}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                    <span>Power: {virus.power}</span>
                    <span>Lvl {virus.levelReq}+</span>
                  </div>
                </div>
                {!created && (
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${virus.cost.toLocaleString()}</p>
                    <button
                      onClick={() => canCreate && handleCreate(virus.id)}
                      disabled={!canCreate}
                      className="mt-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium"
                    >
                      Create
                    </button>
                  </div>
                )}
                {created && (
                  <button
                    onClick={() => { ext.useVirus(virus.id); setMessage(`Used ${virus.name}!`); }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium"
                  >
                    Use/Sell
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ BAZAAR & AUCTION PAGE ============
export function BazaarPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [tab, setTab] = useState<'bazaar' | 'auction'>('bazaar');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🏪 Bazaar & Auction</h2>
      <p className="text-gray-400">Buy and sell items through player markets.</p>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('bazaar')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${tab === 'bazaar' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          🏪 Bazaar
        </button>
        <button
          onClick={() => setTab('auction')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${tab === 'auction' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          🔨 Auction House
        </button>
      </div>

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}

      {tab === 'bazaar' && (
        <div className="space-y-3">
          {ext.bazaarListings.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-500">
              No listings available. Check back later!
            </div>
          ) : (
            ext.bazaarListings.map(listing => (
              <div key={listing.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{listing.itemName} x{listing.quantity}</h4>
                  <p className="text-xs text-gray-400">Seller: {listing.seller}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">${listing.price.toLocaleString()}</p>
                  <button
                    onClick={() => {
                      if (store.cash >= listing.price) {
                        useGameStore.setState({ cash: store.cash - listing.price });
                        useGameStore.getState().buyItem(listing.itemId);
                        useExtendedStore.setState({
                          bazaarListings: ext.bazaarListings.filter(l => l.id !== listing.id)
                        });
                        setMessage(`Bought ${listing.itemName}!`);
                      } else {
                        setMessage('Not enough cash!');
                      }
                    }}
                    className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'auction' && (
        <div className="space-y-3">
          {ext.auctionListings.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-500">
              No active auctions. Check back later!
            </div>
          ) : (
            ext.auctionListings.map(listing => (
              <div key={listing.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h4 className="font-bold text-white">{listing.itemName}</h4>
                    <p className="text-xs text-gray-400">Seller: {listing.seller}</p>
                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="text-amber-400">Current Bid: ${listing.currentBid.toLocaleString()}</span>
                      <span className="text-green-400">Buy Now: ${listing.buyNow.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-orange-400 mt-1">Time Left: {listing.timeLeft} ticks</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const bid = listing.currentBid + 500;
                        if (store.cash >= bid) {
                          useGameStore.setState({ cash: store.cash - bid });
                          ext.bidAuction(listing.id, bid);
                          setMessage(`Bid $${bid.toLocaleString()}!`);
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded font-medium"
                    >
                      Bid +$500
                    </button>
                    <button
                      onClick={() => {
                        if (store.cash >= listing.buyNow) {
                          useGameStore.setState({ cash: store.cash - listing.buyNow });
                          useGameStore.getState().buyItem(listing.itemId);
                          useExtendedStore.setState({
                            auctionListings: ext.auctionListings.filter(l => l.id !== listing.id)
                          });
                          setMessage(`Bought for $${listing.buyNow.toLocaleString()}!`);
                        }
                      }}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-medium"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============ LOAN SHARK PAGE ============
export function LoanSharkPage() {
  const store = useGameStore();
  const ext = useExtendedStore();
  const [loanAmount, setLoanAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleLoan = () => {
    if (loanAmount <= 0 || ext.loanAmount > 0) return;
    useGameStore.setState({ cash: store.cash + loanAmount });
    ext.takeLoan(loanAmount);
    setMessage(`Borrowed $${loanAmount.toLocaleString()}!`);
    setLoanAmount(0);
  };

  const handleRepay = () => {
    const total = ext.loanAmount + ext.loanInterest;
    if (store.cash < total) {
      setMessage('Not enough cash to repay!');
      return;
    }
    useGameStore.setState({ cash: store.cash - total });
    ext.repayLoan();
    setMessage('Loan repaid!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">🦈 Loan Shark</h2>
      <p className="text-gray-400">Borrow money at high interest rates. Be careful!</p>

      {ext.loanAmount > 0 ? (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6">
          <h3 className="font-bold text-red-300 text-lg">Outstanding Loan</h3>
          <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
            <div><span className="text-gray-400">Principal:</span> <span className="text-white">${ext.loanAmount.toLocaleString()}</span></div>
            <div><span className="text-gray-400">Interest:</span> <span className="text-red-400">${ext.loanInterest.toLocaleString()}</span></div>
            <div><span className="text-gray-400">Total Due:</span> <span className="text-red-400 font-bold">${(ext.loanAmount + ext.loanInterest).toLocaleString()}</span></div>
          </div>
          <p className="text-xs text-orange-400 mt-2">Due in: {ext.loanDueDay} ticks</p>
          <button
            onClick={handleRepay}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
          >
            Repay ${(ext.loanAmount + ext.loanInterest).toLocaleString()}
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-bold text-white mb-3">Take a Loan</h3>
          <p className="text-sm text-gray-400 mb-3">Interest rate: 20% | Due in 30 ticks</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={loanAmount || ''}
              onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
              placeholder="Amount..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleLoan}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
            >
              Borrow
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            {[1000, 5000, 10000, 50000, 100000].map(amt => (
              <button key={amt} onClick={() => setLoanAmount(amt)} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-blue-300 text-sm">{message}</div>
      )}
    </div>
  );
}

// ============ NEWSPAPER PAGE ============
export function NewspaperPage() {
  const ext = useExtendedStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">📰 Torn City Times</h2>
      <p className="text-gray-400">Stay updated with the latest news from Torn City.</p>

      {ext.newsEvents.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-500">
          No news yet. Events will appear as you play.
        </div>
      ) : (
        <div className="space-y-3">
          {ext.newsEvents.map(event => (
            <div key={event.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">{event.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{event.content}</p>
                </div>
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">{event.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
