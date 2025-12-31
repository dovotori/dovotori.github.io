import type { Locales } from "src/constants/locales";

export type Locale = (typeof Locales)[keyof typeof Locales];

type Labo = { hasJs?: boolean; noBackground?: boolean; hasHtml?: boolean };

type Post = {
  id: number;
  title: string;
  inverseTitle: string;
  slug: string;
  category: number;
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

type Tag = {
  slug: string;
  label: string;
  categoryId: number;
  picto?: string;
};

type Skill = {
  id: number;
  label: string;
  value: number;
  children?: Skill[];
};

export interface MyState {
  categories: Record<
    number,
    {
      slug: string;
      label: string;
    }
  >;
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
