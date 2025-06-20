import { CAT_BLOG, CAT_CODE, CAT_DESIGN } from '../../constants/categories';
import { Locales } from '../../constants/locales';
import * as Tags from '../../constants/tags';

const rawPosts = [
  {
    id: 0,
    slug: 'netmap',
    title: {
      [Locales.FR]: 'Net Map',
      [Locales.EN]: 'Net Map',
      [Locales.JP]: 'ネットマップ',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_JS, Tags.TAG_D3, Tags.TAG_SVG],
    date: 2014,
    description: {
      [Locales.FR]: [
        'Datavisualisation désignant les différentes institutions "ennemis d\'Internet" à travers le monde.',
        "Projet réalisé au sein de l'association Reporters sans frontières.",
      ],
      [Locales.EN]:
        'Datavisualization showing main institutions labelled as "Internet enemies" accross the world.',
      [Locales.JP]: [
        'データ可視化が世界中「インターネットの敵の国」を見せる.',
        'このプロジェクトはReporters without borders協会で作りました。',
      ],
    },
    labo: {
      hasHtml: true,
      noBackground: true,
    },
  },
  {
    id: 1,
    slug: 'religionmap',
    title: {
      [Locales.FR]: 'Religion Map',
      [Locales.EN]: 'Religion Map',
      [Locales.JP]: '宗教地図',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_JS, Tags.TAG_D3, Tags.TAG_SVG],
    date: 2014,
    description: {
      [Locales.FR]:
        'Datavisualisation désignant les pays qui utilisent la religion comme moyen de censure.',
      [Locales.EN]:
        'Datavisualization showing countries across the world which use religion as censorship.',
      [Locales.JP]: '見せた国は宗教を検閲として使用しています。',
    },
    labo: {
      hasJs: true,
      hasHtml: true,
      noBackground: true,
    },
  },
  {
    id: 2,
    slug: 'barason',
    title: {
      [Locales.FR]: 'Bar à son',
      [Locales.EN]: 'Sound pub',
      [Locales.JP]: 'バラソン',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_PROCESSING, Tags.TAG_KINECT],
    date: 2013,
    description: {
      [Locales.FR]:
        "Transformation d'un comptoir de bar en séquenceur musicale, dont les sons sont déclenchés par les verres posés sur sa surface.",
      [Locales.EN]: 'Interactive bar counter where glasses trigger sound like a music partition.',
      [Locales.JP]:
        'カウンターがミュージカルシーケンサーと化した。 その上に置かれたグラスは音を生み出す。',
    },
    images: 2,
  },
  {
    id: 3,
    slug: 'camouflage',
    title: {
      [Locales.FR]: 'Camouflage',
      [Locales.EN]: 'Camouflage',
      [Locales.JP]: '迷彩',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP],
    date: 2009,
    description: {
      [Locales.FR]:
        "Proposition pour l'identité d'une exposition fictive sur les arts de rue et le graffiti.",
      [Locales.EN]: 'Visual identity for a fictive exhibition about street art.',
      [Locales.JP]: '発起は落書きとストリートアートの展示会のビジュアルアイデンティティです。',
    },
    images: 4,
  },
  {
    id: 4,
    slug: 'identite',
    title: {
      [Locales.FR]: 'Identités visuelles',
      [Locales.EN]: 'Visual identities',
      [Locales.JP]: 'アイデンティティ',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP],
    date: 2014,
    description: {
      [Locales.FR]: 'Identités visuelles pour différentes marques.',
      [Locales.EN]: 'Different visual identities',
      [Locales.JP]: 'ブランドのビジュアルアイデンティティ。',
    },
    images: 14,
  },
  {
    id: 5,
    slug: 'electro',
    title: {
      [Locales.FR]: 'Electro',
      [Locales.EN]: 'Electro',
      [Locales.JP]: 'エレクトロ',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_WORDPRESS, Tags.TAG_PHP, Tags.TAG_JS, Tags.TAG_HTML, Tags.TAG_CSS],
    date: 2013,
    description: {
      [Locales.FR]: "Site de l'artiste audiovisuel Alex Augier.",
      [Locales.EN]: "Audiovisual artist Alex Augier's website.",
      [Locales.JP]: '視聴覚の美術家のサイトAlex Augier。',
    },
    links: [
      {
        url: 'https://www.alexaugier.com',
        label: {
          [Locales.FR]: 'site',
          [Locales.EN]: 'site',
          [Locales.JP]: 'ウエブサイト',
        },
      },
    ],
    images: 2,
  },
  {
    id: 6,
    slug: 'soap',
    title: {
      [Locales.FR]: 'Usine à savon',
      [Locales.EN]: 'Soap',
      [Locales.JP]: 'ソープ',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP, Tags.TAG_SVG],
    date: 2009,
    description: {
      [Locales.FR]:
        "Recherche pour l'identité d'une exposition au sein de la Soap Factory, musée d'art contemporain à Mineapolis.",
      [Locales.EN]:
        "Studies for visual identity of an exhibition host by Mineapolis museum 'Soap Factory",
      [Locales.JP]:
        '発起は現代美術館のSoap Factoryの展示会のビジュアルアイデンティティです。ミネアポリスにあります。',
    },
    images: 3,
  },
  {
    id: 7,
    slug: 'weiwei',
    title: {
      [Locales.FR]: 'Wei Wei',
      [Locales.EN]: 'Wei Wei',
      [Locales.JP]: 'ウェイウェイ',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP],
    date: 2014,
    description: {
      [Locales.FR]:
        "Animation promotionnelle installée dans les gares parisiennes de l'album de Reporters sans frontières, 100 photos de Ai Weiwei pour la liberté de la presse.",
      [Locales.EN]:
        'Video displayed on parisian train stations to promote the album of Reporters without borders about the chinese artist Ai Weiwei for press freedom.',
      [Locales.JP]:
        '商業アニメーションはプレスの自由のために100枚の写真のアイウェイウェイのアルバムを広めました。 パリのステーション中置かれました。',
    },
    images: 2,
  },
  {
    id: 8,
    slug: 'presse',
    title: {
      [Locales.FR]: 'Presse',
      [Locales.EN]: 'Press',
      [Locales.JP]: 'プレス',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP],
    date: 2014,
    description: {
      [Locales.FR]:
        "Différents projets réalisés au sein de l'association Reporters sans frontières.",
      [Locales.EN]: 'Differents printed realisations for the association Reporters without borders',
      [Locales.JP]: 'Reporters without bordersのための幾つかのプロジェクト。',
    },
    images: 6,
  },
  {
    id: 9,
    slug: 'distraction',
    title: {
      [Locales.FR]: 'Distraction',
      [Locales.EN]: 'Distraction',
      [Locales.JP]: '歓楽',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_KINECT, Tags.TAG_PROCESSING, Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP],
    date: 2013,
    description: {
      [Locales.FR]:
        "Dispositif de jeu qui a pour ambition d'intégrer n'importe quel objet du quotidien pour influencer un espace virtuel.",
      [Locales.EN]:
        'Game installation which allow to usual objects to influence a virtual ecosystem.',
      [Locales.JP]: '此のゲーム機は仮想空間を影響するのためどれかの日常品を統合する。',
    },
    images: 9,
  },
  {
    id: 10,
    slug: 'havre',
    title: {
      [Locales.FR]: 'Havre',
      [Locales.EN]: 'Le Havre',
      [Locales.JP]: 'ルアーブル',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP, Tags.TAG_PHOTO],
    date: 2009,
    description: {
      [Locales.FR]:
        "Élaboration d'une identité visuelle pour la biennale d'art contemporain de la ville du Havre.",
      [Locales.EN]: 'Visual identity for the city of Le Havre contemporary art biennial.',
      [Locales.JP]: 'これは現代美術展のルアーブルために作ったビジュアルアイデンティティ。',
    },
    images: 11,
  },
  {
    id: 11,
    slug: 'depardon',
    title: {
      [Locales.FR]: 'Depardon',
      [Locales.EN]: 'Depardon',
      [Locales.JP]: 'デパルドン',
    },
    category: CAT_DESIGN,
    tags: [Tags.TAG_INDESIGN, Tags.TAG_PHOTOSHOP, Tags.TAG_PHOTO],
    date: 2009,
    description: {
      [Locales.FR]:
        'Recherche graphique pour un coffret de reportages de Raymond Depardon, sa série sur le monde paysan et le destin incertain des travailleurs de la terre.',
      [Locales.EN]:
        "Study for a video package of Raymond Depardon's films related to rural world and farmer's fragile future.",
      [Locales.JP]:
        'DVDボックスのドキュメンタリーのデパルドンのグラフィックリサーチ。農民の世界に関するドキュメンタリーです。',
    },
    images: 4,
  },
  {
    id: 12,
    slug: 'game',
    title: {
      [Locales.FR]: 'Jeu',
      [Locales.EN]: 'Game',
      [Locales.JP]: 'ゲーム',
    },
    category: CAT_CODE,
    tags: [
      Tags.TAG_JS,
      Tags.TAG_WEBGL,
      Tags.TAG_GLSL,
      Tags.TAG_CONTEXT_2D,
      Tags.TAG_INKSCAPE,
      Tags.TAG_EXPERIMENTAL,
    ],
    date: 2016,
    description: {
      [Locales.FR]: [
        "Conception d'un simple platformer en 2D avec webgl (toujours en developpement).",
        'Espace pour sauter / X pour attaquer / W pour tirer.',
      ],
      [Locales.EN]: [
        'Work in progress on a 2d platformer with webgl.',
        'Space to jump / X to attack / W to shoot',
      ],
      [Locales.JP]: ['プラットフォーマーをwebglで作りました。'],
    },
    labo: {
      hasJs: true,
      hasHtml: true,
    },
  },
  {
    id: 13,
    slug: 'paysage',
    title: {
      [Locales.FR]: 'Paysage',
      [Locales.EN]: 'Landscape',
      [Locales.JP]: '景色',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_WEBGL, Tags.TAG_GLSL, Tags.TAG_BLENDER, Tags.TAG_GLTF, Tags.TAG_EXPERIMENTAL],
    date: 2019,
    description: {
      [Locales.FR]:
        "Chargement et visualisation d'une scène 3d au format gltf 2.0 en webgl, en suivant les spécifications du Khronos group.",
      [Locales.EN]:
        'Parsing and visualization of a scene from gltf file format, following Khronos group specifications.',
      [Locales.JP]: 'gltf 2.0のフォーマット3Dビューのローディングと視覚化をwebglで作る。',
    },
    labo: {
      hasJs: true,
    },
  },
  {
    id: 14,
    slug: 'sport',
    title: {
      [Locales.FR]: 'Sport',
      [Locales.EN]: 'Sport',
      [Locales.JP]: 'スポーツ',
    },
    category: CAT_CODE,
    tags: [
      Tags.TAG_REACT,
      Tags.TAG_REDUX,
      Tags.TAG_GIT,
      Tags.TAG_JEST,
      Tags.TAG_REACT_TESTING,
      Tags.TAG_WEBPACK,
      Tags.TAG_FLOW,
      Tags.TAG_ESLINT,
      Tags.TAG_AGILE,
      Tags.TAG_KANBAN,
      Tags.TAG_NODE,
      Tags.TAG_STORYBOOK,
      Tags.TAG_SPINE,
      Tags.TAG_STYLED_COMPONENTS,
    ],
    date: 2020,
    description: {
      [Locales.FR]:
        "Developpement sur l'application de paris sportifs au sein de l'entreprise Winamax.",
      [Locales.EN]: [
        'Worked on Winamax sports betting application.',
        'Implemented unit and integration tests.',
        'Developed components and associated documentation on an isolated environment with Storybook.',
        'Collaborated with designers and illustrators to implement UI/UX details.',
      ],
      [Locales.JP]: 'ギャンブルのスポーツをWinamax会社で開発しました。',
    },
    links: [
      {
        url: 'https://winamax.fr/paris-sportifs',
        label: {
          [Locales.FR]: 'site',
          [Locales.EN]: 'site',
          [Locales.JP]: 'ウエブサイト',
        },
      },
    ],
    images: 11,
  },
  {
    id: 15,
    slug: 'japon',
    title: {
      [Locales.FR]: 'Japon',
      [Locales.EN]: 'Japan',
      [Locales.JP]: '日本',
    },
    category: CAT_BLOG,
    tags: [Tags.TAG_TRAVEL, Tags.TAG_PHOTO, Tags.TAG_OL],
    date: 2017,
    description: {
      [Locales.FR]: 'Quelques souvenirs du Japon.',
      [Locales.EN]: 'Some memories of Japan.',
      [Locales.JP]: '日本の思い出。',
    },
    labo: {
      hasJs: true,
    },
    images: 15,
  },
  {
    id: 16,
    slug: 'norway',
    title: {
      [Locales.FR]: 'Norvege',
      [Locales.EN]: 'Norway',
      [Locales.JP]: 'ノルウェー',
    },
    category: CAT_BLOG,
    tags: [Tags.TAG_TRAVEL, Tags.TAG_PHOTO, Tags.TAG_OL],
    date: 2018,
    description: {
      [Locales.FR]: 'Quelques souvenirs de Norvège.',
      [Locales.EN]: 'Some memories of Norway.',
      [Locales.JP]: 'ノルウェーの思い出。',
    },
    labo: {
      hasJs: true,
    },
    images: 16,
  },
  {
    id: 17,
    slug: 'hongkong',
    title: { [Locales.FR]: 'Hong Kong', [Locales.EN]: 'Hong Kong', [Locales.JP]: '香港' },
    category: CAT_BLOG,
    tags: [Tags.TAG_TRAVEL, Tags.TAG_PHOTO],
    date: 2019,
    description: {
      [Locales.FR]: 'Quelques souvenirs de Hong Kong.',
      [Locales.EN]: 'Some memories of Hong Kong.',
      [Locales.JP]: '香港 の 思い出。',
    },
    sources: '',
    images: 19,
  },
  {
    id: 18,
    slug: 'budapest',
    title: { [Locales.FR]: 'Budapest', [Locales.EN]: 'Budapest', [Locales.JP]: 'ブダペスト' },
    category: CAT_BLOG,
    tags: [Tags.TAG_TRAVEL, Tags.TAG_PHOTO],
    date: 2019,
    description: {
      [Locales.FR]: 'Quelques souvenirs de Budapest.',
      [Locales.EN]: 'Some memories of Budapest.',
      [Locales.JP]: 'ブダペスト の 思い出。',
    },
    sources: '',
    images: 9,
  },
  {
    id: 19,
    slug: 'deform',
    title: {
      [Locales.FR]: 'Déformation',
      [Locales.EN]: 'Deform',
      [Locales.JP]: '歪み',
    },
    category: CAT_CODE,
    tags: [
      Tags.TAG_WEBGL,
      Tags.TAG_GLSL,
      Tags.TAG_CONTEXT_AUDIO,
      Tags.TAG_GLTF,
      Tags.TAG_EXPERIMENTAL,
    ],
    date: 2020,
    description: {
      [Locales.FR]: [
        "Utilisation de l'api AudioContext pour accéder aux fréquences d'un fichier mp3.",
        'Cliquer pour déformer la Terre.',
      ],
      [Locales.EN]: [
        'Use of AudioContext API to access mp3 frequencies.',
        'Click to deform Earth.',
      ],
      [Locales.JP]: [
        'mp3ファイルの周波数にアクセスするためにAPI AudioContextを使用する。',
        '世界を歪曲できるためにクリックして下さい。',
      ],
    },
    labo: {
      hasJs: true,
      hasHtml: true,
    },
  },
  {
    id: 20,
    slug: 'shader',
    title: {
      [Locales.FR]: 'Shader',
      [Locales.EN]: 'Shader',
      [Locales.JP]: 'シェーダー',
    },
    category: CAT_CODE,
    description: {
      [Locales.FR]: ['Différentes expérimentations avec glsl.'],
      [Locales.EN]: ['Different experimentations with glsl.'],
      [Locales.JP]: ['glslをしながら、色々実験'],
    },
    tags: [Tags.TAG_WEBGL, Tags.TAG_GLSL, Tags.TAG_EXPERIMENTAL],
    date: 2020,
    labo: {
      hasJs: true,
      hasHtml: true,
    },
  },
  {
    id: 21,
    slug: 'diorama',
    title: {
      [Locales.FR]: 'Diorama',
      [Locales.EN]: 'Diorama',
      [Locales.JP]: 'ジオラマ',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_WEBGL, Tags.TAG_GLSL, Tags.TAG_BLENDER, Tags.TAG_GLTF, Tags.TAG_EXPERIMENTAL],
    date: 2020,
    labo: {
      hasJs: true,
      noBackground: true,
    },
    images: 3,
  },
  {
    id: 22,
    slug: 'race',
    title: {
      [Locales.FR]: 'Course',
      [Locales.EN]: 'Race',
      [Locales.JP]: 'レース',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_WEBGL, Tags.TAG_GLSL, Tags.TAG_BLENDER, Tags.TAG_GLTF, Tags.TAG_EXPERIMENTAL],
    date: 2020,
    labo: {
      hasJs: true,
    },
  },
  {
    id: 23,
    slug: 'delaunay',
    title: {
      [Locales.FR]: 'Delaunay',
      [Locales.EN]: 'Delaunay',
      [Locales.JP]: 'ドロネー',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_JS, Tags.TAG_CONTEXT_2D, Tags.TAG_SVG, Tags.TAG_EXPERIMENTAL],
    date: 2022,
    labo: {
      hasJs: true,
      hasHtml: true,
      noBackground: true,
    },
  },
  {
    id: 24,
    slug: 'webgpu',
    title: {
      [Locales.FR]: 'Webgpu',
      [Locales.EN]: 'Webgpu',
      [Locales.JP]: 'Webgpu',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_WEBGPU, Tags.TAG_WGSL, Tags.TAG_BLENDER, Tags.TAG_GLTF, Tags.TAG_EXPERIMENTAL],
    description: {
      [Locales.FR]: ['Adaptation de mon petit moteur 3d webgl vers webgpu.'],
      [Locales.EN]: ['Adaptation of my small 3d engine from webgl to webgpu.'],
      [Locales.JP]: ['私の小さな3DエンジンをWebGLからWebGPUに変換しました。'],
    },
    date: 2025,
    labo: {
      hasJs: true,
    },
  },
  {
    id: 25,
    slug: 'repulsor',
    title: {
      [Locales.FR]: 'Repulsor',
      [Locales.EN]: 'Repulsor',
      [Locales.JP]: 'Repulsor',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_SVG],
    description: {
      [Locales.FR]: ['Animation depuis un svg.'],
      [Locales.EN]: ['Animation from svg.'],
      [Locales.JP]: ['svgからのアニメーション。'],
    },
    date: 2025,
    labo: {
      hasJs: true,
      hasHtml: true,
      noBackground: true,
    },
  },
  {
    id: 26,
    slug: 'fish',
    title: {
      [Locales.FR]: 'Poisson',
      [Locales.EN]: 'Fish',
      [Locales.JP]: '魚',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_JS],
    description: {
      [Locales.FR]: [''],
      [Locales.EN]: [''],
      [Locales.JP]: [''],
    },
    date: 2025,
    labo: {
      hasJs: true,
      noBackground: true,
    },
  },
  {
    id: 27,
    slug: 'particule',
    title: {
      [Locales.FR]: 'Particule',
      [Locales.EN]: 'Particule',
      [Locales.JP]: '粒子',
    },
    category: CAT_CODE,
    tags: [Tags.TAG_JS],
    description: {
      [Locales.FR]: [''],
      [Locales.EN]: [''],
      [Locales.JP]: [''],
    },
    date: 2025,
    labo: {
      hasJs: true,
      noBackground: true,
    },
  },
];

export default (locale) => {
  return rawPosts.map((post) => {
    const description = post.description && post.description[locale];
    const inverseLocale = locale === Locales.JP ? Locales.EN : Locales.JP;
    if (description) {
      return {
        ...post,
        title: post.title[locale],
        inverseTitle: post.title[inverseLocale],
        description,
        links: post.links && post.links.map((link) => ({ ...link, label: link.label[locale] })),
      };
    }
    return {
      ...post,
      title: post.title[locale],
      inverseTitle: post.title[inverseLocale],
    };
  });
};
