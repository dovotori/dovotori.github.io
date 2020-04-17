import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from '../../constants/categories';

const initialState = {
  categories: {
    [CAT_DESIGN]: 'design',
    [CAT_CODE]: 'code',
    [CAT_BLOG]: 'blog',
  },
  tags: {
    0: 'javascript',
    1: 'd3.js',
    2: 'OpenCV',
    3: 'processing',
    4: 'openNI',
    5: 'Kinect',
    6: 'WebGL',
  },
  entries: [
    {
      id: 0,
      slug: 'netmap',
      title: 'Net Map',
      category: CAT_CODE,
      tags: [],
      date: 2014,
      description:
        'Datavisualisation désignant les différentes institutions ennemies d\'Internet" à travers le monde. Projet réalisé au sein de l\'association Reporters sans frontières',
      html: true
    },
    {
      id: 1,
      slug: 'religionmap',
      title: 'Religion Map',
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        'Datavisualisation désignant les pays qui utilisent la religion comme moyen de censure.',
      sources: [{ path: '/public/data/religionmap/data.json', name: 'data', type: 'json' }],
      html: true
    },
    {
      id: 2,
      slug: 'barason',
      title: 'Barason',
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Transformation d'un comptoir de bar en séquenceur musicale, dont les sons sont déclenchés par les verres posés sur sa surface.",
      sources: '',
      images: 2,
    },
    {
      id: 3,
      slug: 'camouflage',
      title: 'Camouflage',
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Proposition pour l'identité d'une exposition fictive sur les arts de rue et le graffiti.",
      sources: '',
      images: 4,
    },
    {
      id: 4,
      slug: 'identite',
      title: 'Identité',
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description: 'Identités visuelles pour différentes marques.',
      sources: '',
      images: 14,
    },
    {
      id: 5,
      slug: 'electro',
      title: 'Electro',
      category: CAT_DESIGN,
      tags: [],
      date: 2013,
      description: "Site de l'artiste audiovisuel Alex Augier.",
      sources: '',
      images: 2,
    },
    {
      id: 6,
      slug: 'soap',
      title: 'Soap',
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Recherche pour l'identité d'une exposition au sein de la Soap Factory, musée d'art contemporain à Mineapolis.",
      sources: '',
      images: 3,
    },
    {
      id: 7,
      slug: 'weiwei',
      title: 'Wei Wei',
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Animation promotionnelle installée dans les gares parisiennes de l'album de Reporters sans frontières, 100 photos de Ai Weiwei pour la liberté de la presse.",
      sources: '',
      images: 2,
    },
    {
      id: 8,
      slug: 'presse',
      title: 'Presse',
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Différents projets réalisés au sein de l'association Reporters sans frontières.",
      sources: '',
      images: 6,
    },
    {
      id: 9,
      slug: 'distraction',
      title: 'Distraction',
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Dispositif de jeu qui a pour ambition d'intégrer n'importe quel objet du quotidien pour influencer un espace virtuel.",
      sources: '',
      images: 9,
    },
    {
      id: 10,
      slug: 'havre',
      title: 'Havre',
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Élaboration d'une identité visuelle pour la biennale d'art contemporain de la ville du Havre.",
      sources: '',
      images: 11,
    },
    {
      id: 11,
      slug: 'depardon',
      title: 'Depardon',
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        'Recherche graphique pour un coffret de reportages de Raymond Depardon, la série sur le monde paysan, destin fragile des travailleurs de la terre.',
      sources: '',
      images: 4,
    },

    {
      id: 12,
      slug: 'game',
      title: 'Game',
      category: CAT_CODE,
      tags: [],
      date: 2016,
      description: "Conception d'un simple platformer en webgl",
      sources: '',
      canvas: true,
    },
    {
      id: 13,
      slug: 'paysage',
      title: 'Paysage',
      category: CAT_CODE,
      tags: [],
      date: 2016,
      description: "Parser et visualisation d'un objet 3d au format obj",
      sources: '',
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
    // },
  ],
  hello: {
    title: 'Hi!',
    text: 'Je suis Dorian Ratovo, graphiste devenu developpeur web.',
    contact: 'contact me',
    about: 'A propos',
  },
  cv: {
    formation: {
      text: 'Education',
      items: [
        {
          date: 2013,
          text:
            'Diplôme national d’expression plastique avec félicitations du jury  à l’école supérieure d’art et design de Saint-Étienne section design ',
        },
        {
          date: 2013,
          text:
            'Exposition lors de la biennale internationale du design  de Saint-Étienne avec le projet Barasson au Fil ',
        },
        {
          date: 2012,
          text:
            'Semestre dans le département Multimedia / Réalité virtuelle  de l’école d’art Burg Giebichenstein à Halle en Allemagne ',
        },
        {
          date: 2011,
          text:
            'Diplôme national d’arts plastiques avec mention à l’école supérieure d’art et design de Saint-Étienne section design ',
        },
        {
          date: 2009,
          text:
            'Diplôme de graphisme / multimédia à LISAA Paris l’institut supérieur des arts appliqués',
        },
        {
          date: 2006,
          text: 'Baccalauréat général série scientifique',
        },
      ],
    },
    jobs: {
      text: 'Experience',
      items: [
        {
          start_date: 0,
          end_date: 0,
          text: 'Développeur Front-end au sein de Winamax',
          tasks: [''],
        },
        {
          start_date: 2014,
          end_date: 2016,
          text:
            'Co-gérant de l’entreprise de Web design Pix 21, responsable du design et du développement web',
          tasks: [
            'développement et déploiement de sites internet',
            'conception / mise en page / gestion d’impression de documents de communication et templates',
            'conception de chartes graphiques',
            'gestion et suivi de projet',
          ],
        },
        {
          start_date: 2013,
          end_date: 2014,
          text: 'Graphiste au sein de l’association Reporters sans frontières',
          tasks: [
            'réalisation de cartes intéractives en ligne',
            'conception / mise en page de rapports et de documents de communication',
          ],
        },
        {
          start_date: 2012,
          end_date: 2012,
          text:
            'Semestre au laboratoire de recherche Ideas Lab au CEA de Grenoble',
          tasks: [
            'recherche et prototypages autour de technologies innovantes',
            'travail collaboratif avec des ingénieurs',
          ],
        },
        {
          start_date: 2009,
          end_date: 2009,
          text:
            'Stage puis missions au sein de l’atelier des Giboulées, agence  de conseil et création graphique',
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
            { text: 'Webpack', level: '', picto: 'webpack' }
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
            { text: 'Japonais', level: 'en apprentissage' },
          ],
        },
      ],
    },
    hobbies: {
      text: 'Intérêts',
      items: [
        {
          text: 'création de jeu vidéo',
        },
        {
          text: 'la culture japonaise',
        },
      ],
    },
    chart: {
      name: 'skills',
      value: 100,
      children: [
        {
          name: 'dev',
          value: 50,
          children: [
            {
              name: 'php',
              value: 10
            },
            {
              name: 'js',
              value: 70,
              children: [
                {
                  name: 'node',
                  value: 10
                },
                {
                  name: 'react',
                  value: 20
                },
                {
                  name: 'redux',
                  value: 20
                },
                {
                  name: 'webgl',
                  value: 10
                },
                {
                  name: 'd3',
                  value: 10
                },
                {
                  name: 'env',
                  value: 30,
                  children: [
                    {
                      name: 'flow',
                      value: 30
                    },
                    {
                      name: 'jest',
                      value: 30
                    },
                    {
                      name: 'webpack',
                      value: 20
                    },
                    {
                      name: 'gitlab',
                      value: 20
                    }
                  ]
                }
              ]
            },
            {
              name: 'html',
              value: 10
            },
            {
              name: 'css',
              value: 10
            }
          ]
        },
        {
          name: 'design',
          value: 50,
          children: [
            {
              name: 'blender',
              value: 50
            },
            {
              name: 'inkscape',
              value: 50
            }
          ]
        }
      ]
    },
  },
  back: 'Retour',
  darkMode: 'sombre',
  lightMode: 'clair',
};

export default initialState;
