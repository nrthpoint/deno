export const LatoFonts = {
  regular: 'Lato-Regular',
  bold: 'Lato-Bold',
  italic: 'Lato-Italic',
  boldItalic: 'Lato-BoldItalic',
  light: 'Lato-Light',
  lightItalic: 'Lato-LightItalic',
  black: 'Lato-Black',
  blackItalic: 'Lato-BlackItalic',
  thin: 'Lato-Thin',
  thinItalic: 'Lato-ThinItalic',
} as const;

export const getLatoFont = (weight: keyof typeof LatoFonts = 'regular') => ({
  fontFamily: LatoFonts[weight],
});
