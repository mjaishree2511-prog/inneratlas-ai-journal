import React, { useState } from 'react';
import { Palette, Check, X, Info, Sparkles, Sliders } from 'lucide-react';
import { CURATED_COLOR_PALETTE, type ColorOption } from '../types';

interface ColorReflectionPickerProps {
  selectedColor?: string;
  selectedColorName?: string;
  onSelectColor: (hex: string, name: string) => void;
  onClearColor: () => void;
  className?: string;
}

export const ColorReflectionPicker: React.FC<ColorReflectionPickerProps> = ({
  selectedColor,
  selectedColorName,
  onSelectColor,
  onClearColor,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(selectedColor || '#6366F1');
  const [customName, setCustomName] = useState('Custom Hue');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Find active option from curated palette if exists
  const activeCurated = CURATED_COLOR_PALETTE.find(
    (c) => c.hex.toLowerCase() === (selectedColor || '').toLowerCase()
  );

  const displayColorName = selectedColorName || activeCurated?.name || (selectedColor ? 'Custom Hue' : undefined);

  const handleSelectCurated = (option: ColorOption) => {
    onSelectColor(option.hex, option.name);
    setShowCustomPicker(false);
  };

  const handleApplyCustomColor = () => {
    const finalName = customName.trim() || 'Custom Hue';
    onSelectColor(customHex, finalName);
    setShowCustomPicker(false);
  };

  return (
    <div
      id="container-color-reflection"
      className={`rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-xs transition-colors ${className}`}
    >
      {/* Header bar of Color Reflection */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400">
            <Palette className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Inner World Color
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedColor ? (
            <button
              id="btn-clear-color-reflection"
              type="button"
              onClick={onClearColor}
              className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition"
              title="Remove color reflection"
            >
              <X className="h-3 w-3" />
              <span>Clear Color</span>
            </button>
          ) : (
            <span className="text-[11px] text-stone-400 dark:text-stone-500 italic">
              Optional
            </span>
          )}
        </div>
      </div>

      {/* Selected Color Visual Badge (if active) */}
      {selectedColor && (
        <div
          id="badge-active-color-reflection"
          className="mb-3 flex items-center justify-between rounded-xl px-3 py-2 border text-xs shadow-2xs transition-all"
          style={{
            backgroundColor: `${selectedColor}14`,
            borderColor: `${selectedColor}40`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="h-4 w-4 rounded-full border border-white/60 dark:border-stone-800 shadow-xs shrink-0"
              style={{ backgroundColor: selectedColor }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {displayColorName}
                </span>
                <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400 uppercase">
                  {selectedColor}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-1">
                {activeCurated?.meaning || 'Your unique personal color expression for this moment'}
              </p>
            </div>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500 shrink-0 ml-2" />
        </div>
      )}

      {/* Palette Swatches List */}
      <div className="flex flex-wrap items-center gap-2">
        {CURATED_COLOR_PALETTE.map((option) => {
          const isSelected = selectedColor?.toLowerCase() === option.hex.toLowerCase();
          return (
            <button
              key={option.id}
              id={`btn-color-option-${option.id}`}
              type="button"
              onClick={() => handleSelectCurated(option)}
              className={`group relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 ring-2 ring-stone-900 dark:ring-stone-100 ring-offset-1 shadow-xs scale-102'
                  : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
              title={`${option.name}: ${option.meaning}`}
              aria-pressed={isSelected}
            >
              <span
                className="h-3 w-3 rounded-full border border-black/15 dark:border-white/20 shrink-0"
                style={{ backgroundColor: option.hex }}
              />
              <span className="truncate max-w-[85px] sm:max-w-[100px]">{option.name}</span>
              {isSelected && <Check className="h-3 w-3 ml-0.5 shrink-0" />}
            </button>
          );
        })}

        {/* Custom Color Selector Trigger */}
        <button
          id="btn-custom-color-trigger"
          type="button"
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
            showCustomPicker
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-700'
          }`}
          title="Choose your own custom color"
        >
          <Sliders className="h-3 w-3" />
          <span>Custom</span>
        </button>
      </div>

      {/* Expanded Custom Color Picker Box */}
      {showCustomPicker && (
        <div
          id="panel-custom-color-picker"
          className="mt-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/90 dark:bg-stone-800/90 p-3 text-xs space-y-2.5 animate-in fade-in"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="input-custom-color-native" className="font-semibold text-stone-700 dark:text-stone-300">
                Picker:
              </label>
              <input
                id="input-custom-color-native"
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-md border border-stone-300 dark:border-stone-600 bg-transparent p-0.5"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-stone-500 uppercase">{customHex}</span>
            </div>

            <div className="flex-1 min-w-[140px]">
              <input
                id="input-custom-color-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name your hue (e.g. Lavender Mist)"
                className="w-full rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-2.5 py-1 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden"
              />
            </div>

            <button
              id="btn-apply-custom-color"
              type="button"
              onClick={handleApplyCustomColor}
              className="rounded-lg bg-stone-900 dark:bg-amber-600 px-3 py-1 font-bold text-white hover:bg-stone-800 dark:hover:bg-amber-500 transition shadow-2xs"
            >
              Apply Hue
            </button>
          </div>
        </div>
      )}

      {/* Poetic Non-Diagnostic Guidance */}
      <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
        <Info className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-stone-500 mt-0.5" />
        <span>
          Colors represent subjective self-expression for how your inner space feels. Never used clinically or diagnostically.
        </span>
      </div>
    </div>
  );
};
