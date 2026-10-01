import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Wand2 } from 'lucide-react';
import { DISNEY_EASTER_EGGS } from '../utils/themeData';

interface DisneyTriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCode: (code: string) => void;
}

export const DisneyTriviaModal: React.FC<DisneyTriviaModalProps> = ({
  isOpen,
  onClose,
  onSelectCode,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold border-b-2 border-amber-500">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-900" />
                <span className="text-lg">Secret Disney Math Codes</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-amber-500/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-6 space-y-3 overflow-y-auto flex-1">
              <p className="text-xs text-slate-600 mb-2">
                Type these special numbers into your calculator (or tap any code below) to trigger secret Disney cartoon animations & celebratory fanfares!
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {Object.entries(DISNEY_EASTER_EGGS).map(([code, trivia]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onSelectCode(code);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-mono font-bold text-sm rounded-xl shadow-xs">
                        {code}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-950">
                        {trivia}
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-500 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors shadow-md"
              >
                Got It!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
