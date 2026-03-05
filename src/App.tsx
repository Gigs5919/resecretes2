import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Users, Calendar, Sparkles, MessageSquare, Briefcase, BookOpen, Search } from 'lucide-react';

const tabImporters = {
  rencontres: () => import('./components/Rencontres'),
  evenements: () => import('./components/Evenements'),
  collaborations: () => import('./components/Collaborations'),
  temoignages: () => import('./components/Temoignages'),
  catalogue: () => import('./components/CatalogueSecret'),
};

const Rencontres = lazy(tabImporters.rencontres);
const Evenements = lazy(tabImporters.evenements);
const Collaborations = lazy(tabImporters.collaborations);
const Temoignages = lazy(tabImporters.temoignages);
const CatalogueSecret = lazy(tabImporters.catalogue);

type Tab = 'rencontres' | 'evenements' | 'collaborations' | 'temoignages' | 'catalogue';

const DEFAULT_TAB: Tab = 'rencontres';
const STORAGE_KEY = 'res-active-tab';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(DEFAULT_TAB);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = useMemo(
    () => [
      { id: 'rencontres' as Tab, name: 'Rencontres', icon: Users, color: 'blue', description: 'Agenda des rencontres à venir' },
      { id: 'evenements' as Tab, name: 'Événements', icon: Calendar, color: 'green', description: 'Sorties et rendez-vous spéciaux' },
      {
        id: 'collaborations' as Tab,
        name: 'Collaborations',
        icon: Sparkles,
        color: 'amber',
        description: 'Idées de projets entre membres',
      },
      {
        id: 'temoignages' as Tab,
        name: 'Témoignages',
        icon: MessageSquare,
        color: 'teal',
        description: 'Retours d’expérience de la communauté',
      },
      {
        id: 'catalogue' as Tab,
        name: 'Catalogue Secret',
        icon: Briefcase,
        color: 'slate',
        description: 'Prestations et expertises disponibles',
      },
    ],
    []
  );

  const filteredTabs = tabs.filter((tab) => `${tab.name} ${tab.description}`.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const hashTab = window.location.hash.replace('#', '') as Tab;
    const savedTab = localStorage.getItem(STORAGE_KEY) as Tab | null;
    const validTabs = new Set(tabs.map((tab) => tab.id));

    if (hashTab && validTabs.has(hashTab)) {
      setActiveTab(hashTab);
      return;
    }

    if (savedTab && validTabs.has(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeTab);
    window.history.replaceState(null, '', `#${activeTab}`);
  }, [activeTab]);

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: { [key: string]: { active: string; inactive: string } } = {
      blue: {
        active: 'bg-blue-600 text-white shadow-md shadow-blue-200',
        inactive: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
      },
      green: {
        active: 'bg-green-600 text-white shadow-md shadow-green-200',
        inactive: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
      },
      amber: {
        active: 'bg-amber-600 text-white shadow-md shadow-amber-200',
        inactive: 'text-gray-600 hover:text-amber-600 hover:bg-amber-50',
      },
      teal: {
        active: 'bg-teal-600 text-white shadow-md shadow-teal-200',
        inactive: 'text-gray-600 hover:text-teal-600 hover:bg-teal-50',
      },
      slate: {
        active: 'bg-slate-700 text-white shadow-md shadow-slate-200',
        inactive: 'text-gray-600 hover:text-slate-700 hover:bg-slate-50',
      },
    };
    return isActive ? colors[color].active : colors[color].inactive;
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'rencontres':
        return <Rencontres />;
      case 'evenements':
        return <Evenements />;
      case 'collaborations':
        return <Collaborations />;
      case 'temoignages':
        return <Temoignages />;
      case 'catalogue':
        return <CatalogueSecret />;
      default:
        return <Rencontres />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-xl shadow-lg">
                <BookOpen className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rencontres Entrepreneurs Secrètes</h1>
                <p className="text-gray-600 text-sm">Fribourg · Vue modernisée</p>
              </div>
            </div>

            <label className="relative block w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une section..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
          </div>

          <nav className="flex flex-wrap gap-2" role="tablist" aria-label="Navigation des sections">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => void tabImporters[tab.id]()}
                  onFocus={() => void tabImporters[tab.id]()}
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${getColorClasses(
                    tab.color,
                    isActive
                  )}`}
                  title={tab.description}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
            {filteredTabs.length === 0 && (
              <p className="text-sm text-gray-500 px-2 py-2">Aucune section trouvée pour “{searchTerm}”.</p>
            )}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <Suspense fallback={<div className="bg-white p-6 rounded-xl shadow-sm">Chargement de la section…</div>}>
          {renderActiveTab()}
        </Suspense>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>Rencontres Entrepreneurs Secrètes - Fribourg</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
