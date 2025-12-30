import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { themes } from "storybook/theming";
import { dark } from "../src/themes/theme";

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
    theme: themes.dark,
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
