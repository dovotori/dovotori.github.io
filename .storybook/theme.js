import { create } from "storybook/theming/create";

export default create({
  base: "dark",

  // Brand
  brandTitle: "Dovotori Components",
  brandUrl: "https://dovotori.github.io",
  brandTarget: "_self",

  // Colors - based on your dark theme
  colorPrimary: "hsl(160, 100%, 70%)", // primary - #66ffcc
  colorSecondary: "hsl(160, 100%, 70%)", // primary for accents

  // UI
  appBg: "#222",
  appContentBg: "#222",
  appPreviewBg: "#222",
  appBorderColor: "#333",
  appBorderRadius: 4,

  // Text colors
  textColor: "#fff",
  textInverseColor: "#222",
  textMutedColor: "#bbb",

  // Toolbar default and active colors
  barTextColor: "#bbb",
  barSelectedColor: "hsl(160, 100%, 70%)",
  barHoverColor: "hsl(160, 100%, 70%)",
  barBg: "#333",

  // Form colors
  inputBg: "#333",
  inputBorder: "#444",
  inputTextColor: "#fff",
  inputBorderRadius: 4,

  // Button colors
  buttonBg: "#333",
  buttonBorder: "#444",

  // Boolean (toggle) colors
  booleanBg: "#333",
  booleanSelectedBg: "hsl(160, 100%, 70%)",
});
