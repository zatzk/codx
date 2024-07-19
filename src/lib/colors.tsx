/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
interface ColorSets {
  [key: string]: {
    primary: string;
    secondary: string;
    barHover: string;
    bg: string;
    cardBg: string;
    cardGradient: string;
    borderButton: string;
    hoverBorderButton: string;
    gradientBg: string;
    g1: string;
    g2: string;
    g3: string;
    g4: string;
    g5: string;
    interactive: string;
    paragraph: string;
  };
}

export const colorSets: ColorSets = {
  pink: {
    primary: 'text-pink-600',
    secondary: 'text-pink-300',
    barHover: 'hover:bg-pink-400',
    bg: 'bg-pink-500',
    cardBg: 'bg-red-500',
    cardGradient: 'bg-gradient-to-tr from-pink-500/5 to-red-500/25',
    borderButton: 'border-pink-600',
    hoverBorderButton: 'hover:border-pink-400',
    gradientBg: '219, 39, 119',
    g1: '39, 219, 138',
    g2: '39, 120, 219',
    g3: '219, 138, 39',
    g4: '200, 50, 50',
    g5: '180, 180, 50',
    interactive: '140, 100, 255',
    paragraph: 'text-[#feebf7]',
  },
  sky: {
    primary: 'text-sky-600',
    secondary: 'text-sky-300',
    barHover: 'hover:bg-sky-400',
    bg: 'bg-sky-500',
    cardBg: 'bg-sky-500',
    cardGradient: 'bg-gradient-to-tr from-sky-500/5 to-blue-500/25',
    borderButton: 'border-sky-600',
    hoverBorderButton: 'hover:border-sky-400',
    gradientBg: '2, 132, 199',
    g1: '199, 68, 2',
    g2: '133, 199, 2',
    g3: '68, 2, 199',
    g4: '133, 199, 2',
    g5: '199, 2, 133',
    interactive: '140, 100, 255',
    paragraph: 'text-[#eaf6ff]',
  },
  green: {
    primary: 'text-green-600',
    secondary: 'text-green-300',
    barHover: 'hover:bg-green-400',
    bg: 'bg-green-500',
    cardBg: 'bg-green-500',
    cardGradient: 'bg-gradient-to-tr from-green-500/5 to-green-500/25',
    borderButton: 'border-green-600',
    hoverBorderButton: 'hover:border-green-400',
    gradientBg: '22, 163, 74',
    g1: '199, 68, 2',
    g2: '133, 199, 2',
    g3: '163, 22, 111',
    g4: '200, 50, 50',
    g5: '163, 74, 22',
    interactive: '140, 100, 255',
    paragraph: 'text-[#e5fbeb]',
  },
  orange: {
    primary: 'text-orange-600',
    secondary: 'text-orange-300',
    barHover: 'hover:bg-orange-400',
    bg: 'bg-orange-500',
    cardBg: 'bg-yellow-500',
    cardGradient: 'bg-gradient-to-tr from-orange-500/5 to-yellow-500/25',
    borderButton: 'border-orange-600',
    hoverBorderButton: 'hover:border-orange-400',
    gradientBg: '234, 88, 12',
    g1: '12, 156, 234',
    g2: '90, 12, 234',
    g3: '156, 234, 12',
    g4: '200, 50, 50',
    g5: '180, 180, 50',
    interactive: '140, 100, 255',
    paragraph: 'text-[#feeadd]',
  },
  white: {
    primary: 'text-white',
    secondary: 'text-white',
    barHover: 'hover:bg-gray-400',
    bg: 'bg-gray-800',
    cardBg: 'bg-gray-800',
    cardGradient: 'bg-gradient-to-tr from-gray-800/5 to-gray-800/25',
    borderButton: 'border-white',
    hoverBorderButton: 'hover:border-gray-400',
    gradientBg: '86, 205, 226',
    g1: '18, 113, 255',
    g2: '221, 74, 255',
    g3: '100, 220, 255',
    g4: '200, 50, 50',
    g5: '180, 180, 50',
    interactive: '140, 100, 255',
    paragraph: 'text-white',
  }
};