import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Clock, Sparkles, CornerDownLeft } from 'lucide-react';
import { CalculationHistoryItem, ThemeConfig } from '../types';

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onSelectHistory: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
  theme: ThemeConfig;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  theme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          {/* Backdrop dismissal */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            {/* Header with Disney Vintage Reel styling */}
            <div className="flex items-center justify-between px-6 py-4 bg-amber-200 border-b-3 border-amber-300">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-900" />
                <h3 className="font-bold text-amber-950 text-lg tracking-wide">
                  Disney Math Reel Tape
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    title="Clear Reel"
                    className="p-1.5 text-amber-800 hover:text-red-600 rounded-lg hover:bg-amber-300/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-amber-800 hover:text-amber-950 rounded-lg hover:bg-amber-300/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reel Paper Scroll Content */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {history.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-amber-200/60 rounded-full flex items-center justify-center text-amber-800">
                    <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <p className="font-bold text-amber-900 text-base">Your Math Reel is Empty!</p>
                  <p className="text-xs text-amber-700/80 mt-1 max-w-xs mx-auto">
                    Tap any numbers and signs on your Disney calculator to watch equations record here!
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                    className="group relative bg-white p-3.5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex-1 pr-2">
                      <div className="text-xs text-amber-800/70 font-mono flex items-center gap-1.5 mb-0.5">
                        <span className="capitalize font-semibold text-amber-900">{item.character}</span>
                        <span>·</span>
                        <span>
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 font-mono tracking-wide truncate">
                        {item.expression}
                      </div>
                      <div className="text-lg font-bold text-slate-900 font-mono">
                        = {item.result}
                      </div>
                      {item.tag && (
                        <div className="mt-1 inline-block text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          {item.tag}
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-amber-800 bg-amber-100 rounded-xl">
                      <CornerDownLeft className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-amber-100/60 border-t-2 border-amber-200 text-center text-xs text-amber-800">
              Tap any calculation to restore it back to the screen!
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
