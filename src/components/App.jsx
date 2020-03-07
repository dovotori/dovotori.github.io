/* global process */
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import theme from '../themes/theme';
import RoutesContainer from '../containers/RoutesContainer';

const GlobalStyle = createGlobalStyle`
  body {
    font-size: ${14 + 2 * window.devicePixelRatio}px;
  }
`;

if (process.env.NODE_ENV !== 'production') {
  console.log(
    '%c Hello JS Coders! ',
    `background: ${theme.primary}; color: #000`,
  );
}

const App = () => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <RoutesContainer />
    </ThemeProvider>
  </>
);

export default App;
