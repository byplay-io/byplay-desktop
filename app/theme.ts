export const colors = {
  text: "#F5F5F5",
  bright: "#FFFF00",
  brightMuted: "#555500",
  secondary: "#ff00ff",
  primary: "#00ffff",
  secondaryMuted: "#800080",
  textMuted: "#c7c7c7",
  primaryFgDisabled: "rgb(66,66,66)",
  primaryBg: "#1C1018",
  secondaryBg: "#2f2f2f",
  primaryBgTransparent: "rgba(28,16,24,0.8)",
  primaryBgTransparentMore: "rgba(28,16,24,0.3)",
  success:   "#00ff00",
  successMuted:   "#00c700",
  danger:    "#9A031E",
}// default theme preset

export default {
  colors: {
    text: colors.text,
    background: colors.primaryBg,
    primary: colors.primary,
    secondary: colors.secondary,
    muted: colors.textMuted,
    gray: '#dddddf',
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
