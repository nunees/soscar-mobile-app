import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    purple: {
      100: '#f4e7fe',
      200: '#dfb7fb',
      300: '#ca87f8',
      400: '#b557f5',
      500: '#a026f2',
      600: '#860dd9',
      700: '#680aa8',
      800: '#4a0778',
      900: '#2d0448',
    },
    gray: {
      100: '#f1f1f1',
      200: '#d4d4d4',
      300: '#b8b8b8',
      400: '#9c9c9c',
      500: '#808080',
      600: '#636363',
      700: '#474747',
      800: '#2a2a2a',
      900: '#0e0e0e',
    },
    white: '#FFFFFF',
    red: {
      100: '#ffe3e3',
      200: '#ffaaaa',
      300: '#ff7171',
      400: '#ff3939',
      500: '#ff0000',
      600: '#c60000',
      700: '#8e0000',
      800: '#550000',
      900: '#1c0000',
    },
  },
  fonts: {
    heading: 'Nunito_700Bold',
    body: 'Nunito_400Regular',
  },
  fontSizes: {
    xxs: 8,
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
