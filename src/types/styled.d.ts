import "styled-components";
import type { css } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    // Colors
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    tertiary: string;
    tertiaryDark: string;
    background: string;
    backgroundHighlight: string;
    backgroundSubtleGradient: string;
    midl: string;
    light: string;
    text: string;
    isLight: boolean;

    // Gradients
    primaryGradient: string;
    secondaryGradient: string;
    tertiaryGradient: string;
    neutralGradient: string;
    softGradient: string;

    // Animations
    elastic1: string;
    elastic2: string;
    motion: { stiffness: number; damping: number };

    // Breakpoints
    breakpoint: { tablet: number; mobile: number };

    // CSS Rules (these should be RuleSet, not string)
    title: RuleSet<object>;
    monospace: RuleSet<object>;
    active: string;

    // Media query helpers
    media: {
      mobile: (...args: Parameters<typeof css>) => RuleSet<object>;
      tablet: (...args: Parameters<typeof css>) => RuleSet<object>;
      desktop: (...args: Parameters<typeof css>) => RuleSet<object>;
    };

    // Functions
    getColor: (p: {
      theme: Theme;
      colorType?: number;
      $colorType?: number;
    }) => string;
    getGradient: (p: {
      theme: Theme;
      colorType?: number;
      $colorType?: number;
    }) => string;

    // Z-index
    zindex: { logo: number; menu: number; content: number };
  }
}
