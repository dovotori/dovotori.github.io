import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";
import { Locales } from "../../constants/locales";
import getLocalPosts from "./getLocalPosts";

const initialState = {
  categories: {
    [CAT_DESIGN]: "design",
    [CAT_CODE]: "code",
    [CAT_BLOG]: "blog",
  },
  tags: {
    0: "javascript",
    1: "d3.js",
    2: "OpenCV",
    3: "processing",
    4: "openNI",
    5: "Kinect",
    6: "WebGL",
  },
  entries: getLocalPosts(Locales.EN),
  hello: {
    title: "Dorian Ratovo",
     text: "graphic designer who became developer",
    contact: "Contact me",
    about: "Nice to meet you!",
    description: [
      "After graphic design studies, i was impressed by web possibilities and start to learn on my own.","Javascript became my perfect tool to experiment especially 2D and 3D web api.", "I worked at different companies to confront my knowledges with professional needs but continues to experiment on personal projects."
    ],
  },
  cv: {
    formation: {
      text: "Studies",
      items: [
        {
          date: 2013,
          text:
            "National degree on plastic expression with mention at Saint-Etienne fine art school",
        },
        {
          date: 2013,
          text:
            "Exhibition at Saint-Etienne international design biennial with barasson project",
        },
        {
          date: 2012,
          text:
            "Semester at Halle Burg Giebichenstein art school in Germany on multimedia /virtual reality departement",
        },
        {
          date: 2011,
          text:
            "National degree on applied arts with mention at Saint-Etienne fine art school",
        },
        {
          date: 2009,
          text:
            "Graduate on graphic design section at Lisaa Paris, applied arts school",
        },
        {
          date: 2006,
          text: "Scientific Baccalaureate",
        },
      ],
    },
    jobs: {
      text: "Jobs",
      items: [
        {
          startDate: 0,
          endDate: 0,
          text: "Front-end developer at Winamax",
          tasks: ["betting web application development", "fantasy sport web application development"],
        },
        {
          startDate: 2014,
          endDate: 2016,
          text:
            "Co-managing director of Pix 21, web design agency",
          tasks: [
            "websites production",
            "visual identities production",
            "project management",
          ],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: "Graphic designer at Reporters without borders",
          tasks: [
            "interactive maps production",
            "edition of association report",
          ],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text:
            "Semestre au laboratoire de recherche Ideas Lab au CEA de Grenoble",
          tasks: [
            "research and design development with inovative technologies",
            "collaborative work with engineers",
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text:
            "Internship and missions at Atelier des giboulées, graphic design agency",
          tasks: [
            "printed design",
            "holding client meetings to elaborate projects specifications",
          ],
        },
      ],
    },
    skills: {
      text: "Skills",
      items: [
        {
          text: "dev",
          items: [
            { text: "Javascript / Nodejs", level: "" },
            { text: "React / Redux", level: "" },
            { text: "HTML5 / CSS3", level: "" },
            { text: "d3.js", level: "" },
            { text: "WebGL", level: "" },
            { text: "Php", level: "" },
          ],
        },
        {
          text: "image & edition",
          items: [
            { text: "Photoshop", level: "" },
            { text: "Illustrator", level: "" },
            { text: "InDesign", level: "" },
            { text: "Blender", level: "" },
            { text: "Inkscape", level: "" },
            { text: "Gimp", level: "" },
          ],
        },
        {
          text: "languages",
          items: [
            { text: "English", level: "lu et parlé" },
            { text: "Japanes", level: "learning" },
          ],
        },
      ],
    },
    hobbies: {
      text: "Interests",
      items: [
        {
          text: "video game creation",
        },
        {
          text: "data visualization",
        },
        {
          text: "japanese culture",
        },
        {
          text: "3d modelisation"
        }
      ],
    },
    chart: {
      name: "skills",
      value: 100,
      children: [
        {
          name: "dev",
          value: 50,
          children: [
            {
              name: "php",
              value: 10,
            },
            {
              name: "js",
              value: 70,
              children: [
                {
                  name: "node",
                  value: 10,
                },
                {
                  name: "react",
                  value: 20,
                },
                {
                  name: "redux",
                  value: 20,
                },
                {
                  name: "webgl",
                  value: 10,
                },
                {
                  name: "d3",
                  value: 10,
                },
                {
                  name: "env",
                  value: 30,
                  children: [
                    {
                      name: "flow",
                      value: 30,
                    },
                    {
                      name: "jest",
                      value: 30,
                    },
                    {
                      name: "webpack",
                      value: 20,
                    },
                    {
                      name: "gitlab",
                      value: 20,
                    },
                  ],
                },
              ],
            },
            {
              name: "html",
              value: 10,
            },
            {
              name: "css",
              value: 10,
            },
          ],
        },
        {
          name: "design",
          value: 50,
          children: [
            {
              name: "blender",
              value: 50,
            },
            {
              name: "inkscape",
              value: 50,
            },
          ],
        },
      ],
    },
  },
  back: "Back",
  darkMode: "dark",
  lightMode: "light",
};

export default initialState;
