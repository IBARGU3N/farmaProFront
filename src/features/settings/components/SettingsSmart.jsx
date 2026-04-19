import { useState } from 'react';
import useUIStore from '../../../store/uiStore';
import { Card } from '../../../components/ui/Card';
import toast from 'react-hot-toast';

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
    <span className="text-sm font-bold text-primary">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-primary/60">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-2 border-secondary/30 cursor-pointer"
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

  const isDark = theme === 'dark';
  const [previewText, setPreviewText] = useState('Vista previa del texto');

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
  ];

  const handleReset = () => {
    applyPreset(presets[0]);
    toast.success('Colores restablecidos');
  };

  return (
    <div className="p-6 bg-surface/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary">Configuracion</h1>
        <p className="text-primary/60 mt-1">Personaliza la apariencia del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
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

        {/* Colors */}
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

        {/* Preview */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-primary mb-4">Vista previa</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder="Escribe algo para ver la vista previa..."
            />
            <div className="flex gap-3 flex-wrap">
              <button
                className="px-6 py-2 text-white font-bold rounded-xl text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Boton primario
              </button>
              <button
                className="px-6 py-2 font-bold rounded-xl text-sm border-2"
                style={{ borderColor: secondaryColor, color: primaryColor }}
              >
                Boton secundario
              </button>
              <button
                className="px-6 py-2 text-white font-bold rounded-xl text-sm"
                style={{ backgroundColor: accentColor, color: '#473198' }}
              >
                Boton acento
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="h-16 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: primaryColor }}>
                Primario
              </div>
              <div className="h-16 rounded-xl flex items-center justify-center text-xs font-bold" style={{ backgroundColor: secondaryColor }}>
                Secundario
              </div>
              <div className="h-16 rounded-xl flex items-center justify-center text-xs font-bold" style={{ backgroundColor: accentColor }}>
                Acento
              </div>
              <div className="h-16 rounded-xl flex items-center justify-center text-xs font-bold" style={{ backgroundColor: backgroundColor }}>
                Fondo
              </div>
            </div>
            <p className="text-sm font-bold mt-4" style={{ color: primaryColor }}>
              {previewText}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSmart;
