import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Mic, MicOff, Music, Play, X } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
  speechEnabled,
  onToggleSpeech,
}) => {
  const soundDemos = [
    {
      name: 'Elsa Ice Glockenspiel (0-9)',
      icon: '❄️',
      desc: 'Crystalline ice harp harmonics with overtone ring',
      action: () => {
        soundEffects.playNumber(Math.floor(Math.random() * 10), 'elsa');
      },
    },
    {
      name: 'Moana Ocean Drum (0-9)',
      icon: '🌊',
      desc: 'Warm Polynesian log drum and island marimba',
      action: () => {
        soundEffects.playNumber(Math.floor(Math.random() * 10), 'moana');
      },
    },
    {
      name: 'Anna Festival Bell (0-9)',
      icon: '🌻',
      desc: 'Arendelle village chime bell note',
      action: () => {
        soundEffects.playNumber(Math.floor(Math.random() * 10), 'anna');
      },
    },
    {
      name: 'Trig Sine Wave (sin / cos)',
      icon: '〰️',
      desc: 'Glacial harmonic wave swell',
      action: () => soundEffects.playOperator('sin'),
    },
    {
      name: 'Modulus Log Drum (mod)',
      icon: '🥁',
      desc: 'Snappy Polynesian double woodblock click',
      action: () => soundEffects.playOperator('mod'),
    },
    {
      name: 'Ocean Wave Splash (÷)',
      icon: '🌊',
      desc: 'Crisp water drop and wave sound',
      action: () => soundEffects.playOperator('÷'),
    },
    {
      name: 'Magic Power Blast (xʸ / ^)',
      icon: '⚡',
      desc: 'Ascending mystical energy whoosh',
      action: () => soundEffects.playOperator('^'),
    },
    {
      name: 'Spring Boing Twang (×)',
      icon: '🪀',
      desc: 'Cartoon vibrating spring twang',
      action: () => soundEffects.playOperator('×'),
    },
    {
      name: 'Disney Fairytale Fanfare (=)',
      icon: '🪄',
      desc: 'Triumphant "Let It Go / How Far I\'ll Go" arpeggio',
      action: () => soundEffects.playEquals(),
    },
    {
      name: 'Comic Snowflake Poof (AC)',
      icon: '💨',
      desc: 'Whimsical air deflation wipe',
      action: () => soundEffects.playClear(),
    },
    {
      name: 'Bubble Suction Pop (⌫)',
      icon: '🫧',
      desc: 'Snappy cartoon bubble burst',
      action: () => soundEffects.playBackspace(),
    },
    {
      name: 'Secret Disney Fanfare ✨',
      icon: '🌟',
      desc: 'Celebratory star melody',
      action: () => soundEffects.playEasterEggFanfare(),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold border-b-2 border-cyan-500">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-slate-950" />
                <span className="text-lg">Disney Heroine Sound Studio</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-cyan-600/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Mute and Voice Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onToggleMute}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    isMuted
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-5 h-5 text-rose-600" />
                      <span>Sound: OFF</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-emerald-600" />
                      <span>Sound: ON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onToggleSpeech}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    speechEnabled
                      ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  {speechEnabled ? (
                    <>
                      <Mic className="w-5 h-5 text-purple-600" />
                      <span>Toon Voice: ON</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-5 h-5 text-slate-500" />
                      <span>Toon Voice: OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200">
                <div className="flex justify-between items-center text-xs font-bold text-sky-950 mb-2">
                  <span>Cartoon Sound Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-sky-200 rounded-lg"
                />
              </div>

              {/* Live Soundboard Preview */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center gap-1.5">
                  <span>Soundboard Preview</span>
                  <span className="text-xs text-slate-500 font-normal">(Tap to test)</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {soundDemos.map((demo, idx) => (
                    <button
                      key={idx}
                      onClick={demo.action}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{demo.icon}</span>
                        <div>
                          <p className="font-bold text-xs text-slate-900 group-hover:text-cyan-950">
                            {demo.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{demo.desc}</p>
                        </div>
                      </div>
                      <div className="p-1.5 bg-white border border-slate-200 group-hover:bg-cyan-400 group-hover:text-slate-950 rounded-lg text-slate-600 shadow-sm transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl transition-colors shadow-md"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
