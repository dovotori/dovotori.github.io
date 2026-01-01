import type { MyState } from "src/types";
import { Locales } from "../../constants/locales";
import getLocalCategories from "./getLocalCategories";
import getLocalPosts from "./getLocalPosts";
import getLocalSkills from "./getLocalSkills";
import getLocalTags from "./getLocalTags";

const initialState: MyState = {
  categories: getLocalCategories(Locales.EN),
  tags: getLocalTags(Locales.EN),
  entries: getLocalPosts(Locales.EN),
  hello: {
    title: "Dorian Ratovo",
    text: "Front End developer",
    contact: "Contact me",
    about: "Hi!",
    bulle: "See more",
    description: [
      "After graphic design studies, I was impressed by web possibilities and start to learn on my own.",
      "Javascript became my perfect tool to experiment especially 2D and 3D web api.",
      "I worked at different companies to confront my knowledges with professional needs and continue to experiment on personal projects.",
    ],
  },
  cv: {
    formation: {
      text: "Education",
      items: [
        {
          date: 2022,
          text: "Learning Japanese at Linguage Japanese Language School in Shinjuku, Tokyo",
        },
        {
          date: 2013,
          text: "National degree on plastic expression with mention at Saint-Etienne fine art school",
        },
        {
          date: 2013,
          text: "Exhibition at Saint-Etienne international design biennial with barasson project",
        },
        {
          date: 2012,
          text: "Semester at Halle Burg Giebichenstein art school in Germany on multimedia /virtual reality departement",
        },
        {
          date: 2011,
          text: "National degree on applied arts with mention at Saint-Etienne fine art school",
        },
        {
          date: 2009,
          text: "Graduate on graphic design section at Lisaa Paris, applied arts school",
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
          startDate: 2022,
          endDate: 2025,
          text: "Front-end developer at Scene",
          location: "Tokyo, Japan",
          tasks: [
            "developed multiple 3D features for an assembly instructions application",
            "implemented end-to-end testing using pixel comparison to ensure data accuracy",
          ],
        },
        {
          startDate: 2016,
          endDate: 2022,
          text: "Front-end developer at Winamax",
          location: "Paris, France",
          tasks: [
            "betting web application development",
            "fantasy sport web application development",
            "new grids application development",
          ],
        },
        {
          startDate: 2014,
          endDate: 2016,
          text: "Co-managing director of Pix 21, web design agency",
          location: "Paris, France",
          tasks: ["websites production", "visual identities production", "project management"],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: "Graphic designer at Reporters without borders",
          location: "Paris, France",
          tasks: ["interactive maps production", "edition of association report"],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text: "Semester at Ideas Lab Atomic Energic Center of Grenoble",
          location: "Grenoble, France",
          tasks: [
            "research and design development with inovative technologies",
            "collaborative work with engineers",
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text: "Internship and missions at Atelier des giboulées, graphic design agency",
          location: "Paris, France",
          tasks: ["printed design", "holding client meetings to elaborate projects specifications"],
        },
      ],
    },
    skills: getLocalSkills(Locales.EN),
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
          text: "3d modelisation",
        },
      ],
    },
  },
  back: "Back",
  darkMode: "dark",
  lightMode: "light",
  next: "Next",
  previous: "Previous",
};

export default initialState;
