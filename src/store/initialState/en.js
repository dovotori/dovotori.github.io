import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";

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
  entries: [
    {
      id: 0,
      slug: 'netmap',
      title: 'Net Map',
      category: CAT_CODE,
      tags: [],
      date: 2014,
      description: 'Datavisualization showing main institutions labelled as \"Internet enemies\" accross the world.',
      sources: '',
      context: '',
      images: 1,
    },
    {
      id: 1,
      slug: 'religionmap',
      title: 'Religion Map',
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        'Datavisualization showing countries across the world which use religion as censorship.',
      sources: '',
      context: '',
    },
    {
      id: 2,
      slug: "barason",
      title: "Barason",
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Interactive bar counter where glasses trigger sound like a music partition.",
      sources: "",
      context: "",
      images: 2,
    },
    {
      id: 3,
      slug: "camouflage",
      title: "Camouflage",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Visual identity for a fictive exhibition about street art.",
      sources: "",
      context: "",
      images: 4,
    },
    {
      id: 4,
      slug: "identite",
      title: "Identité",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description: "Different visual identities",
      sources: "",
      context: "",
      images: 14,
    },
    {
      id: 5,
      slug: 'electro',
      title: 'Electro',
      category: CAT_DESIGN,
      tags: [],
      date: 2013,
      description: "Audiovisual artist Alex Augier's Website.",
      sources: '',
      context: '',
    },
    {
      id: 6,
      slug: "soap",
      title: "Soap",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Studies for visual identity of an exhibition host by Mineapolis museum 'Soap Factory'",
      sources: "",
      context: "",
      images: 3,
    },
    {
      id: 7,
      slug: "weiwei",
      title: "Wei Wei",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Video displayed on parisian train stations to promote the album of Reporters without borders about the chinese artist Ai Weiwei for press freedom.",
      sources: "",
      context: "",
      images: 2,
    },
    {
      id: 8,
      slug: "presse",
      title: "Presse",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Differents printed realisations for the association Reporters without borders",
      sources: "",
      context: "",
      images: 6,
    },
    {
      id: 9,
      slug: "distraction",
      title: "Distraction",
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Game installation which allow to usual objects to influence a virtual ecosystem.",
      sources: "",
      context: "",
      images: 9,
    },
    {
      id: 10,
      slug: "havre",
      title: "Havre",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Visual identity for the city of Le Havre contemporary art biennial",
      sources: "",
      context: "",
      images: 11,
    },
    {
      id: 11,
      slug: "depardon",
      title: "Depardon",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Study for a video package of Raymond Depardon's films related to rural world and farmer's fragile future",
      sources: "",
      context: "",
      images: 4,
    },

    {
      id: 12,
      slug: "game",
      title: "Game",
      category: CAT_CODE,
      tags: [],
      date: 2016,
      description: ["Work in progress on a 2d platformer with webgl.", "Space to jump / X to attack / W to shoot"],
      sources: "",
      context: "",
      canvas: true,
    },
    {
      id: 13,
      slug: "paysage",
      title: "Paysage",
      category: CAT_CODE,
      tags: [],
      date: 2019,
      description: "Parsing and visualization of a scene from gltf file format, following Khronos group specifications.",
      sources: "",
      context: "",
      canvas: true,
    },
    // {
    //   id: 12,
    //   slug: 'amour',
    //   title: 'Amour',
    //   category: CAT_CODE,
    //   tags: [],
    //   date: 1,
    //   description: 'Site HappyLovers',
    //   sources: '',
    //   context: '',
    // },
    {
      id: 14,
      slug: "sport",
      title: "Sport",
      category: CAT_CODE,
      tags: [],
      date: 2020,
      description:
        "Work on Winamax betting application.",
      sources: "",
    },
  ],
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
