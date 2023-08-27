import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    orange: {
      100: '#FFF1E8',
      200: '#FFD9C0',
      300: '#FFC8A3',
      400: '#FFAA72',
      500: '#FF934A',
      600: '#FD7C26',
      700: '#FB6E10',
      800: '#F66606',
      900: '#E75C00',
    },
    gray: {
      100: '#161616',
      200: '#2C2C2C',
      300: '#444545',
      400: '#777777',
      500: '#A3A3A3',
      600: '#CCCCCC',
      700: '#F0F0F0',
      800: '#F6F6F6',
      900: '#FEFEFE',
    },
    white: '#FFFFFF',
    red: {
      500: '#F75A68',
    },
  },
  fonts: {
    heading: 'Poppins_700Bold',
    body: 'Poppins_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xlg: 24,
    big: 32,
  },
  sizes: {
    14: 56,
    33: 148,
  },
});
