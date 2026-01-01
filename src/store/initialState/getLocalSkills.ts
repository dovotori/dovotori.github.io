import { Locales } from "../../constants/locales";
import type { Locale, MyState } from "../../types";
import chart from "./chart";

function transformLabels(node, locale) {
  // Create a new object to avoid mutating the original
  const transformed = { ...node };

  // Transform label if it exists and is an object with locale keys
  if (transformed.label && typeof transformed.label === "object") {
    transformed.label = transformed.label[locale] || transformed.label[Locales.EN]; // Fallback to English
  }

  if (transformed.level && typeof transformed.level === "object") {
    transformed.level = transformed.level[locale] || transformed.level[Locales.EN]; // Fallback to English
  }

  // Recursively transform children if they exist
  if (transformed.children && Array.isArray(transformed.children)) {
    transformed.children = transformed.children.map((child) => transformLabels(child, locale));
  }

  return transformed;
}

export default (locale: Locale): MyState["cv"]["skills"] => transformLabels(chart, locale);
