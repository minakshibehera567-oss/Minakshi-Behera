import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartoonCharacterId, ThemeConfig } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface CartoonMascotProps {
  characterId: CartoonCharacterId;
  theme: ThemeConfig;
  reaction: 'idle' | 'numberTap' | 'operatorTap' | 'equals' | 'clear' | 'easterEgg';
  speechText: string;
  mousePos: { x: number; y: number };
}

export const CartoonMascot: React.FC<CartoonMascotProps> = ({
  characterId,
  theme,
  reaction,
  speechText,
  mousePos,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTickled, setIsTickled] = useState(false);

  // Natural cartoon blinking loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Compute pupil displacement based on cursor position relative to screen center
  const eyeDx = Math.max(-5, Math.min(5, (mousePos.x - window.innerWidth / 2) / 75));
  const eyeDy = Math.max(-4, Math.min(5, (mousePos.y - window.innerHeight / 2) / 65));

  const handleMascotTap = () => {
    setIsTickled(true);
    soundEffects.playOperator('×');
    soundEffects.speakText(theme.catchphrases.greeting);
    setTimeout(() => setIsTickled(false), 600);
  };

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Cartoon Speech Bubble */}
      <AnimatePresence mode="wait">
        {speechText && (
          <motion.div
            key={speechText}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="absolute -top-16 z-30 max-w-[280px] sm:max-w-xs"
          >
            <div className="relative bg-white text-slate-900 px-4 py-2 rounded-2xl shadow-xl border-3 border-amber-400 font-bold text-xs sm:text-sm text-center">
              <span className="block leading-tight">{speechText}</span>
              {/* Bubble pointer tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-400 rotate-45 transform" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Character Body */}
      <motion.div
        onClick={handleMascotTap}
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        animate={
          isTickled
            ? { rotate: [-10, 10, -8, 8, 0], y: [-12, 0] }
            : reaction === 'equals'
            ? { y: [0, -18, 0, -10, 0], scale: [1, 1.1, 1, 1.05, 1] }
            : reaction === 'numberTap'
            ? { scale: [1, 1.05, 0.98, 1], y: [0, -4, 0] }
            : reaction === 'operatorTap'
            ? { rotate: [-4, 4, 0], scale: [1, 1.04, 1] }
            : reaction === 'clear'
            ? { rotate: [-6, 6, -3, 3, 0], y: [0, 4, 0] }
            : { y: [0, -3, 0] }
        }
        transition={{
          duration: reaction === 'equals' ? 0.6 : reaction === 'idle' ? 3.5 : 0.35,
          repeat: reaction === 'idle' ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* ELSA (Ice Queen / Fifth Spirit) */}
        {characterId === 'elsa' && (
          <div className="relative w-36 h-36 sm:w-44 sm:h-44">
            {/* Ice Magic Frost Sparkles Halo */}
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-cyan-300/40 pointer-events-none"
              animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-cyan-300 text-xs">❄️</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-cyan-300 text-xs">✨</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-200 text-xs">❄️</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-cyan-200 text-xs">✨</div>
            </motion.div>

            {/* Elsa Platinum Hair Braid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 sm:w-34 h-20 bg-amber-50 rounded-t-full border-2 border-amber-100 shadow-md z-0" />
            <motion.div
              className="absolute top-14 -left-3 sm:-left-4 w-9 sm:w-11 h-24 sm:h-28 bg-amber-50 rounded-3xl border-2 border-amber-200 shadow-lg z-20 origin-top rotate-[18deg]"
              animate={reaction === 'equals' ? { rotate: [18, 30, 18] } : { rotate: [18, 14, 18] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {/* Braid notches */}
              <div className="w-full h-1 bg-amber-200/50 mt-4" />
              <div className="w-full h-1 bg-amber-200/50 mt-4" />
              <div className="w-full h-1 bg-amber-200/50 mt-4" />
              <div className="absolute bottom-1 right-2 text-cyan-400 text-xs">❄️</div>
            </motion.div>

            {/* Elsa Ice Crystal Tiara Crown */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-end gap-1">
              <div className="w-2.5 h-6 bg-cyan-300 rounded-t border border-cyan-100 shadow rotate-[-15deg]" />
              <div className="w-3.5 h-9 bg-gradient-to-t from-cyan-400 to-white rounded-t border border-cyan-100 shadow-lg z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
              <div className="w-2.5 h-6 bg-cyan-300 rounded-t border border-cyan-100 shadow rotate-[15deg]" />
            </div>

            {/* Elsa Face */}
            <div className="relative w-full h-full bg-orange-50 rounded-full border-3 border-cyan-200 shadow-xl overflow-hidden flex flex-col items-center pt-8 z-10">
              {/* Platinum Hair bangs */}
              <div className="absolute top-0 left-0 right-0 h-9 bg-amber-50 rounded-b-2xl border-b border-amber-200/60 z-10" />

              {/* Eyes */}
              <div className="flex gap-4 sm:gap-6 z-20 mt-2">
                {/* Left Eye with Lashes */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute -top-1 -left-1 w-3 h-0.5 bg-slate-900 rotate-[-35deg]" />
                  {isBlinking ? (
                    <div className="w-full h-1 bg-slate-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-cyan-600 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2 h-3.5 bg-sky-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>

                {/* Right Eye with Lashes */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute -top-1 -right-1 w-3 h-0.5 bg-slate-900 rotate-[35deg]" />
                  {isBlinking ? (
                    <div className="w-full h-1 bg-slate-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-cyan-600 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2 h-3.5 bg-sky-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Nose & Soft Rose Cheeks */}
              <div className="flex items-center gap-5 mt-0.5 z-20">
                <div className="w-3 h-2 bg-pink-300 rounded-full opacity-60" />
                <div className="w-2 h-1 bg-amber-400/80 rounded-full" />
                <div className="w-3 h-2 bg-pink-300 rounded-full opacity-60" />
              </div>

              {/* Smile */}
              <div className="relative w-12 sm:w-14 h-5 border-b-3 border-rose-900 rounded-[0_0_50%_50%] z-20 flex items-center justify-center mt-1">
                {reaction === 'equals' || reaction === 'numberTap' ? (
                  <div className="w-8 h-3.5 bg-rose-500 rounded-b-full overflow-hidden flex items-end justify-center">
                    <div className="w-5 h-2 bg-pink-300 rounded-t-full" />
                  </div>
                ) : null}
              </div>

              {/* Light Blue Ice Dress Collar */}
              <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-2xl border-t-2 border-cyan-200 z-10 flex items-center justify-center">
                <span className="text-white text-xs font-mono font-bold tracking-widest">❄️ ELSA ❄️</span>
              </div>
            </div>

            {/* Elsa Animated Casting Hands with Ice Shimmer */}
            <motion.div
              className="absolute -right-6 sm:-right-8 top-14 w-8 sm:w-10 h-8 sm:h-10 bg-cyan-300/80 rounded-full border border-cyan-100 shadow-md flex items-center justify-center z-30"
              animate={
                reaction === 'equals' || reaction === 'operatorTap'
                  ? { scale: [1, 1.35, 1], rotate: [0, 45, 0] }
                  : { y: [0, 4, 0] }
              }
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-white text-xs">❄️</span>
            </motion.div>
          </div>
        )}

        {/* MOANA (Wayfinder of Motunui) */}
        {characterId === 'moana' && (
          <div className="relative w-36 h-36 sm:w-44 sm:h-44">
            {/* Moana Big Wavy Black Hair Backdrop */}
            <div className="absolute -top-4 -left-5 -right-5 bottom-0 bg-stone-900 rounded-[50%_50%_40%_40%] shadow-lg z-0" />

            {/* Plumeria Flower in Hair */}
            <div className="absolute -top-3 right-1 z-20 flex items-center justify-center">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-rose-500 rounded-full border border-white shadow flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full" />
              </div>
            </div>

            {/* Moana Face */}
            <div className="relative w-full h-full bg-amber-100 rounded-full border-3 border-amber-700 shadow-xl overflow-hidden flex flex-col items-center pt-8 z-10">
              {/* Front hair framing */}
              <div className="absolute top-0 left-0 w-8 h-16 bg-stone-900 rounded-r-2xl z-10" />
              <div className="absolute top-0 right-0 w-8 h-16 bg-stone-900 rounded-l-2xl z-10" />

              {/* Expressive Warm Eyes */}
              <div className="flex gap-4 sm:gap-6 z-20 mt-1">
                {/* Left Eye */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-stone-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-stone-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-amber-900 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2.5 h-4 bg-stone-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>

                {/* Right Eye */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-stone-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-stone-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-amber-900 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2.5 h-4 bg-stone-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Nose & Warm Glow */}
              <div className="w-3 h-2 bg-amber-700/60 rounded-full mt-1 z-20" />

              {/* Warm Brave Smile */}
              <div className="relative w-12 sm:w-14 h-5 border-b-3 border-amber-950 rounded-[0_0_50%_50%] z-20 flex items-center justify-center mt-1">
                {reaction === 'equals' || reaction === 'numberTap' ? (
                  <div className="w-8 h-4 bg-rose-600 rounded-b-full overflow-hidden flex items-end justify-center">
                    <div className="w-5 h-2 bg-pink-300 rounded-t-full" />
                  </div>
                ) : null}
              </div>

              {/* Heart of Te Fiti Seashell Necklace */}
              <motion.div
                className="absolute bottom-2 z-20 flex flex-col items-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-5 sm:w-6 h-6 sm:h-7 bg-emerald-500 rounded-full border-2 border-emerald-200 shadow-[0_0_12px_#10B981] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              </motion.div>

              {/* Voyaging Red Tapa Top */}
              <div className="absolute bottom-0 w-full h-8 bg-rose-700 border-t-2 border-amber-200 z-10" />
            </div>

            {/* Voyaging Paddle Hand */}
            <motion.div
              className="absolute -right-6 sm:-right-8 top-12 w-8 sm:w-10 h-18 bg-amber-700 rounded-2xl border border-amber-900 shadow-md flex items-center justify-center z-30"
              animate={reaction === 'equals' ? { rotate: [0, 25, 0], y: [-6, 0] } : {}}
            >
              <span className="text-white text-xs">🌊</span>
            </motion.div>
          </div>
        )}

        {/* ANNA (Princess of Arendelle) */}
        {characterId === 'anna' && (
          <div className="relative w-36 h-36 sm:w-44 sm:h-44">
            {/* Auburn Hair Back */}
            <div className="absolute -top-3 -left-3 -right-3 bottom-0 bg-amber-800 rounded-full shadow-lg z-0" />

            {/* Two Auburn Braided Pigtails */}
            <motion.div
              className="absolute top-12 -left-4 sm:-left-5 w-8 sm:w-9 h-22 sm:h-26 bg-amber-800 rounded-2xl border border-amber-900 shadow-md z-20 origin-top rotate-[20deg]"
              animate={reaction === 'equals' ? { rotate: [20, 35, 20] } : { rotate: [20, 15, 20] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-pink-500 rounded-full" />
            </motion.div>

            <motion.div
              className="absolute top-12 -right-4 sm:-right-5 w-8 sm:w-9 h-22 sm:h-26 bg-amber-800 rounded-2xl border border-amber-900 shadow-md z-20 origin-top rotate-[-20deg]"
              animate={reaction === 'equals' ? { rotate: [-20, -35, -20] } : { rotate: [-20, -15, -20] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-pink-500 rounded-full" />
            </motion.div>

            {/* Anna Face */}
            <div className="relative w-full h-full bg-orange-50 rounded-full border-3 border-amber-600 shadow-xl overflow-hidden flex flex-col items-center pt-8 z-10">
              {/* Front auburn bangs */}
              <div className="absolute top-0 left-0 right-0 h-9 bg-amber-800 rounded-b-2xl border-b border-amber-900 z-10 flex justify-center">
                {/* Blonde streak memory from childhood */}
                <div className="w-1.5 h-6 bg-amber-200 rounded -ml-4" />
              </div>

              {/* Expressive Turquoise / Blue Eyes */}
              <div className="flex gap-4 sm:gap-6 z-20 mt-2">
                {/* Left Eye */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-stone-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-stone-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-teal-600 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2.5 h-4 bg-teal-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>

                {/* Right Eye */}
                <div className="relative w-6 sm:w-7 h-10 sm:h-12 bg-white rounded-full border-2 border-stone-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-stone-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-6 bg-teal-600 rounded-full relative flex items-center justify-center"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-2.5 h-4 bg-teal-950 rounded-full" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sweet Freckles */}
              <div className="flex items-center gap-6 mt-0.5 z-20">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-amber-700 rounded-full" />
                  <div className="w-1 h-1 bg-amber-700 rounded-full" />
                </div>
                <div className="w-2 h-1 bg-rose-400 rounded-full" />
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-amber-700 rounded-full" />
                  <div className="w-1 h-1 bg-amber-700 rounded-full" />
                </div>
              </div>

              {/* Big Hearty Smile */}
              <div className="relative w-12 sm:w-14 h-5 border-b-3 border-amber-950 rounded-[0_0_50%_50%] z-20 flex items-center justify-center mt-1">
                {reaction === 'equals' || reaction === 'numberTap' ? (
                  <div className="w-8 h-4 bg-rose-500 rounded-b-full overflow-hidden flex items-end justify-center">
                    <div className="w-5 h-2 bg-pink-300 rounded-t-full" />
                  </div>
                ) : null}
              </div>

              {/* Arendelle Rosemaling Dress & Cape */}
              <div className="absolute bottom-0 w-full h-9 bg-emerald-800 border-t-2 border-amber-400 z-10 flex items-center justify-center">
                <span className="text-pink-300 text-xs font-bold">🌻 ANNA 🌻</span>
              </div>
            </div>
          </div>
        )}

        {/* OLAF (Snowman in Summer) */}
        {characterId === 'olaf' && (
          <div className="relative w-36 h-36 sm:w-44 sm:h-44">
            {/* Twig Hair on Top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              <div className="w-1 h-5 bg-amber-950 rotate-[-15deg] rounded" />
              <div className="w-1.5 h-7 bg-amber-950 rounded" />
              <div className="w-1 h-5 bg-amber-950 rotate-[15deg] rounded" />
            </div>

            {/* Olaf White Snow Head */}
            <div className="relative w-full h-full bg-white rounded-[50%_50%_45%_45%] border-3 border-sky-300 shadow-xl overflow-hidden flex flex-col items-center pt-8 z-10">
              {/* Big Expressive Cartoon Eyes */}
              <div className="flex gap-3 sm:gap-4 z-20">
                <div className="relative w-7 sm:w-8 h-9 sm:h-11 bg-white rounded-full border-2 border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-slate-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-5 bg-slate-950 rounded-full relative"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full mt-1 ml-1" />
                    </motion.div>
                  )}
                </div>

                <div className="relative w-7 sm:w-8 h-9 sm:h-11 bg-white rounded-full border-2 border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                  {isBlinking ? (
                    <div className="w-full h-1 bg-slate-900 rounded-full" />
                  ) : (
                    <motion.div
                      className="w-4 h-5 bg-slate-950 rounded-full relative"
                      style={{ transform: `translate(${eyeDx}px, ${eyeDy}px)` }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full mt-1 ml-1" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Big Orange Carrot Nose */}
              <motion.div
                className="w-8 sm:w-10 h-4 sm:h-5 bg-orange-500 rounded-r-full border-2 border-orange-700 shadow-md -mt-1 z-20"
                animate={reaction === 'equals' ? { rotate: [-10, 10, 0] } : {}}
              />

              {/* Wide Open Tooth Smile */}
              <div className="relative -mt-1 w-16 sm:w-20 h-9 sm:h-11 bg-slate-950 rounded-[0_0_50%_50%] border-2 border-sky-300 overflow-hidden flex flex-col items-center justify-between z-20">
                {/* One Big Front Buck Tooth */}
                <div className="w-6 h-3 bg-white rounded-b-md shadow" />
                <div className="w-10 h-3 bg-blue-400 rounded-t-full" />
              </div>
            </div>

            {/* Twig Arms */}
            <motion.div
              className="absolute -left-6 top-14 w-8 h-2 bg-amber-950 rounded rotate-[-25deg] shadow z-20"
              animate={reaction === 'equals' ? { rotate: [-40, -10, -40] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <motion.div
              className="absolute -right-6 top-14 w-8 h-2 bg-amber-950 rounded rotate-[25deg] shadow z-20"
              animate={reaction === 'equals' ? { rotate: [40, 10, 40] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>

      {/* Pedestal Shadow */}
      <div className="w-32 sm:w-44 h-2.5 bg-black/30 rounded-full blur-[2px] mt-1" />
    </div>
  );
};
