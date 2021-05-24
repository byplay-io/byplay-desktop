export const colors = {
  text: "#010101",
  bright: "#8d8d00",
  brightMuted: "#e7e7b5",
  primary: "rgb(0, 122, 255)",
  textMuted: "#616161",
  primaryBg: "#ffffff",
  secondaryBg: "#f1f1f1",
  primaryBgTransparent: "rgba(240,240,240,0.8)",
  primaryBgTransparentMore: "rgba(240,240,240,0.3)",
  success:   "#00a000",
  successMuted: "#009000",
  danger:    "#9A031E",
  dangerBright:    "#ff0000",
  secondary: "#0000ff",
  secondaryMuted: "#800080",
  successBg: "#1d3120",
  downloadingBorder: "#cdc000",
  notDownloadedBorder: "#ff0000",
}

export default {
  colors: {
    text: colors.text,
    background: colors.primaryBg,
    primary: colors.primary,
    secondary: colors.secondary,
    muted: colors.textMuted,
    gray: '#dddddf',
    danger: colors.danger,
    success: colors.success,
    successMuted: colors.successMuted,
    highlight: colors.bright,
    highlightMuted: colors.brightMuted,
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'inherit',
    monospace: 'Roboto Mono',
  },
  fontSizes: [
    12, 14, 16, 20, 24, 32, 48, 64, 96
  ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    avatar: 48,
  },
  radii: {
    default: 4,
    circle: 99999,
  },
  shadows: {
    card: '0 0 4px rgba(0, 0, 0, .125)',
  },
  // rebass variants
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
    },
    display: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: [ 5, 6, 7 ],
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  variants: {
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      p: 2,
      bg: 'background',
      boxShadow: 'card',
    },
    link: {
      color: 'primary',
    },
    nav: {
      fontSize: 1,
      fontWeight: 'bold',
      display: 'inline-block',
      p: 2,
      color: 'inherit',
      textDecoration: 'none',
      ':hover,:focus,.active': {
        color: 'primary',
      }
    },
  },
  buttons: {
    primary: {
      fontSize: 2,
      fontWeight: 'bold',
      color: 'background',
      bg: 'primary',
      borderRadius: 'default',
    },
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 2px',
      fontWeight: 'normal',
      '&:hover': {
        backgroundColor: 'primary',
        color: colors.primaryBg
      }
    },
    outlineDanger: {
      variant: 'buttons.primary',
      color: 'danger',
      bg: 'transparent',
      boxShadow: 'inset 0 0 2px',
      fontWeight: 'normal',
      '&:hover': {
        backgroundColor: 'danger',
        color: colors.primaryBg
      }
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      bg: 'secondary',
    },
  },
  links: {
    primary: {
      textDecoration: "underline"
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
  },
}
