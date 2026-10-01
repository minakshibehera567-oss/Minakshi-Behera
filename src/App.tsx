/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Calculator } from './components/Calculator';
import { PixieDustCanvas, PixieDustHandle } from './components/PixieDustCanvas';

export default function App() {
  const pixieDustRef = useRef<PixieDustHandle | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Pixie Dust Particle Burst Canvas (Star Sparkles, Mickey Silhouettes, Notes) */}
      <PixieDustCanvas ref={pixieDustRef} />

      {/* Main Disney Cartoon Animated Calculator */}
      <Calculator pixieDustRef={pixieDustRef} />
    </div>
  );
}

