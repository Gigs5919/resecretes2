import { useState } from 'react';
import { Users, Calendar, Sparkles, MessageSquare, Briefcase, BookOpen } from 'lucide-react';
import Rencontres from './components/Rencontres';
import Evenements from './components/Evenements';
import Collaborations from './components/Collaborations';
import Temoignages from './components/Temoignages';
import CatalogueSecret from './components/CatalogueSecret';

type Tab = 'rencontres' | 'evenements' | 'collaborations' | 'temoignages' | 'catalogue';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('rencontres');

  const tabs = [
    { id: 'rencontres' as Tab, name: 'Rencontres', icon: Users, color: 'blue' },
    { id: 'evenements' as Tab, name: 'Événements', icon: Calendar, color: 'green' },
    { id: 'collaborations' as Tab, name: 'Collaborations', icon: Sparkles, color: 'amber' },
    { id: 'temoignages' as Tab, name: 'Témoignages', icon: MessageSquare, color: 'teal' },
    { id: 'catalogue' as Tab, name: 'Catalogue Secret', icon: Briefcase, color: 'slate' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: { [key: string]: { active: string; inactive: string } } = {
      blue: { active: 'bg-blue-600 text-white', inactive: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' },
      green: { active: 'bg-green-600 text-white', inactive: 'text-gray-600 hover:text-green-600 hover:bg-green-50' },
      amber: { active: 'bg-amber-600 text-white', inactive: 'text-gray-600 hover:text-amber-600 hover:bg-amber-50' },
      teal: { active: 'bg-teal-600 text-white', inactive: 'text-gray-600 hover:text-teal-600 hover:bg-teal-50' },
      slate: { active: 'bg-slate-700 text-white', inactive: 'text-gray-600 hover:text-slate-700 hover:bg-slate-50' },
    };
    return isActive ? colors[color].active : colors[color].inactive;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-xl shadow-lg">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Rencontres Entrepreneurs Secrètes
              </h1>
              <p className="text-gray-600 text-sm">Fribourg</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${getColorClasses(
                    tab.color,
                    isActive
                  )}`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rencontres' && <Rencontres />}
        {activeTab === 'evenements' && <Evenements />}
        {activeTab === 'collaborations' && <Collaborations />}
        {activeTab === 'temoignages' && <Temoignages />}
        {activeTab === 'catalogue' && <CatalogueSecret />}
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
