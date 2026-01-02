import type {
  DEVICE_IS_TOUCH,
  SET_CATEGORY,
  SET_LANG,
  TOGGLE_THEME,
} from "src/constants/actionsTypes";
import type { CAT_BLOG, CAT_CODE, CAT_DESIGN } from "src/constants/categories";
import type { Locales } from "src/constants/locales";

export type Locale = (typeof Locales)[keyof typeof Locales];

export type ActionsTypes =
  | typeof DEVICE_IS_TOUCH
  | typeof TOGGLE_THEME
  | typeof SET_LANG
  | typeof SET_CATEGORY;

export type CategoryId = typeof CAT_DESIGN | typeof CAT_CODE | typeof CAT_BLOG;

export type ActionSetTouch = { type: typeof DEVICE_IS_TOUCH; flag: boolean };
export type ActionSetLang = { type: typeof SET_LANG; flag: Locale };
export type ActionSetCategory = { type: typeof SET_CATEGORY; flag: CategoryId };
export type ActionToggleTheme = { type: typeof TOGGLE_THEME };
export type Actions = ActionSetLang | ActionSetCategory | ActionToggleTheme | ActionSetTouch;

export type AppContext = {
  state: MyState;
  dispatch: React.Dispatch<Actions>;
};

type Labo = { hasJs?: boolean; noBackground?: boolean; hasHtml?: boolean };

export type Post = {
  id: number;
  title: string;
  inverseTitle: string;
  slug: string;
  category: CategoryId;
  tags: number[];
  date: number;
  description?: string | string[];
  labo?: Labo;
  images?: number;
  links?: {
    url: string;
    label: string;
  }[];
  isDevOnly?: boolean;
};

export type EntryNav = { category: CategoryId; slug: string; title: string };

export type Tag = {
  slug: string;
  label: string;
  categoryId: CategoryId;
  picto?: string;
};

type Skill = {
  id: number;
  label: string;
  value: number;
  children?: Skill[];
};

export type Category = {
  slug: string;
  label: string;
};

export interface MyContent {
  categories: Record<CategoryId, Category>;
  entries: Post[];
  tags: Record<number, Tag>;
  hello: {
    title: string;
    text: string;
    contact: string;
    about: string;
    bulle: string;
    description: string[];
  };
  cv: {
    formation: {
      text: string;
      items: {
        date: number;
        text: string;
      }[];
    };
    jobs: {
      text: string;
      items: {
        startDate: number;
        endDate: number;
        text: string;
        location: string;
        tasks: string[];
      }[];
    };
    hobbies: {
      text: string;
      items: {
        text: string;
        about?: string;
      }[];
    };
    skills: Skill;
  };
  back: string;
  darkMode: string;
  lightMode: string;
  next: string;
  previous: string;
}

export interface MyDevice {
  isTouch: boolean;
  isDarkMode: boolean;
  category?: CategoryId;
  lang: Locale;
}

export interface MyState {
  device: MyDevice;
  content: MyContent;
}
