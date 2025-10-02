/**
 * Veliessa Luxury Theme System
 * 
 * A centralized theme system for maintaining consistent luxury styling
 * across the entire application, with a focus on premium gold aesthetics
 * and psychological triggers associated with luxury brands.
 */

export const LUXURY_THEME = {
  // Brand Colors
  colors: {
    primary: '#D4AF37', // Primary gold
    primaryLight: '#F2D675',
    primaryDark: '#BF953F',
    secondary: '#85754E', // Dark gold/bronze
    accent: '#FCF6BA', // Light gold accent
    background: {
      light: '#FFFFFF',
      subtle: '#FFFDF2',
      warm: '#FFF8E1',
      gold: '#F5F5F0'
    },
    text: {
      primary: '#262626',
      secondary: '#666666',
      gold: '#85754E',
      light: '#999999'
    },
    
    // Extended palette for UI elements
    ui: {
      focus: 'rgba(212, 175, 55, 0.4)',
      hover: 'rgba(212, 175, 55, 0.1)',
      active: 'rgba(212, 175, 55, 0.2)',
      border: 'rgba(212, 175, 55, 0.3)',
      shadow: 'rgba(212, 175, 55, 0.25)'
    }
  },

  // Premium Gradients
  gradients: {
    // Standard gold gradient (left to right)
    primary: 'bg-gradient-to-r from-[#D4AF37] to-[#F2D675]',
    
    // Rich dimensional gold gradient with middle tone
    rich: 'bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] via-[#D5BE73]',
    
    // Subtle background gradient (top-left to bottom-right)
    subtle: 'bg-gradient-to-br from-white via-[#FFFDF2] to-[#FFF8E1]',
    
    // Dark gold gradient for accents and dark mode
    dark: 'bg-gradient-to-r from-[#85754E] to-[#D4AF37]',
    
    // Authentication pages gradient (as specified in memories)
    auth: 'bg-gradient-to-br from-white via-[#F5F5E9] to-[#EAD69D]',
    
    // Button gradients
    button: 'bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] via-[#D5BE73]',
    buttonHover: 'bg-gradient-to-r from-[#BF953F] to-[#FAEEB2] via-[#D5BE73]'
  },

  // Typography styles
  typography: {
    heading: {
      font: 'font-serif', // Serif for headings adds luxury feel
      weight: 'font-extralight',
      tracking: 'tracking-wide',
      color: 'text-[#262626]'
    },
    subheading: {
      font: 'font-serif',
      weight: 'font-light',
      tracking: 'tracking-wider',
      color: 'text-[#85754E]'
    },
    body: {
      font: 'font-sans',
      weight: 'font-light',
      tracking: 'tracking-wide',
      color: 'text-[#666666]'
    },
    accent: {
      tracking: 'tracking-[0.3em]',
      transform: 'uppercase',
      size: 'text-xs',
      color: 'text-[#85754E]'
    }
  },

  // Luxury Shadows
  shadows: {
    subtle: 'shadow-[0_5px_20px_rgba(212,175,55,0.1)]',
    medium: 'shadow-[0_15px_50px_rgba(212,175,55,0.25)]',
    intense: 'shadow-[0_20px_60px_rgba(212,175,55,0.3)]',
    glow: 'shadow-[0_0_30px_rgba(212,175,55,0.4)]'
  },

  // Luxury Border Styles
  borders: {
    thin: 'border border-[#D4AF37]/20',
    medium: 'border-2 border-[#D4AF37]/30',
    accent: 'border-b-2 border-[#D4AF37]',
    focus: 'outline-none ring-1 ring-[#D4AF37]/50',
    subtle: 'border-b border-[#D4AF37]/10',
    button: 'border border-[#D4AF37]/40'
  },

  // Background Patterns
  patterns: {
    // pattern for page backgrounds (as specified in memories)
    pattern: {
      url: 'bg-[url("/pattern.svg")]',
      opacity: 'opacity-5',
      size: 'bg-[length:60px_60px]',
      repeat: 'bg-repeat',
      className: 'bg-[url("/pattern.svg")] bg-repeat opacity-5 bg-[length:60px_60px]'
    },
    // Plus pattern for header backgrounds
    plus: {
      url: 'bg-[url("/plus-pattern.svg")]',
      opacity: 'opacity-10',
      size: 'bg-[length:40px_40px]',
      repeat: 'bg-repeat',
      className: 'bg-[url("/plus-pattern.svg")] bg-repeat opacity-10 bg-[length:40px_40px]'
    }
  },

  // Authentication Page Specific Styling
  authPages: {
    // Background with pattern as specified in memories
    background: 'bg-gradient-to-br from-white via-[#F5F5E9] to-[#EAD69D] bg-[url("/pattern.svg")] bg-repeat bg-[length:60px_60px] opacity-100',
    
    // Padding as specified in memories
    padding: 'px-4 py-16 md:py-12 pt-24 md:pt-20',
    
    // Card styling for auth forms
    card: {
      background: 'bg-white/90 backdrop-blur-sm',
      shadow: 'shadow-[0_15px_50px_rgba(212,175,55,0.25)]',
      border: 'border border-[#D4AF37]/20',
      rounded: 'rounded-none', // Classic non-rounded corners
      padding: 'p-8 md:p-10'
    },
    
    // Form input styling
    input: {
      base: 'w-full border-b-2 border-[#D4AF37]/30 bg-transparent px-4 py-2 focus:border-[#D4AF37] focus:outline-none transition-colors',
      focus: 'focus:ring-1 focus:ring-[#D4AF37]/20',
      error: 'border-b-2 border-red-500 focus:border-red-500'
    },
    
    // Button styling
    button: {
      primary: 'bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] via-[#D5BE73] text-white tracking-[0.2em] uppercase text-xs font-light shadow-[0_15px_50px_rgba(212,175,55,0.25)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)] transition-all duration-500',
      secondary: 'border border-[#D4AF37]/40 text-[#85754E] tracking-[0.2em] uppercase text-xs font-light hover:bg-[#D4AF37]/5 transition-all duration-300',
      disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed tracking-[0.2em] uppercase text-xs font-light'
    }
  },

  // Custom component classes for direct use
  components: {
    // Gold header with accent line
    luxuryHeader: 'font-serif text-4xl md:text-6xl font-extralight tracking-wide text-[#262626] relative after:content-[""] after:block after:w-12 after:h-px after:bg-[#D4AF37] after:mt-4 after:mb-6',
    
    // Luxury subtitle
    luxurySubtitle: 'text-xs uppercase tracking-[0.3em] text-[#85754E] opacity-70',
    
    // Gold badge/tag
    luxuryTag: 'inline-block text-xs uppercase tracking-[0.3em] text-[#BF953F] bg-[#D4AF37]/10 px-6 py-3 border border-[#D4AF37]/20 rounded-full',
    
    // Luxury button
    luxuryButton: 'px-8 py-3 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] via-[#D5BE73] text-white tracking-[0.2em] uppercase text-xs font-light shadow-[0_15px_50px_rgba(212,175,55,0.25)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)] transition-all duration-500'
  },
  
  // Psychological Triggers from Luxury Marketing
  psychologicalTriggers: {
    exclusivity: 'Limited Edition',
    scarcity: 'Only 50 Available',
    status: 'Member Exclusive',
    prestige: 'Heritage Collection',
    legacy: 'Generational Excellence',
    craftsmanship: 'Artisan Crafted',
    rarity: 'Rare Opportunity',
    uniqueness: 'One-of-a-Kind'
  }
};

/**
 * Helper function to combine multiple luxury theme classes
 */
export const luxuryClasses = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Authentication-specific styling based on the memories
 */
export const getAuthPageStyles = () => {
  const { background, padding } = LUXURY_THEME.authPages;
  return `${background} ${padding}`;
};

/**
 * Export default to make imports cleaner
 */
export default LUXURY_THEME;
