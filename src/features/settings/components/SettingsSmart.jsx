import { useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { Card } from '../../../components/ui/Card';
import toast from 'react-hot-toast';

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
    <span className="text-sm font-bold text-[#473198]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-[#473198]/60">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-2 border-[#9BF3F0]/30 cursor-pointer"
      />
    </div>
  </div>
);

const SettingsSmart = () => {
  const {
    isDark,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    toggleDark,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,
    setBackgroundColor,
  } = useThemeStore();

  const [previewText, setPreviewText] = useState('Vista previa del texto');

  const handleReset = () => {
    setPrimaryColor('#473198');
    setSecondaryColor('#9BF3F0');
    setAccentColor('#ADFC92');
    setBackgroundColor('#DAFFED');
    toast.success('Colores restablecidos');
  };

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#473198]">Configuracion</h1>
        <p className="text-[#473198]/60 mt-1">Personaliza la apariencia del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Apariencia</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-[#473198]">Modo oscuro</p>
                <p className="text-xs text-[#473198]/50">Cambia entre tema claro y oscuro</p>
              </div>
              <button
                onClick={toggleDark}
                className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-[#473198]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Colors */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Colores del tema</h3>
          <div className="space-y-3">
            <ColorPicker label="Color primario" value={primaryColor} onChange={setPrimaryColor} />
            <ColorPicker label="Color secundario" value={secondaryColor} onChange={setSecondaryColor} />
            <ColorPicker label="Color de acento" value={accentColor} onChange={setAccentColor} />
            <ColorPicker label="Color de fondo" value={backgroundColor} onChange={setBackgroundColor} />
          </div>
          <button
            onClick={handleReset}
            className="mt-4 w-full px-4 py-2 border-2 border-[#9BF3F0]/30 text-[#473198] rounded-xl font-bold hover:bg-[#9BF3F0]/10 transition-colors text-sm"
          >
            Restablecer colores
          </button>
        </Card>

        {/* Preview */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Vista previa</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 text-sm"
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
