import { Locales } from "../../constants/locales";

export default {
  id: "skills",
  label: {
    [Locales.FR]: "Compétences",
    [Locales.EN]: "Skills",
    [Locales.JP]: "スキル",
  },
  value: 100,
  children: [
    {
      label: {
        [Locales.FR]: "Backend",
        [Locales.EN]: "Backend",
        [Locales.JP]: "バックエンド",
      },
      id: "backend",
      value: 30,
      children: [
        {
          id: "node",
          label: "Node.js",
          value: 40,
        },
        {
          id: "mysql",
          label: "MySQL",
          value: 20,
        },
        {
          id: "postgresql",
          label: "PostgreSQL",
          value: 20,
        },
        {
          id: "trpc",
          label: "tRpc",
          value: 20,
        },
      ],
    },
    {
      id: "frontend",
      label: {
        [Locales.FR]: "Frontend",
        [Locales.EN]: "Frontend",
        [Locales.JP]: "フロントエンド",
      },
      value: 50,
      children: [
        {
          id: "js",
          label: "JavaScript",
          value: 80,
          children: [
            {
              id: "3d",
              label: "3D",
              value: "10",
              children: [
                {
                  id: "webgl",
                  label: "WebGL",
                  value: 33,
                },
                {
                  id: "webgpu",
                  label: "WebGPU",
                  value: 33,
                },
                {
                  id: "babylon",
                  label: "Babylon.js",
                  value: 33,
                },
              ],
            },
            {
              id: "react",
              label: "React",
              value: 20,
            },
            {
              id: "redux",
              label: "Redux",
              value: 10,
            },
            {
              id: "d3",
              label: "d3.js",
              value: 30,
            },
            {
              id: "env",
              label: "Environnement",
              value: 30,
              children: [
                {
                  id: "flow",
                  label: "Flow",
                  value: 14,
                },
                {
                  id: "jest",
                  label: "Jest",
                  value: 15,
                },
                {
                  id: "webpack",
                  label: "Webpack",
                  value: 14,
                },
                {
                  id: "gitlab",
                  label: "Gitlab",
                  value: 14,
                },
                {
                  id: "typescript",
                  label: "TypeScript",
                  value: 14,
                },
                {
                  id: "playwright",
                  label: "Playwright",
                  value: 14,
                },
                {
                  id: "vite",
                  label: "Vite",
                  value: 15,
                },
              ],
            },
          ],
        },
        {
          id: "html",
          label: "HTML5",
          value: 10,
        },
        {
          id: "css",
          label: "CSS3",
          value: 10,
        },
      ],
    },
    {
      id: "design",
      label: {
        [Locales.FR]: "Design",
        [Locales.EN]: "Design",
        [Locales.JP]: "デザイン",
      },
      value: 20,
      children: [
        {
          id: "blender",
          label: "Blender",
          value: 33,
        },
        {
          id: "inkscape",
          label: "Inkscape",
          value: 33,
        },
        {
          id: "figma",
          label: "Figma",
          value: 33,
        },
      ],
    },
    {
      id: "languages",
      label: {
        [Locales.FR]: "Langues",
        [Locales.EN]: "Languages",
        [Locales.JP]: "言語",
      },
      children: [
        {
          id: "french",
          label: {
            [Locales.FR]: "Français",
            [Locales.EN]: "French",
            [Locales.JP]: "フランス語",
          },
          level: {
            [Locales.FR]: "Langue maternelle",
            [Locales.EN]: "Native",
            [Locales.JP]: "母国語",
          },
        },
        {
          id: "english",
          label: {
            [Locales.FR]: "Anglais",
            [Locales.EN]: "English",
            [Locales.JP]: "英語",
          },
          level: {
            [Locales.FR]: "Courant",
            [Locales.EN]: "Fluent",
            [Locales.JP]: "流暢",
          },
        },
        {
          id: "japanese",
          label: {
            [Locales.FR]: "Japonais",
            [Locales.EN]: "Japanese",
            [Locales.JP]: "日本語",
          },
          level: {
            [Locales.FR]: "JLPT N3",
            [Locales.EN]: "JLPT N3",
            [Locales.JP]: "JLPT N3",
          },
        },
      ],
    },
  ],
};
