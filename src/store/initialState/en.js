import { Locales } from '../../constants/locales';
import getLocalPosts from './getLocalPosts';
import getLocalCategories from './getLocalCategories';
import chart from './chart';

const initialState = {
  categories: getLocalCategories(Locales.EN),
  tags: {
    0: 'javascript',
    1: 'd3.js',
    2: 'OpenCV',
    3: 'processing',
    4: 'openNI',
    5: 'Kinect',
    6: 'WebGL',
  },
  entries: getLocalPosts(Locales.EN),
  hello: {
    title: 'Dorian Ratovo',
    text: 'Front End developer',
    contact: 'Contact me',
    about: 'Nice to meet you!',
    bulle: 'See more',
    description: [
      'After graphic design studies, i was impressed by web possibilities and start to learn on my own.',
      'Javascript became my perfect tool to experiment especially 2D and 3D web api.',
      'I worked at different companies to confront my knowledges with professional needs and continue to experiment on personal projects.',
    ],
  },
  cv: {
    formation: {
      text: 'Education',
      items: [
        {
          date: 2022,
          text: 'Learning Japanese at Linguage Japanese Language School in Shinjuku, Tokyo',
        },
        {
          date: 2013,
          text: 'National degree on plastic expression with mention at Saint-Etienne fine art school',
        },
        {
          date: 2013,
          text: 'Exhibition at Saint-Etienne international design biennial with barasson project',
        },
        {
          date: 2012,
          text: 'Semester at Halle Burg Giebichenstein art school in Germany on multimedia /virtual reality departement',
        },
        {
          date: 2011,
          text: 'National degree on applied arts with mention at Saint-Etienne fine art school',
        },
        {
          date: 2009,
          text: 'Graduate on graphic design section at Lisaa Paris, applied arts school',
        },
        {
          date: 2006,
          text: 'Scientific Baccalaureate',
        },
      ],
    },
    jobs: {
      text: 'Jobs',
      items: [
        {
          startDate: 2016,
          endDate: 2022,
          text: 'Front-end developer at Winamax',
          tasks: [
            'betting web application development',
            'fantasy sport web application development',
            'new grids application development',
          ],
        },
        {
          startDate: 2014,
          endDate: 2016,
          text: 'Co-managing director of Pix 21, web design agency',
          tasks: ['websites production', 'visual identities production', 'project management'],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: 'Graphic designer at Reporters without borders',
          tasks: ['interactive maps production', 'edition of association report'],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text: 'Semester at Ideas Lab Atomic Energic Center of Grenoble',
          tasks: [
            'research and design development with inovative technologies',
            'collaborative work with engineers',
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text: 'Internship and missions at Atelier des giboulées, graphic design agency',
          tasks: ['printed design', 'holding client meetings to elaborate projects specifications'],
        },
      ],
    },
    skills: {
      text: 'Skills',
      items: [
        {
          text: 'dev',
          items: [
            { text: 'Javascript', level: '', picto: 'js' },
            { text: 'Nodejs', level: '', picto: 'node' },
            { text: 'React', level: '', picto: 'react' },
            { text: 'Redux', level: '', picto: 'redux' },
            { text: 'HTML5', level: '', picto: 'html' },
            { text: 'CSS3', level: '', picto: 'css' },
            { text: 'd3.js', level: '', picto: 'd3' },
            { text: 'WebGL', level: '', picto: 'webgl' },
            { text: 'Php', level: '', picto: 'php' },
            { text: 'Flow', level: '', picto: 'flow' },
            { text: 'Jest', level: '', picto: 'jest' },
            { text: 'Webpack', level: '', picto: 'webpack' },
          ],
        },
        {
          text: 'image & edition',
          items: [
            { text: 'Photoshop', level: '' },
            { text: 'Illustrator', level: '' },
            { text: 'InDesign', level: '' },
            { text: 'Blender', level: '' },
            { text: 'Inkscape', level: '' },
            { text: 'Gimp', level: '' },
          ],
        },
        {
          text: 'languages',
          items: [
            { text: 'French', level: 'native' },
            { text: 'English', level: 'read and talked' },
            { text: 'Japanese', level: 'JLPT N4, learning N3' },
          ],
        },
      ],
    },
    hobbies: {
      text: 'Interests',
      items: [
        {
          text: 'video game creation',
        },
        {
          text: 'data visualization',
        },
        {
          text: 'japanese culture',
        },
        {
          text: '3d modelisation',
        },
      ],
    },
    chart,
  },
  back: 'Back',
  darkMode: 'dark',
  lightMode: 'light',
  next: 'Next',
  previous: 'Previous',
};

export default initialState;
