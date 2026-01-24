import { useState } from 'react';
import { useCharacter } from '../hooks/useCharacter';
import { useTheme } from '../context/ThemeContext';
import { Save, FolderOpen, Download, Upload, FileText, Sparkles } from 'lucide-react';
import BPDisplay from './BPDisplay';
import ThemeSwitcher from './ThemeSwitcher';
import { saveCharacter, loadCharacter } from '../utils/storage';
import { exportCharacter, importCharacter } from '../utils/import-export';

export default function Header() {
  const { character, setName, setBPBudget, loadCharacter: loadChar, resetCharacter } =
    useCharacter();
  const { themeColors } = useTheme();
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  const handleSave = () => {
    saveCharacter(character);
    alert('Character saved to browser storage!');
  };

  const handleLoad = () => {
    const loaded = loadCharacter();
    if (loaded) {
      loadChar(loaded);
      alert('Character loaded!');
    } else {
      alert('No saved character found.');
    }
  };

  const handleExport = () => {
    exportCharacter(character);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await importCharacter(file);
          loadChar(imported);
          alert('Character imported successfully!');
        } catch (error) {
          alert('Failed to import character: ' + (error as Error).message);
        }
      }
    };
    input.click();
  };

  const handleNew = () => {
    if (confirm('Are you sure you want to create a new character? Unsaved changes will be lost.')) {
      resetCharacter();
    }
  };

  return (
    <header
      className={`${themeColors.headerGradient} border-b-4 border-cyan-electric shadow-glow-cyan-md constellation-border no-print relative z-50`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cyan-electric flex items-center justify-center shadow-glow-cyan-md animate-pulse-glow">
              <Sparkles className="text-navy-deep" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-cosmic-white drop-shadow-lg tracking-header">
              Shimmering Reach
            </h1>
          </div>

          {/* Character Name & Actions */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={character.name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-semibold px-5 py-3 input-standard"
              placeholder="Character Name"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNew}
                className="btn-secondary"
                title="New Character"
              >
                <FileText size={16} />
                <span>New</span>
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                title="Save to Browser"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleLoad}
                className="btn-secondary"
                title="Load from Browser"
              >
                <FolderOpen size={16} />
                <span>Load</span>
              </button>
              <button
                onClick={handleExport}
                className="btn-secondary"
                title="Export to JSON"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={handleImport}
                className="btn-secondary"
                title="Import from JSON"
              >
                <Upload size={16} />
                <span>Import</span>
              </button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        {/* BP Display */}
        <div className="flex items-center justify-between">
          <BPDisplay />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBudgetInput(!showBudgetInput)}
              className="text-lg font-semibold text-cyan-bright hover:text-cyan-electric transition-colors"
            >
              Budget: <span className="text-2xl font-bold">{character.bpBudget}</span>
            </button>
            {showBudgetInput && (
              <input
                type="number"
                value={character.bpBudget}
                onChange={(e) => setBPBudget(parseInt(e.target.value) || 0)}
                className="w-28 px-3 py-2 input-standard text-lg font-semibold"
                onBlur={() => setShowBudgetInput(false)}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
