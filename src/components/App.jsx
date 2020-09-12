import React, { useEffect } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import { dark, light } from "../themes/theme";
import RoutesContainer from "../containers/RoutesContainer";

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 14px;
  }
`;

if (process.env.NODE_ENV !== "production") {
  console.debug(
    "%c Hello JS Coders! ",
    `background: ${dark.primary}; color: #000`
  );
}

const App = ({ isDarkMode }) => {
  useEffect(() => {
    document.body.style.background = isDarkMode
      ? dark.background
      : light.background;
    document.body.setAttribute("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={isDarkMode ? dark : light}>
        <RoutesContainer />
      </ThemeProvider>
    </>
  );
};

export default App;
