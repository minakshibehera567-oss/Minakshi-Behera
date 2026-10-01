export type CartoonCharacterId = 'elsa' | 'anna' | 'moana' | 'olaf';

export interface ThemeConfig {
  id: CartoonCharacterId;
  name: string;
  movie: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  calculatorBody: string;
  displayBg: string;
  buttonNumberBg: string;
  buttonNumberHover: string;
  buttonNumberText: string;
  buttonOperatorBg: string;
  buttonOperatorHover: string;
  buttonOperatorText: string;
  buttonScientificBg: string;
  buttonScientificText: string;
  buttonEqualsBg: string;
  buttonSpecialBg: string;
  particleType: 'snowflake' | 'flower' | 'heart' | 'magic';
  catchphrases: {
    greeting: string;
    numberTap: string[];
    operatorTap: string[];
    trigTap: string[];
    equals: string[];
    clear: string[];
    easterEgg: string[];
  };
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  character: CartoonCharacterId;
  tag?: string;
}

export type AngleMode = 'DEG' | 'RAD';

