import { useState } from 'react';
import useUIStore from '../../../store/uiStore';
import { Card } from '../../../components/ui/Card';
import { SettingsForm } from './SettingsForm';
import { useSettings } from '../../../context/SettingsContext';
import toast from 'react-hot-toast';

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-on-surface/10">
    <span className="text-sm font-bold text-primary">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-on-surface-variant">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-2 border-secondary/30 cursor-pointer bg-transparent"
      />
    </div>
  </div>
);

const SettingsSmart = () => {
  const {
    theme,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    toggleTheme,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,
    setBackgroundColor,
    applyPreset,
  } = useUIStore();

  const { settings, updateSettings, loading: settingsLoading } = useSettings();

  const [activeTab, setActiveTab] = useState('business'); // 'business' or 'appearance'

  const isDark = theme === 'dark';

  const presets = [
    {
      name: 'Clínico Blue',
      primary: '#006875',
      secondary: '#9BF3F0',
      accent: '#ADFC92',
      background: '#f7f9fb',
    },
    {
      name: 'Modern Violet',
      primary: '#473198',
      secondary: '#C3B1E1',
      accent: '#F3E5F5',
      background: '#FDFBFF',
    },
    {
      name: 'Nature Green',
      primary: '#2D5A27',
      secondary: '#A8D5BA',
      accent: '#F0FFF0',
      background: '#F9FFF9',
    },
    {
      name: 'Deep Ocean',
      primary: '#003366',
      secondary: '#B0C4DE',
      accent: '#E0FFFF',
      background: '#F0F8FF',
    },
    {
      name: 'Cyber Medical',
      primary: '#00ffcc',
      secondary: '#1a1a2e',
      accent: '#ff00ff',
      background: '#0f0f1b',
    },
  ];

  const handleReset = () => {
    applyPreset(presets[0]);
    toast.success('Colores restablecidos');
  };

  const handleSaveBusinessSettings = async (formData) => {
    await updateSettings(formData);
  };

  return (
    <div className="p-6 bg-surface/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary">Configuracion</h1>
        <p className="text-primary/60 mt-1">Personaliza el negocio y la apariencia del sistema</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'business' 
              ? 'bg-primary text-on-primary shadow-lg scale-105' 
              : 'bg-surface-container-low text-primary hover:bg-surface-container-lowest border border-on-surface/10'
          }`}
        >
          Configuracion del Negocio
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'appearance' 
              ? 'bg-primary text-on-primary shadow-lg scale-105' 
              : 'bg-surface-container-low text-primary hover:bg-surface-container-lowest border border-on-surface/10'
          }`}
        >
          Apariencia y Colores
        </button>
      </div>

      {activeTab === 'business' ? (
        <SettingsForm 
          initialSettings={settings} 
          onSave={handleSaveBusinessSettings} 
          isSaving={settingsLoading}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Apariencia</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-primary">Modo oscuro</p>
                  <p className="text-xs text-primary/50">Cambia entre tema claro y oscuro</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Colores del tema</h3>
            
            <div className="mb-6">
              <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-3">Presets Rápidos</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      applyPreset(preset);
                      toast.success(`Preset ${preset.name} aplicado`);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-secondary/30 text-xs font-bold text-primary hover:bg-secondary/20 transition-all flex items-center gap-2"
                  >
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.primary }} />
                      <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.secondary }} />
                      <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.accent }} />
                    </div>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <ColorPicker label="Color primario" value={primaryColor} onChange={setPrimaryColor} />
              <ColorPicker label="Color secundario" value={secondaryColor} onChange={setSecondaryColor} />
              <ColorPicker label="Color de acento" value={accentColor} onChange={setAccentColor} />
              <ColorPicker label="Color de fondo" value={backgroundColor} onChange={setBackgroundColor} />
            </div>
            <button
              onClick={handleReset}
              className="mt-4 w-full px-4 py-2 border-2 border-secondary/30 text-primary rounded-xl font-bold hover:bg-secondary/10 transition-colors text-sm"
            >
              Restablecer colores
            </button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsSmart;
