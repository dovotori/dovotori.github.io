import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { dark } from "../src/themes/theme";
import theme from "./theme";

import "../public/style/critical.css";

// Fix accessibility contrast for buttons in dark theme
const StorybookGlobalStyle = createGlobalStyle`
  button[type="button"],
  button[data-testid] {
    color: #fff;
    background-color: #333;
    border: 1px solid #444;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #444;
    }
  }
`;

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
        <StorybookGlobalStyle />
        <Story />
      </ThemeProvider>
    </Router>
  ),
];
