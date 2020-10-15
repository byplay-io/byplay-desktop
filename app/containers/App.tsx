import React, { ReactNode } from 'react';

import { ThemeProvider } from 'emotion-theming'
import theme from '../theme'

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>;
}
