import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";
import { Locales } from "../../constants/locales";

const rawPosts = [
  {
    id: 0,
    slug: "netmap",
    title: { [Locales.FR]: "Net Map", [Locales.EN]: "Net Map", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2014,
    description: { [Locales.FR]: 
      ["Datavisualisation désignant les différentes institutions ennemies d'Internet\" à travers le monde.", "Projet réalisé au sein de l'association Reporters sans frontières."], [Locales.EN]: 'Datavisualization showing main institutions labelled as \"Internet enemies\" accross the world.', [Locales.JP]: "" },
    html: true
  },
  {
    id: 1,
    slug: "religionmap",
    title: { [Locales.FR]: "Religion Map", [Locales.EN]: "Religion Map", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2014,
    description: { [Locales.FR]:  
    "Datavisualisation désignant les pays qui utilisent la religion comme moyen de censure.", [Locales.EN]: 'Datavisualization showing countries across the world which use religion as censorship.', [Locales.JP]: "" },
    html: true
  },
  {
    id: 2,
    slug: "barason",
    title: { [Locales.FR]: "Bar à son", [Locales.EN]: "Sound pub", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2013,
    description: { [Locales.FR]: 
      "Transformation d'un comptoir de bar en séquenceur musicale, dont les sons sont déclenchés par les verres posés sur sa surface.", [Locales.EN]: "Interactive bar counter where glasses trigger sound like a music partition.", [Locales.JP]: "" },
    images: 2
  },
  {
    id: 3,
    slug: "camouflage",
    title: { [Locales.FR]: "Camouflage", [Locales.EN]: "Camouflage", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2009,
    description: { [Locales.FR]: 
      "Proposition pour l'identité d'une exposition fictive sur les arts de rue et le graffiti.", [Locales.EN]: "Visual identity for a fictive exhibition about street art.", [Locales.JP]: "" },
    images: 4
  },
  {
    id: 4,
    slug: "identite",
    title: { [Locales.FR]: "Identités visuelles", [Locales.EN]: "Visual identities", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2014,
    description: { [Locales.FR]:  
    "Identités visuelles pour différentes marques.", [Locales.EN]: "Different visual identities", [Locales.JP]: "" },
    images: 14
  },
  {
    id: 5,
    slug: "electro",
    title: { [Locales.FR]: "Electro", [Locales.EN]: "Electro", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2013,
    description: { [Locales.FR]:  
    "Site de l'artiste audiovisuel Alex Augier.", [Locales.EN]: "Audiovisual artist Alex Augier's website.", [Locales.JP]: "" },
    images: 2
  },
  {
    id: 6,
    slug: "soap",
    title: { [Locales.FR]: "Usine à savon", [Locales.EN]: "Soap", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2009,
    description: { [Locales.FR]: 
      "Recherche pour l'identité d'une exposition au sein de la Soap Factory, musée d'art contemporain à Mineapolis.", [Locales.EN]: "Studies for visual identity of an exhibition host by Mineapolis museum 'Soap Factory", [Locales.JP]: "" },
    images: 3
  },
  {
    id: 7,
    slug: "weiwei",
    title: { [Locales.FR]: "Wei Wei", [Locales.EN]: "Wei Wei", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2014,
    description: { [Locales.FR]: 
      "Animation promotionnelle installée dans les gares parisiennes de l'album de Reporters sans frontières, 100 photos de Ai Weiwei pour la liberté de la presse.", [Locales.EN]: "Video displayed on parisian train stations to promote the album of Reporters without borders about the chinese artist Ai Weiwei for press freedom.", [Locales.JP]: "" },
    images: 2
  },
  {
    id: 8,
    slug: "presse",
    title: { [Locales.FR]: "Presse", [Locales.EN]: "Press", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2014,
    description: { [Locales.FR]: 
      "Différents projets réalisés au sein de l'association Reporters sans frontières.", [Locales.EN]: "Differents printed realisations for the association Reporters without borders", [Locales.JP]: "" },
    images: 6,
  },
  {
    id: 9,
    slug: "distraction",
    title: { [Locales.FR]: "Distraction", [Locales.EN]: "Distraction", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2013,
    description: { [Locales.FR]: 
      "Dispositif de jeu qui a pour ambition d'intégrer n'importe quel objet du quotidien pour influencer un espace virtuel.", [Locales.EN]: "Game installation which allow to usual objects to influence a virtual ecosystem.", [Locales.JP]: "" },
    images: 9
  },
  {
    id: 10,
    slug: "havre",
    title: { [Locales.FR]: "Havre", [Locales.EN]: "Le Havre", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2009,
    description: { [Locales.FR]: 
      "Élaboration d'une identité visuelle pour la biennale d'art contemporain de la ville du Havre.", [Locales.EN]: "Visual identity for the city of Le Havre contemporary art biennial.", [Locales.JP]: "" },
    images: 11
  },
  {
    id: 11,
    slug: "depardon",
    title: { [Locales.FR]: "Depardon", [Locales.EN]: "Depardon", [Locales.JP]: "" },
    category: CAT_DESIGN,
    tags: [],
    date: 2009,
    description: { [Locales.FR]: 
      "Recherche graphique pour un coffret de reportages de Raymond Depardon, la série sur le monde paysan, destin fragile des travailleurs de la terre.", [Locales.EN]: "Study for a video package of Raymond Depardon's films related to rural world and farmer's fragile future.", [Locales.JP]: "" },
    images: 4
  },
  {
    id: 12,
    slug: "game",
    title: { [Locales.FR]: "Débuts de jeu", [Locales.EN]: "Work in progress game", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2016,
    description: {
      [Locales.FR]: ["Conception d'un simple platformer en 2D avec webgl (toujours en developpement).", "Espace pour sauter / X pour attaquer / W pour tirer."],
      [Locales.EN]: ["Work in progress on a 2d platformer with webgl.", "Space to jump / X to attack / W to shoot"],
      [Locales.JP]: [""]
    },
    html: true
  },
  {
    id: 13,
    slug: "paysage",
    title: { [Locales.FR]: "Paysage", [Locales.EN]: "Landscape", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2019,
    description: { [Locales.FR]: 
      "Chargement et visualisation d'une scène 3d au format gltf 2.0 en webgl, en suivant les spécifications du Khronos group.", [Locales.EN]: "Parsing and visualization of a scene from gltf file format, following Khronos group specifications.", [Locales.JP]: "" },
    html: true
  },
  {
    id: 14,
    slug: "sport",
    title: { [Locales.FR]: "Sport", [Locales.EN]: "Sport", [Locales.JP]: "" },
    category: CAT_CODE,
    tags: [],
    date: 2020,
    description: { [Locales.FR]:  
    "Developpement sur l'application de paris sportifs au sein de l'entreprise Winamax.", [Locales.EN]: "Work on Winamax betting application.", [Locales.JP]: "" },
    images: 8
  },
  {
    id: 15,
    slug: "japon",
    title: { [Locales.FR]: "Japon", [Locales.EN]: "Japan", [Locales.JP]: "" },
    category: CAT_BLOG,
    tags: [],
    date: 2017,
    description: { [Locales.FR]:  "Quelques souvenirs du Japon.", [Locales.EN]: "Some memories of Japan.", [Locales.JP]: "" },
    html: true,
    images: 16
  },
  {
    id: 16,
    slug: "norway",
    title: { [Locales.FR]: "Norvege", [Locales.EN]: "Norway", [Locales.JP]: "" },
    category: CAT_BLOG,
    tags: [],
    date: 2018,
    description: { [Locales.FR]:  
    "Quelques souvenirs de Norvège.", [Locales.EN]: "Some memories of Norway.", [Locales.JP]: "" },
    sources: "",
    html: true,
    images: 18
  },
  {
    id: 17,
    slug: "hongkong",
    title: { [Locales.FR]: "Hong Kong", [Locales.EN]: "Hong Kong", [Locales.JP]: "" },
    category: CAT_BLOG,
    tags: [],
    date: 2019,
    description: { [Locales.FR]:  
    "Quelques souvenirs de Hong Kong.", [Locales.EN]: "Some memories of Hong Kong.", [Locales.JP]: "" },
    sources: "",
    images: 20
  },
  {
    id: 18,
    slug: "budapest",
    title: { [Locales.FR]: "Budapest", [Locales.EN]: "Budapest", [Locales.JP]: "" },
    category: CAT_BLOG,
    tags: [],
    date: 2019,
    description: { [Locales.FR]:  
    "Quelques souvenirs de Budapest.", [Locales.EN]: "Some memories of Budapest.", [Locales.JP]: "" },
    sources: "",
    images: 13
  }
];

export default locale => {
  return rawPosts.map(post => {
    return {
      ...post,
      title: post.title[locale],
      description: post.description[locale]
    }
  });
}