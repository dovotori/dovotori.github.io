import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";

const initialState = {
  categories: {
    [CAT_DESIGN]: "design",
    [CAT_CODE]: "code",
    [CAT_BLOG]: "blog",
  },
  entries: [
    {
      id: 0,
      slug: "netmap",
      title: "Net Map",
      category: CAT_CODE,
      tags: [],
      date: 2014,
      description:
        ["Datavisualisation désignant les différentes institutions ennemies d'Internet\" à travers le monde.", "Projet réalisé au sein de l'association Reporters sans frontières."],
      html: true
    },
    {
      id: 1,
      slug: "religionmap",
      title: "Religion Map",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description: "Datavisualisation désignant les pays qui utilisent la religion comme moyen de censure.",
      html: true
    },
    {
      id: 2,
      slug: "barason",
      title: "Barason",
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Transformation d'un comptoir de bar en séquenceur musicale, dont les sons sont déclenchés par les verres posés sur sa surface.",
      images: 2
    },
    {
      id: 3,
      slug: "camouflage",
      title: "Camouflage",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Proposition pour l'identité d'une exposition fictive sur les arts de rue et le graffiti.",
      images: 4
    },
    {
      id: 4,
      slug: "identite",
      title: "Identité",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description: "Identités visuelles pour différentes marques.",
      images: 14
    },
    {
      id: 5,
      slug: "electro",
      title: "Electro",
      category: CAT_DESIGN,
      tags: [],
      date: 2013,
      description: "Site de l'artiste audiovisuel Alex Augier.",
      images: 2
    },
    {
      id: 6,
      slug: "soap",
      title: "Soap",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Recherche pour l'identité d'une exposition au sein de la Soap Factory, musée d'art contemporain à Mineapolis.",
      images: 3
    },
    {
      id: 7,
      slug: "weiwei",
      title: "Wei Wei",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Animation promotionnelle installée dans les gares parisiennes de l'album de Reporters sans frontières, 100 photos de Ai Weiwei pour la liberté de la presse.",
      images: 2
    },
    {
      id: 8,
      slug: "presse",
      title: "Presse",
      category: CAT_DESIGN,
      tags: [],
      date: 2014,
      description:
        "Différents projets réalisés au sein de l'association Reporters sans frontières.",
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
        "Dispositif de jeu qui a pour ambition d'intégrer n'importe quel objet du quotidien pour influencer un espace virtuel.",
      images: 9
    },
    {
      id: 10,
      slug: "havre",
      title: "Havre",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Élaboration d'une identité visuelle pour la biennale d'art contemporain de la ville du Havre.",
      images: 11
    },
    {
      id: 11,
      slug: "depardon",
      title: "Depardon",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Recherche graphique pour un coffret de reportages de Raymond Depardon, la série sur le monde paysan, destin fragile des travailleurs de la terre.",
      images: 4
    },

    {
      id: 12,
      slug: "game",
      title: "Game",
      category: CAT_CODE,
      tags: [],
      date: 2016,
      description: [
        "Conception d'un simple platformer en 2D avec webgl (toujours en developpement).",
        "Espace pour sauter / X pour attaquer / W pour tirer.",
      ],
      html: true
    },
    {
      id: 13,
      slug: "paysage",
      title: "Paysage",
      category: CAT_CODE,
      tags: [],
      date: 2019,
      description:
        "Chargement et visualisation d'une scène 3d au format gltlf 2.0 en webgl, en suivant les spécifications du Khronos group.",
      html: true
    },
    {
      id: 14,
      slug: "sport",
      title: "Sport",
      category: CAT_CODE,
      tags: [],
      date: 2020,
      description: "Developpement sur l'application de paris sportifs au sein de l'entreprise Winamax.",
      images: 8
    },
    {
      id: 15,
      slug: "japon",
      title: "Japon",
      category: CAT_BLOG,
      tags: [],
      date: 2017,
      description: "Quelques souvenirs du Japon.",
      html: true,
      images: 16
    },
    {
      id: 16,
      slug: "norway",
      title: "Norvege",
      category: CAT_BLOG,
      tags: [],
      date: 2018,
      description: "Quelques souvenirs de Norvège.",
      sources: "",
      html: true,
      images: 18
    },
    {
      id: 17,
      slug: "hongkong",
      title: "Hong Kong",
      category: CAT_BLOG,
      tags: [],
      date: 2019,
      description: "Quelques souvenirs de Hong Kong.",
      sources: "",
      images: 20
    },
    {
      id: 18,
      slug: "budapest",
      title: "Budapest",
      category: CAT_BLOG,
      tags: [],
      date: 2019,
      description: "Quelques souvenirs de Budapest.",
      sources: "",
      images: 13
    }
  ],
  hello: {
    title: "Dorian Ratovo",
    text: "graphiste devenu developpeur web",
    contact: "Contact",
    about: "Enchanté!",
    description: [
      "Après des études dans le domaine de la conception graphique, les possibilités du développement web m'ont amené à me former en autodidacte (avec l'aide de fameuses formations en ligne).",
      "Le javascript est devenu mon outil favori pour expérimenter ces possibilités notamment la génération d'image via les contextes 2D et 3D de l'api canvas.",
      "J'ai eu plusieurs possibilités d'appliquer ces connaissances en milieu professionnel et je continue à expérimenter.",
    ],
  },
  cv: {
    formation: {
      text: "études",
      items: [
        {
          date: 2013,
          text:
            "Diplôme national d’expression plastique avec félicitations du jury  à l’école supérieure d’art et design de Saint-Étienne section design ",
        },
        {
          date: 2013,
          text:
            "Exposition lors de la biennale internationale du design  de Saint-Étienne avec le projet Barasson au Fil ",
        },
        {
          date: 2012,
          text:
            "Semestre dans le département Multimedia / Réalité virtuelle  de l’école d’art Burg Giebichenstein à Halle en Allemagne ",
        },
        {
          date: 2011,
          text:
            "Diplôme national d’arts plastiques avec mention à l’école supérieure d’art et design de Saint-Étienne section design ",
        },
        {
          date: 2009,
          text:
            "Diplôme de graphisme / multimédia à LISAA Paris l’institut supérieur des arts appliqués",
        },
        {
          date: 2006,
          text: "Baccalauréat général série scientifique",
        },
      ],
    },
    jobs: {
      text: "Experiences",
      items: [
        {
          startDate: 0,
          endDate: 0,
          text: "Développeur Front-end au sein de Winamax",
          tasks: [
            "développement des évolutions de l'application de paris sportifs",
            "développement de l'application le jeu de l'entraîneur",
          ]
        },
        {
          startDate: 2014,
          endDate: 2016,
          text:
            "Co-gérant de l’entreprise de Web design Pix 21, responsable du design et du développement web",
          tasks: [
            "développement et déploiement de sites internet",
            "conception / mise en page / gestion d’impression de documents de communication et templates",
            "conception de chartes graphiques",
            "gestion et suivi de projet",
          ],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: "Graphiste au sein de l’association Reporters sans frontières",
          tasks: [
            "réalisation de cartes intéractives en ligne",
            "conception / mise en page de rapports et de documents de communication",
          ],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text:
            "Semestre au laboratoire de recherche Ideas Lab au CEA de Grenoble",
          tasks: [
            "recherche et prototypages autour de technologies innovantes",
            "travail collaboratif avec des ingénieurs",
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text:
            "Stage puis missions au sein de l’atelier des Giboulées, agence  de conseil et création graphique",
          tasks: [
            "conception / mise en page / suivi d’impression de documents de communication",
            "participation à l'élaboration du cahiers des charges avec le client",
          ],
        },
      ],
    },
    skills: {
      text: "Aptitudes",
      items: [
        {
          text: "dev",
          items: [
            { text: "Javascript", level: "", picto: "js" },
            { text: "Nodejs", level: "", picto: "node" },
            { text: "React", level: "", picto: "react" },
            { text: "Redux", level: "", picto: "redux" },
            { text: "HTML5", level: "", picto: "html" },
            { text: "CSS3", level: "", picto: "css" },
            { text: "d3.js", level: "", picto: "d3" },
            { text: "WebGL", level: "", picto: "webgl" },
            { text: "Php", level: "", picto: "php" },
            { text: "Flow", level: "", picto: "flow" },
            { text: "Jest", level: "", picto: "jest" },
            { text: "Webpack", level: "", picto: "webpack" },
          ],
        },
        {
          text: "image & édition",
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
          text: "langues",
          items: [
            { text: "Anglais", level: "lu et parlé" },
            { text: "Japonais", level: "en apprentissage" },
          ],
        },
      ],
    },
    hobbies: {
      text: "Intérêts",
      items: [
        {
          text: "Création de jeu vidéo",
          about: "/project/game"
        },
        {
          text: "Culture japonaise",
        },
        {
          text: "Modélisation et rendu 3d",
          about: "/project/paysage"
        },
        {
          text: "Datavisualisation",
        },
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
  back: "Retour",
  darkMode: "sombre",
  lightMode: "clair",
};

export default initialState;
