import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";

const initialState = {
  categories: {
    [CAT_DESIGN]: "設計",
    [CAT_CODE]: "コード",
    [CAT_BLOG]: "ブログ",
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
    // {
    //   id: 0,
    //   slug: 'netmap',
    //   title: 'Net Map',
    //   category: CAT_CODE,
    //   tags: [],
    //   date: 2014,
    //   description:
    //     'Datavisualisation désignant les différentes institutions
    // ennemies d\'Internet" à travers le monde. Projet réalisé au sein de
    // l\'association Reporters sans frontières sous la direction artistique
    // de Pierre-Alain Leboucher.',
    //   sources: '',
    //   context: '',
    //   images: 1,
    // },
    // {
    //   id: 1,
    //   slug: 'religionmap',
    //   title: 'Religion Map',
    //   category: CAT_DESIGN,
    //   tags: [],
    //   date: 2014,
    //   description:
    //     'Datavisualisation désignant les pays qui utilisent la religion comme moyen de censure.',
    //   sources: '',
    //   context: '',
    // },
    {
      id: 2,
      slug: "barason",
      title: "Barason",
      category: CAT_CODE,
      tags: [],
      date: 2013,
      description:
        "Transformation d'un comptoir de bar en séquenceur musicale, dont les sons sont déclenchés par les verres posés sur sa surface.",
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
        "Proposition pour l'identité d'une exposition fictive sur les arts de rue et le graffiti.",
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
      description: "Identités visuelles pour différentes marques.",
      sources: "",
      context: "",
      images: 14,
    },
    // {
    //   id: 5,
    //   slug: 'electro',
    //   title: 'Electro',
    //   category: CAT_DESIGN,
    //   tags: [],
    //   date: 2013,
    //   description: "Site de l'artiste audiovisuel Alex Augier.",
    //   sources: '',
    //   context: '',
    // },
    {
      id: 6,
      slug: "soap",
      title: "Soap",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Recherche pour l'identité d'une exposition au sein de la Soap Factory, musée d'art contemporain à Mineapolis.",
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
        "Animation promotionnelle installée dans les gares parisiennes de l'album de Reporters sans frontières, 100 photos de Ai Weiwei pour la liberté de la presse.",
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
        "Différents projets réalisés au sein de l'association Reporters sans frontières.",
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
        "Dispositif de jeu qui a pour ambition d'intégrer n'importe quel objet du quotidien pour influencer un espace virtuel.",
      sources: "",
      context: "",
      images: 9,
    },
    {
      id: 10,
      slug: "havre",
      title: "ルアーブル",
      category: CAT_DESIGN,
      tags: [],
      date: 2009,
      description:
        "Élaboration d'une identité visuelle pour la biennale d'art contemporain de la ville du Havre.",
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
        "Recherche graphique pour un coffret de reportages de Raymond Depardon, la série sur le monde paysan, destin fragile des travailleurs de la terre.",
      sources: "",
      context: "",
      images: 4,
    },

    {
      id: 12,
      slug: "games",
      title: "ゲーム",
      category: CAT_CODE,
      tags: [],
      date: 2016,
      description: "Conception d'un simple platformer en webgl",
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
      date: 2016,
      description: "Parser et visualisation d'un objet 3d au format obj",
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
  ],
  hello: {
    title: "今日は",
    text: "私は　ドリアンです，デヴェロップ　と　グラフィックデザイナーです",
  },
  cv: {
    formation: {
      text: "Formation",
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
      text: "Parcours",
      items: [
        {
          start_date: 0,
          end_date: 0,
          text: "Développeur Front-end au sein de Winamax",
          tasks: [""],
        },
        {
          start_date: 2014,
          end_date: 2016,
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
          start_date: 2013,
          end_date: 2014,
          text: "Graphiste au sein de l’association Reporters sans frontières",
          tasks: [
            "réalisation de cartes intéractives en ligne",
            "conception / mise en page de rapports et de documents de communication",
          ],
        },
        {
          start_date: 2012,
          end_date: 2012,
          text:
            "Semestre au laboratoire de recherche Ideas Lab au CEA de Grenoble",
          tasks: [
            "recherche et prototypages autour de technologies innovantes",
            "travail collaboratif avec des ingénieurs",
          ],
        },
        {
          start_date: 2009,
          end_date: 2009,
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
            { text: "Javascript / Nodejs", level: "" },
            { text: "React / Redux", level: "" },
            { text: "HTML5 / CSS3", level: "" },
            { text: "d3.js", level: "" },
            { text: "WebGL", level: "" },
            { text: "Php", level: "" },
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
          text: "語",
          items: [
            { text: "フランス語", level: "" },
            { text: "英語", level: "lu et parlé" },
            { text: "日本語", level: "en apprentissage" },
          ],
        },
      ],
    },
    hobbies: {
      text: "Intérêts",
      items: [
        {
          text: "ビデオゲームの作成",
        },
        {
          text: "日本の文化",
        },
      ],
    },
  },
  back: "バック",
  darkMode: "暗い",
  lightMode: "明るい",
};

export default initialState;
