import { Locales } from '../../constants/locales';
import chart from './chart';
import getLocalCategories from './getLocalCategories';
import getLocalPosts from './getLocalPosts';

const initialState = {
  categories: getLocalCategories(Locales.FR),
  entries: getLocalPosts(Locales.FR),
  hello: {
    title: 'Dorian Ratovo',
    text: 'Front End developer',
    contact: 'Contact',
    about: 'Enchanté!',
    bulle: 'Plus de détails',
    description: [
      'Après des études dans le domaine de la conception graphique, je me suis intéressé au développement web en autodidacte.',
      "Le javascript est devenu mon outil favori pour expérimenter ces possibilités notamment la génération d'image via les contextes 2D et 3D de l'api canvas.",
      "J'ai eu plusieurs possibilités d'appliquer ces connaissances en milieu professionnel et je continue à expérimenter.",
    ],
  },
  cv: {
    formation: {
      text: 'Études',
      items: [
        {
          date: 2022,
          text: 'Apprentissage du japonais à la Linguage Japanese Language School à Shinjuku, Tokyo',
        },
        {
          date: 2013,
          text: 'Diplôme national d’expression plastique avec félicitations du jury à l’école supérieure d’art et design de Saint-Étienne section design',
        },
        {
          date: 2013,
          text: 'Exposition lors de la biennale internationale du design de Saint-Étienne avec le projet Barasson au Fil',
        },
        {
          date: 2012,
          text: 'Semestre dans le département Multimedia / Réalité virtuelle  de l’école d’art Burg Giebichenstein à Halle en Allemagne ',
        },
        {
          date: 2011,
          text: 'Diplôme national d’arts plastiques avec mention à l’école supérieure d’art et design de Saint-Étienne section design ',
        },
        {
          date: 2009,
          text: 'Diplôme de graphisme / multimédia à LISAA Paris l’institut supérieur des arts appliqués',
        },
        {
          date: 2006,
          text: 'Baccalauréat général série scientifique',
        },
      ],
    },
    jobs: {
      text: 'Experiences',
      items: [
        {
          startDate: 2022,
          endDate: 2025,
          text: 'Développeur Front-end au sein de Scene',
          location: 'Tokyo, Japon',
          tasks: [
            'développement de multiple features 3d pour une application de guide de montage industrielle',
            "implementation de tests end-to-end basés sur la comparaison de pixels pour assurer l'intégrité des données clientes",
          ],
        },
        {
          startDate: 2016,
          endDate: 2022,
          text: 'Développeur Front-end au sein de Winamax',
          location: 'Paris, France',
          tasks: [
            "développement des évolutions de l'application de paris sportifs",
            "développement de l'application le Jeu de l'entraîneur",
            'développement de la nouvelle version des Grilles',
          ],
        },
        {
          startDate: 2014,
          endDate: 2016,
          text: 'Co-gérant de l’entreprise de Web design Pix 21, responsable du design et du développement web',
          location: 'Paris, France',
          tasks: [
            'développement et déploiement de sites internet',
            'conception / mise en page / gestion d’impression de documents de communication',
            'conception de chartes graphiques',
            'gestion et suivi de projet',
          ],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: 'Graphiste au sein de l’association Reporters sans frontières',
          location: 'Paris, France',
          tasks: [
            'réalisation de cartes intéractives en ligne',
            'conception / mise en page de rapports et de documents de communication',
          ],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text: 'Semestre au laboratoire de recherche Ideas Lab au CEA de Grenoble',
          location: 'Grenoble, France',
          tasks: [
            'recherche et prototypages autour de technologies innovantes',
            'travail collaboratif avec des ingénieurs',
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text: 'Stage puis missions au sein de l’atelier des Giboulées, agence  de conseil et création graphique',
          location: 'Paris, France',
          tasks: [
            'conception / mise en page / suivi d’impression de documents de communication',
            "participation à l'élaboration du cahiers des charges avec le client",
          ],
        },
      ],
    },
    skills: {
      text: 'Aptitudes',
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
          text: 'image & édition',
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
          text: 'langues',
          items: [
            { text: 'Anglais', level: 'lu et parlé' },
            { text: 'Japonais', level: 'JLPT N3, étudie le N4' },
          ],
        },
      ],
    },
    hobbies: {
      text: 'Intérêts',
      items: [
        {
          text: 'Création de jeu vidéo',
          about: '/project/game',
        },
        {
          text: 'Culture japonaise',
        },
        {
          text: 'Modélisation et rendu 3d',
          about: '/project/paysage',
        },
        {
          text: 'Datavisualisation',
        },
      ],
    },
    chart,
  },
  back: 'Retour',
  darkMode: 'sombre',
  lightMode: 'clair',
  next: 'Suivant',
  previous: 'Précédent',
};

export default initialState;
