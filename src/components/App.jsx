import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { dark, light } from '../themes/theme';
import RoutesContainer from '../containers/RoutesContainer';

if (process.env.NODE_ENV !== 'production') {
  console.debug('%c Hello JS Coders! ', `background: ${dark.primary}; color: #000`);
}

const App = ({ isDarkMode }) => {
  useEffect(() => {
    document.body.setAttribute('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <ThemeProvider theme={isDarkMode ? dark : light}>
        <RoutesContainer />
      </ThemeProvider>
    </>
  );
};

export default App;
