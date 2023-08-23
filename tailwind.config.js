const colors = {
  primary: '#00e3a7',
  primaryUi: '#00C792',
  primaryMuted: '#010c0a',
  dark1: '#0b150e',
  dark2: '#041502',
  dark3: '#010E02',
  light1: '#eeeeee',
  light2: '#d5d5d5',
  text: '#ffffff',
  red: '#E52020',
  redMuted: 'rgba(224,35,35,0.2)',
};

module.exports = {
  theme: {
    colors: {
      primary: '#00C792',
      'primary-lighter': '#00e3a7',
      dark1: colors.dark1,
      dark2: colors.dark2,
      dark3: colors.dark3,
      muted: '#004d38',
      light1: colors.light1,
      light2: colors.light2,
      text: '#ffffff',
      red: '#E52020',
      'red-muted-200': '#330707',
      'red-muted-400': '#791010',
    },
    extend: {
      boxShadow: {
        '2xl-center': '0 0 1.2rem crimson',
      },
    },
  },
  variants: {},
  plugins: [],
  content: ['./src/**/*.tsx'],
};
