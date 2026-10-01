import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  History,
  Delete,
  Settings,
  Star,
  Compass,
} from 'lucide-react';
import { CartoonCharacterId, CalculationHistoryItem, AngleMode } from '../types';
import { DISNEY_THEMES, DISNEY_EASTER_EGGS } from '../utils/themeData';
import { soundEffects } from '../utils/soundEffects';
import { CartoonMascot } from './CartoonMascot';
import { PixieDustHandle } from './PixieDustCanvas';
import { HistoryTape } from './HistoryTape';
import { SoundSettingsModal } from './SoundSettingsModal';
import { DisneyTriviaModal } from './DisneyTriviaModal';

interface CalculatorProps {
  pixieDustRef: React.RefObject<PixieDustHandle | null>;
}

export const Calculator: React.FC<CalculatorProps> = ({ pixieDustRef }) => {
  const [characterId, setCharacterId] = useState<CartoonCharacterId>('elsa');
  const theme = DISNEY_THEMES[characterId];

  // Calculator Core State
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null);

  // Scientific Modes
  const [isScientific, setIsScientific] = useState<boolean>(true);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isInverse, setIsInverse] = useState<boolean>(false);

  // Character Mascot State
  const [reaction, setReaction] = useState<
    'idle' | 'numberTap' | 'operatorTap' | 'equals' | 'clear' | 'easterEgg'
  >('idle');
  const [speechText, setSpeechText] = useState<string>(theme.catchphrases.greeting);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // History & Modals
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState<boolean>(false);

  // Sound States
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuted());
  const [volume, setVolume] = useState<number>(soundEffects.getVolume());
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(soundEffects.getSpeechEnabled());

  const reactionTimeoutRef = useRef<number | null>(null);

  const triggerReaction = (
    newReaction: 'numberTap' | 'operatorTap' | 'equals' | 'clear' | 'easterEgg',
    customText?: string
  ) => {
    setReaction(newReaction);
    if (customText) {
      setSpeechText(customText);
    } else {
      let pool: string[] = [];
      if (newReaction === 'numberTap') pool = theme.catchphrases.numberTap;
      else if (newReaction === 'operatorTap') pool = theme.catchphrases.operatorTap;
      else if (newReaction === 'equals') pool = theme.catchphrases.equals;
      else if (newReaction === 'clear') pool = theme.catchphrases.clear;
      else if (newReaction === 'easterEgg') pool = theme.catchphrases.easterEgg;

      if (pool.length > 0) {
        setSpeechText(pool[Math.floor(Math.random() * pool.length)]);
      }
    }

    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current);
    }
    reactionTimeoutRef.current = window.setTimeout(() => {
      setReaction('idle');
    }, 2000);
  };

  // Check for Disney Princess Easter Eggs
  const checkEasterEgg = (val: string) => {
    if (DISNEY_EASTER_EGGS[val]) {
      setActiveEasterEgg(DISNEY_EASTER_EGGS[val]);
      soundEffects.playEasterEggFanfare();
      triggerReaction('easterEgg', DISNEY_EASTER_EGGS[val]);
      pixieDustRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 45, characterId);
    } else {
      setActiveEasterEgg(null);
    }
  };

  // Number input
  const inputDigit = useCallback(
    (digit: number, clientX?: number, clientY?: number) => {
      soundEffects.playNumber(digit, characterId);

      if (clientX !== undefined && clientY !== undefined) {
        pixieDustRef.current?.floatNote(clientX, clientY);
      }

      let newDisplay = displayValue;
      if (waitingForOperand) {
        newDisplay = String(digit);
        setWaitingForOperand(false);
      } else {
        newDisplay = displayValue === '0' ? String(digit) : displayValue + digit;
      }

      if (newDisplay.length > 14) return;

      setDisplayValue(newDisplay);
      checkEasterEgg(newDisplay);
      triggerReaction('numberTap');
    },
    [characterId, displayValue, waitingForOperand]
  );

  // Decimal
  const inputDecimal = useCallback(
    (clientX?: number, clientY?: number) => {
      soundEffects.playDecimal();
      if (clientX !== undefined && clientY !== undefined) {
        pixieDustRef.current?.burst(clientX, clientY, 10, characterId);
      }

      if (waitingForOperand) {
        setDisplayValue('0.');
        setWaitingForOperand(false);
      } else if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
      triggerReaction('numberTap');
    },
    [characterId, displayValue, waitingForOperand]
  );

  // Constants: Pi and E
  const inputConstant = (type: 'pi' | 'e') => {
    soundEffects.playOperator(type === 'pi' ? 'π' : 'e');
    const val = type === 'pi' ? Math.PI : Math.E;
    const formatted = parseFloat(val.toFixed(8)).toString();
    setDisplayValue(formatted);
    setWaitingForOperand(true);
    triggerReaction('numberTap', type === 'pi' ? 'Pi: 3.14159... Circle of Life!' : 'Euler\'s Number!');
    checkEasterEgg(type === 'pi' ? '3.14159' : '2.71828');
  };

  // Math calculation logic
  const performCalculation = (op: string, a: number, b: number): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
      case '*':
        return a * b;
      case '÷':
      case '/':
        return b !== 0 ? a / b : NaN;
      case 'mod':
      case '%':
        return b !== 0 ? a % b : NaN;
      case '^':
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  // Operator input (+, -, ×, ÷, mod, ^)
  const handleOperator = useCallback(
    (op: string, clientX?: number, clientY?: number) => {
      soundEffects.playOperator(op);

      if (clientX !== undefined && clientY !== undefined) {
        pixieDustRef.current?.burst(clientX, clientY, 16, characterId);
      }

      const currentNumber = parseFloat(displayValue);

      if (prevValue === null) {
        setPrevValue(currentNumber);
        setExpression(`${displayValue} ${op}`);
      } else if (pendingOp && !waitingForOperand) {
        const result = performCalculation(pendingOp, prevValue, currentNumber);
        if (isNaN(result) || !isFinite(result)) {
          setDisplayValue('Gosh! Error!');
          setPrevValue(null);
          setPendingOp(null);
          setExpression('');
          triggerReaction('clear', 'Oops! Dividing by zero or math limit!');
          return;
        }
        const formatted = Number.isInteger(result)
          ? String(result)
          : parseFloat(result.toFixed(8)).toString();
        setDisplayValue(formatted);
        setPrevValue(result);
        setExpression(`${formatted} ${op}`);
      } else {
        setExpression(`${displayValue} ${op}`);
      }

      setPendingOp(op);
      setWaitingForOperand(true);
      triggerReaction('operatorTap');
    },
    [characterId, displayValue, pendingOp, prevValue, waitingForOperand]
  );

  // Single-argument Scientific Functions (sin, cos, tan, log, ln, sqrt, etc.)
  const handleScientificUnary = (funcName: string) => {
    const val = parseFloat(displayValue);
    if (isNaN(val)) return;

    soundEffects.playOperator(funcName);
    pixieDustRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 22, characterId);

    let res = 0;
    let label = '';

    // Convert degrees to radians if in DEG mode
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    if (funcName === 'sin') {
      res = Math.sin(angleMode === 'DEG' ? toRad(val) : val);
      label = `sin(${val})`;
    } else if (funcName === 'cos') {
      res = Math.cos(angleMode === 'DEG' ? toRad(val) : val);
      label = `cos(${val})`;
    } else if (funcName === 'tan') {
      res = Math.tan(angleMode === 'DEG' ? toRad(val) : val);
      label = `tan(${val})`;
    } else if (funcName === 'asin') {
      res = Math.asin(val);
      if (angleMode === 'DEG') res = toDeg(res);
      label = `asin(${val})`;
    } else if (funcName === 'acos') {
      res = Math.acos(val);
      if (angleMode === 'DEG') res = toDeg(res);
      label = `acos(${val})`;
    } else if (funcName === 'atan') {
      res = Math.atan(val);
      if (angleMode === 'DEG') res = toDeg(res);
      label = `atan(${val})`;
    } else if (funcName === 'sqrt') {
      if (val < 0) {
        setDisplayValue('Error!');
        triggerReaction('clear', 'Cannot take square root of negative!');
        return;
      }
      res = Math.sqrt(val);
      label = `√(${val})`;
    } else if (funcName === 'cbrt') {
      res = Math.cbrt(val);
      label = `∛(${val})`;
    } else if (funcName === 'square') {
      res = val * val;
      label = `sqr(${val})`;
    } else if (funcName === 'cube') {
      res = val * val * val;
      label = `cube(${val})`;
    } else if (funcName === 'log') {
      if (val <= 0) {
        setDisplayValue('Error!');
        triggerReaction('clear', 'Log of non-positive!');
        return;
      }
      res = Math.log10(val);
      label = `log(${val})`;
    } else if (funcName === 'ln') {
      if (val <= 0) {
        setDisplayValue('Error!');
        triggerReaction('clear', 'Ln of non-positive!');
        return;
      }
      res = Math.log(val);
      label = `ln(${val})`;
    } else if (funcName === 'fact') {
      // Factorial
      if (val < 0 || !Number.isInteger(val) || val > 170) {
        setDisplayValue('Error!');
        triggerReaction('clear', 'Factorial error!');
        return;
      }
      let f = 1;
      for (let i = 2; i <= val; i++) f *= i;
      res = f;
      label = `${val}!`;
    } else if (funcName === 'recip') {
      if (val === 0) {
        setDisplayValue('Error!');
        triggerReaction('clear', 'Division by zero!');
        return;
      }
      res = 1 / val;
      label = `1/(${val})`;
    } else if (funcName === 'abs') {
      res = Math.abs(val);
      label = `|${val}|`;
    }

    if (isNaN(res) || !isFinite(res)) {
      setDisplayValue('Error!');
      triggerReaction('clear', 'Math domain error!');
      return;
    }

    // Clean floating point inaccuracies (e.g. sin(180) = 0, not 1.22e-16)
    if (Math.abs(res) < 1e-12) res = 0;
    const formatted = parseFloat(res.toFixed(8)).toString();

    setDisplayValue(formatted);
    setExpression(`${label} =`);
    setWaitingForOperand(true);
    triggerReaction('equals', `Calculated ${label} = ${formatted}`);
  };

  // Equals (=)
  const handleEquals = useCallback(
    (clientX?: number, clientY?: number) => {
      if (prevValue === null || !pendingOp) {
        soundEffects.playOperator('+');
        return;
      }

      const currentNumber = parseFloat(displayValue);
      const result = performCalculation(pendingOp, prevValue, currentNumber);

      if (isNaN(result) || !isFinite(result)) {
        soundEffects.playClear();
        setDisplayValue('Error!');
        setPrevValue(null);
        setPendingOp(null);
        setExpression('');
        triggerReaction('clear', 'Aw phooey! Math error!');
        return;
      }

      const formatted = Number.isInteger(result)
        ? String(result)
        : parseFloat(result.toFixed(8)).toString();

      soundEffects.playEquals();

      // Magical Princess Particle Explosion
      const burstX = clientX ?? window.innerWidth / 2;
      const burstY = clientY ?? window.innerHeight / 2;
      pixieDustRef.current?.burst(burstX, burstY, 36, characterId);

      const fullExpression = `${prevValue} ${pendingOp} ${currentNumber}`;
      setExpression(`${fullExpression} =`);
      setDisplayValue(formatted);
      setPrevValue(null);
      setPendingOp(null);
      setWaitingForOperand(true);

      checkEasterEgg(formatted);
      triggerReaction('equals');

      // Add to math tape
      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          expression: fullExpression,
          result: formatted,
          timestamp: new Date(),
          character: characterId,
          tag: DISNEY_EASTER_EGGS[formatted],
        },
        ...prev.slice(0, 49),
      ]);
    },
    [characterId, displayValue, pendingOp, prevValue]
  );

  // Clear (AC)
  const handleClear = useCallback(() => {
    soundEffects.playClear();
    setDisplayValue('0');
    setExpression('');
    setPrevValue(null);
    setPendingOp(null);
    setWaitingForOperand(false);
    setActiveEasterEgg(null);
    triggerReaction('clear');
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    soundEffects.playBackspace();
    if (waitingForOperand) return;
    if (displayValue.length > 1) {
      const nextVal = displayValue.slice(0, -1);
      setDisplayValue(nextVal);
      checkEasterEgg(nextVal);
    } else {
      setDisplayValue('0');
      setActiveEasterEgg(null);
    }
    triggerReaction('numberTap');
  }, [displayValue, waitingForOperand]);

  // Plus / Minus (±)
  const handlePlusMinus = useCallback(() => {
    soundEffects.playOperator('×');
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const nextVal = String(-val);
      setDisplayValue(nextVal);
    }
  }, [displayValue]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        inputDigit(parseInt(e.key, 10));
      } else if (e.key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleOperator('mod');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, handleOperator, handleEquals, handleBackspace, handleClear]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    soundEffects.setVolume(val);
  };

  const toggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    soundEffects.setSpeechEnabled(next);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 bg-gradient-to-br ${theme.bgGradient} transition-colors duration-500 relative overflow-x-hidden`}
    >
      {/* Background Magic Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200/30 via-transparent to-transparent" />

      {/* Top Bar Navigation */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 z-20">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-md text-sm border-2 border-slate-900">
            {characterId === 'elsa' && '❄️'}
            {characterId === 'moana' && '🌊'}
            {characterId === 'anna' && '🌻'}
            {characterId === 'olaf' && '⛄'}
          </div>
          <span className="font-bold text-lg sm:text-xl text-white tracking-wide drop-shadow">
            Disney ToonCalc
          </span>
        </div>

        {/* Character Switcher Tabs (Moana, Elsa, Anna, Olaf) */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10">
          {(['elsa', 'moana', 'anna', 'olaf'] as CartoonCharacterId[]).map((cid) => {
            const charTheme = DISNEY_THEMES[cid];
            const isActive = characterId === cid;
            return (
              <button
                key={cid}
                onClick={() => {
                  setCharacterId(cid);
                  soundEffects.playOperator('×');
                  triggerReaction('equals', charTheme.catchphrases.greeting);
                  pixieDustRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 25, cid);
                }}
                className={`px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>
                  {cid === 'elsa' && '❄️'}
                  {cid === 'moana' && '🌊'}
                  {cid === 'anna' && '🌻'}
                  {cid === 'olaf' && '⛄'}
                </span>
                <span className="capitalize">{charTheme.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsScientific(!isScientific)}
            title={isScientific ? 'Switch to Basic Pad' : 'Switch to Scientific Pad'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isScientific
                ? 'bg-cyan-500/80 text-white border-cyan-300'
                : 'bg-slate-800/80 text-slate-300 border-white/20'
            }`}
          >
            {isScientific ? 'Scientific' : 'Basic'}
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className={`p-2 rounded-xl transition-all border ${
              isMuted
                ? 'bg-rose-900/60 border-rose-500/50 text-rose-300'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-300 text-slate-950 shadow-sm'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsTriviaOpen(true)}
            title="Disney Princess Math Trivia"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-300/30 rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            title="Math Reel Tape"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white border border-white/20 rounded-xl transition-all shadow-sm relative"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center border border-slate-900">
                {Math.min(history.length, 99)}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsSoundModalOpen(true)}
            title="Sound Studio & Settings"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white border border-white/20 rounded-xl transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-lg my-auto flex flex-col items-center z-10">
        {/* Animated Cartoon Mascot (Elsa / Moana / Anna / Olaf) */}
        <div className="-mb-8 sm:-mb-10 z-20">
          <CartoonMascot
            characterId={characterId}
            theme={theme}
            reaction={reaction}
            speechText={speechText}
            mousePos={mousePos}
          />
        </div>

        {/* The Disney Heroine Calculator Shell */}
        <div
          className={`w-full ${theme.calculatorBody} p-4 sm:p-6 rounded-[2.5rem] shadow-2xl relative transition-all duration-300`}
        >
          {/* Top Decorative Floating Crystals/Shells */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
            <div className="w-3.5 h-6 bg-cyan-200 rounded-full border border-cyan-400 shadow-xs" />
            <div className="w-3.5 h-6 bg-cyan-200 rounded-full border border-cyan-400 shadow-xs" />
          </div>

          {/* Calculator Screen / Display */}
          <div
            className={`w-full ${theme.displayBg} p-4 sm:p-5 rounded-2xl mb-4 flex flex-col justify-between min-h-[96px] transition-all relative overflow-hidden`}
          >
            {/* Expression Tape + Angle Mode & Inverse status */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-600 truncate min-h-[22px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-black/10 text-slate-800">
                  {angleMode}
                </span>
                {isInverse && (
                  <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                    INV
                  </span>
                )}
                <span className="tracking-wider truncate max-w-[200px]">
                  {expression || '0'}
                </span>
              </div>

              {activeEasterEgg && (
                <span className="text-[11px] font-bold text-purple-700 bg-purple-200/80 px-2 py-0.5 rounded-full animate-pulse truncate max-w-[180px]">
                  ✨ {activeEasterEgg}
                </span>
              )}
            </div>

            {/* Main Result Display with Cartoon Spring Animation */}
            <div className="flex items-baseline justify-end overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayValue}
                  initial={{ scale: 0.9, opacity: 0.7, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="font-bold tracking-tight text-3xl sm:text-4xl text-right font-mono truncate select-all"
                >
                  {displayValue}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glossy Screen Cartoon Reflection Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>

          {/* Scientific Mode Top Panel (sin, cos, tan, mod, ^, √, log, etc.) */}
          {isScientific && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3 bg-black/20 p-2.5 rounded-2xl border border-white/10"
            >
              {/* Row 1 Scientific: 2nd (Inv), DEG/RAD, sin, cos, tan */}
              <button
                onClick={() => setIsInverse(!isInverse)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isInverse
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-white/15 text-white hover:bg-white/25 border-white/20'
                }`}
              >
                2nd
              </button>

              <button
                onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                className="py-2 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/20 transition-all"
              >
                {angleMode}
              </button>

              <button
                onClick={() => handleScientificUnary(isInverse ? 'asin' : 'sin')}
                className="py-2 rounded-xl text-xs font-bold bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/40 border border-cyan-400/30 transition-all"
              >
                {isInverse ? 'sin⁻¹' : 'sin'}
              </button>

              <button
                onClick={() => handleScientificUnary(isInverse ? 'acos' : 'cos')}
                className="py-2 rounded-xl text-xs font-bold bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/40 border border-cyan-400/30 transition-all"
              >
                {isInverse ? 'cos⁻¹' : 'cos'}
              </button>

              <button
                onClick={() => handleScientificUnary(isInverse ? 'atan' : 'tan')}
                className="py-2 rounded-xl text-xs font-bold bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/40 border border-cyan-400/30 transition-all"
              >
                {isInverse ? 'tan⁻¹' : 'tan'}
              </button>

              {/* Row 2 Scientific: mod, xʸ (^), √ (sqrt), log, ln */}
              <button
                onClick={(e) => handleOperator('mod', e.clientX, e.clientY)}
                className="py-2 rounded-xl text-xs font-bold bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/40 border border-emerald-400/30 transition-all"
              >
                mod
              </button>

              <button
                onClick={(e) => handleOperator('^', e.clientX, e.clientY)}
                className="py-2 rounded-xl text-xs font-bold bg-purple-400/20 text-purple-200 hover:bg-purple-400/40 border border-purple-400/30 transition-all"
              >
                xʸ
              </button>

              <button
                onClick={() => handleScientificUnary('sqrt')}
                className="py-2 rounded-xl text-xs font-bold bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/40 border border-cyan-400/30 transition-all"
              >
                √x
              </button>

              <button
                onClick={() => handleScientificUnary('log')}
                className="py-2 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-200 hover:bg-amber-400/40 border border-amber-400/30 transition-all"
              >
                log
              </button>

              <button
                onClick={() => handleScientificUnary('ln')}
                className="py-2 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-200 hover:bg-amber-400/40 border border-amber-400/30 transition-all"
              >
                ln
              </button>

              {/* Row 3 Scientific: π, e, x², n!, 1/x */}
              <button
                onClick={() => inputConstant('pi')}
                className="py-2 rounded-xl text-xs font-bold bg-pink-400/20 text-pink-200 hover:bg-pink-400/40 border border-pink-400/30 transition-all"
              >
                π
              </button>

              <button
                onClick={() => inputConstant('e')}
                className="py-2 rounded-xl text-xs font-bold bg-pink-400/20 text-pink-200 hover:bg-pink-400/40 border border-pink-400/30 transition-all"
              >
                e
              </button>

              <button
                onClick={() => handleScientificUnary('square')}
                className="py-2 rounded-xl text-xs font-bold bg-purple-400/20 text-purple-200 hover:bg-purple-400/40 border border-purple-400/30 transition-all"
              >
                x²
              </button>

              <button
                onClick={() => handleScientificUnary('fact')}
                className="py-2 rounded-xl text-xs font-bold bg-orange-400/20 text-orange-200 hover:bg-orange-400/40 border border-orange-400/30 transition-all"
              >
                n!
              </button>

              <button
                onClick={() => handleScientificUnary('recip')}
                className="py-2 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/20 transition-all"
              >
                1/x
              </button>
            </motion.div>
          )}

          {/* Standard Keypad Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {/* Row 1: Function Keys */}
            <button
              onClick={handleClear}
              className="py-3 sm:py-3.5 rounded-2xl font-bold text-base sm:text-lg border-2 border-red-300 text-red-900 bg-red-100 hover:bg-red-200 shadow-[0_5px_0_#FCA5A5] active:translate-y-1 active:shadow-[0_1px_0_#FCA5A5] transition-all"
            >
              AC
            </button>

            <button
              onClick={handleBackspace}
              className="py-3 sm:py-3.5 rounded-2xl font-bold text-base sm:text-lg border-2 border-amber-300 text-slate-800 bg-amber-100 hover:bg-amber-200 shadow-[0_5px_0_#FDE68A] active:translate-y-1 active:shadow-[0_1px_0_#FDE68A] transition-all flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>

            <button
              onClick={handlePlusMinus}
              className="py-3 sm:py-3.5 rounded-2xl font-bold text-base sm:text-lg border-2 border-amber-300 text-slate-800 bg-amber-100 hover:bg-amber-200 shadow-[0_5px_0_#FDE68A] active:translate-y-1 active:shadow-[0_1px_0_#FDE68A] transition-all"
            >
              ±
            </button>

            <button
              onClick={(e) => handleOperator('÷', e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-cyan-500 ${theme.buttonOperatorBg} ${theme.buttonOperatorHover} transition-all`}
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, × */}
            <button
              onClick={(e) => inputDigit(7, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              7
            </button>

            <button
              onClick={(e) => inputDigit(8, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              8
            </button>

            <button
              onClick={(e) => inputDigit(9, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              9
            </button>

            <button
              onClick={(e) => handleOperator('×', e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-cyan-500 ${theme.buttonOperatorBg} ${theme.buttonOperatorHover} transition-all`}
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              onClick={(e) => inputDigit(4, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              4
            </button>

            <button
              onClick={(e) => inputDigit(5, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              5
            </button>

            <button
              onClick={(e) => inputDigit(6, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              6
            </button>

            <button
              onClick={(e) => handleOperator('-', e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-cyan-500 ${theme.buttonOperatorBg} ${theme.buttonOperatorHover} transition-all`}
            >
              -
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              onClick={(e) => inputDigit(1, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              1
            </button>

            <button
              onClick={(e) => inputDigit(2, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              2
            </button>

            <button
              onClick={(e) => inputDigit(3, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              3
            </button>

            <button
              onClick={(e) => handleOperator('+', e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-cyan-500 ${theme.buttonOperatorBg} ${theme.buttonOperatorHover} transition-all`}
            >
              +
            </button>

            {/* Row 5: 0, ., mod / %, = */}
            <button
              onClick={(e) => inputDigit(0, e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              0
            </button>

            <button
              onClick={(e) => inputDecimal(e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-xl sm:text-2xl border-2 border-slate-300 ${theme.buttonNumberBg} ${theme.buttonNumberHover} transition-all`}
            >
              .
            </button>

            <button
              onClick={(e) => handleOperator('mod', e.clientX, e.clientY)}
              className="py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base border-2 border-amber-300 text-slate-800 bg-amber-100 hover:bg-amber-200 shadow-[0_5px_0_#FDE68A] active:translate-y-1 active:shadow-[0_1px_0_#FDE68A] transition-all"
            >
              mod
            </button>

            <button
              onClick={(e) => handleEquals(e.clientX, e.clientY)}
              className={`py-3 sm:py-3.5 rounded-2xl font-bold text-2xl sm:text-3xl border-2 border-cyan-600 ${theme.buttonEqualsBg} active:translate-y-1 active:shadow-[0_2px_0_#0369A1] hover:brightness-110 transition-all flex items-center justify-center`}
            >
              =
            </button>
          </div>

          {/* Quick Sound Hint Footer */}
          <div className="mt-4 pt-3 border-t border-black/15 flex items-center justify-between text-[11px] font-bold text-white/80">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Moana, Elsa & Anna voices & sounds active</span>
            </span>
            <button
              onClick={() => setIsTriviaOpen(true)}
              className="underline hover:text-amber-200 transition-colors"
            >
              Disney Codes
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center py-1 z-10 text-xs text-white/60">
        <p>Moana, Elsa, Anna & Olaf Animated Scientific Calculator · Tap mascot to talk!</p>
      </footer>

      {/* History Reel Modal */}
      <HistoryTape
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={(item) => {
          setDisplayValue(item.result);
          setExpression(item.expression + ' =');
          setWaitingForOperand(true);
          soundEffects.playEquals();
        }}
        onClearHistory={() => setHistory([])}
        theme={theme}
      />

      {/* Sound Settings Studio Modal */}
      <SoundSettingsModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        speechEnabled={speechEnabled}
        onToggleSpeech={toggleSpeech}
      />

      {/* Disney Trivia Modal */}
      <DisneyTriviaModal
        isOpen={isTriviaOpen}
        onClose={() => setIsTriviaOpen(false)}
        onSelectCode={(code) => {
          setDisplayValue(code);
          checkEasterEgg(code);
        }}
      />
    </div>
  );
};
