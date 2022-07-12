import { createTheme, style } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue',
    white: '#fff'
  },
  space: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
});

export const heroText = style({
  backgroundColor: vars.color.brand,
  color: vars.color.white,
  padding: vars.space.large,
  fontSize: '50px'
});
