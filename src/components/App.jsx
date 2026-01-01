import { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { getIsDarkMode } from "../selectors";
import { dark, light } from "../themes/theme";
import Routes from "./Routes";

if (process.env.NODE_ENV !== "production") {
  console.debug("%c Hello JS Coders! ", `background: ${dark.primary}; color: #000`);
}

const App = () => {
  const isDarkMode = getIsDarkMode();
  useEffect(() => {
    document.body.setAttribute("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <Routes />
    </ThemeProvider>
  );
};

export default App;
