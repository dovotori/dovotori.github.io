import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { dark } from "../src/themes/theme";
import theme from "./theme";

import "../public/style/critical.css";

export const tags = ["autodocs"];

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme,
  },
};

export const decorators = [
  (Story) => (
    <Router>
      <ThemeProvider theme={dark}>
        <Story />
      </ThemeProvider>
    </Router>
  ),
];
