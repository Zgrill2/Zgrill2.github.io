import { useState } from 'react';
import { CharacterProvider } from './context/CharacterContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import AttributesPanel from './components/AttributesPanel';
import MagicPanel from './components/MagicPanel';
import SkillsPanel from './components/SkillsPanel';
import StatsPanel from './components/StatsPanel';
import AbilitiesPanel from './components/AbilitiesPanel';
import WeaponsPanel from './components/WeaponsPanel';
import NotesPanel from './components/NotesPanel';
import StickyStatsSummary from './components/StickyStatsSummary';
import { Shield, Swords, Sparkles, Package, FileText } from 'lucide-react';

type TabId = 'core' | 'skills' | 'abilities' | 'equipment' | 'notes';

const TABS = [
  { id: 'core' as TabId, label: 'Core', icon: Shield },
  { id: 'skills' as TabId, label: 'Skills', icon: Swords },
  { id: 'abilities' as TabId, label: 'Abilities', icon: Sparkles },
  { id: 'equipment' as TabId, label: 'Equipment', icon: Package },
  { id: 'notes' as TabId, label: 'Notes', icon: FileText },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('core');
  const { themeColors } = useTheme();

  return (
    <div className={`min-h-screen ${themeColors.background}`}>
      <Header />

      {/* Tab Navigation */}
      <nav className="bg-navy-mid border-b-2 border-navy-light constellation-border shadow-panel sticky top-0 z-40 no-print">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-6 mb-24">
        {activeTab === 'core' && <CoreTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'abilities' && <AbilitiesTab />}
        {activeTab === 'equipment' && <EquipmentTab />}
        {activeTab === 'notes' && <NotesTab />}
      </main>

      {/* Sticky Stats Summary */}
      <StickyStatsSummary />
    </div>
  );
}

// Core Tab: Attributes + Magic + Stats
function CoreTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttributesPanel />
        <MagicPanel />
      </div>
      <StatsPanel />
    </div>
  );
}

// Skills Tab: Full-width skills panel
function SkillsTab() {
  return <SkillsPanel />;
}

// Abilities Tab: Card grid with sidebar
function AbilitiesTab() {
  return <AbilitiesPanel />;
}

// Equipment Tab: Weapons panel
function EquipmentTab() {
  return <WeaponsPanel />;
}

// Notes Tab: Notes + Inventory
function NotesTab() {
  return <NotesPanel />;
}

function App() {
  return (
    <ThemeProvider>
      <CharacterProvider>
        <AppContent />
      </CharacterProvider>
    </ThemeProvider>
  );
}

export default App;
