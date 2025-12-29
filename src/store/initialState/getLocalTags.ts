import type { Locale, MyState } from "src/types";
import { CAT_BLOG, CAT_CODE, CAT_DESIGN } from "../../constants/categories";
import * as Tags from "../../constants/tags";

const tags = {
  [Tags.TAG_JS]: {
    slug: "javascript",
    label: "JavaScript",
    picto: "js",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_NODE]: {
    slug: "nodejs",
    label: "NodeJs",
    picto: "node",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_REACT]: {
    slug: "reactjs",
    label: "ReactJs",
    picto: "react",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_REDUX]: {
    slug: "redux",
    label: "Redux",
    picto: "redux",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_STORYBOOK]: {
    slug: "storybook",
    label: "Storybook",
    picto: "storybook",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_HTML]: {
    slug: "html",
    label: "Html5",
    picto: "html",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_CSS]: {
    slug: "css",
    label: "CSS3",
    picto: "css",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_STYLED_COMPONENTS]: {
    slug: "styledcomponents",
    label: "styled-components",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_D3]: {
    slug: "d3",
    label: "D3Js",
    picto: "d3",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_THREE]: {
    slug: "three",
    label: "ThreeJs",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_WEBGL]: {
    slug: "webgl",
    label: "WegGl",
    picto: "webgl",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_GLSL]: {
    slug: "glsl",
    label: "GLSL",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_PHP]: {
    slug: "php",
    label: "PHP5",
    picto: "php",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_JEST]: {
    slug: "jest",
    label: "Jest",
    picto: "jest",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_FLOW]: {
    slug: "flow",
    label: "Flow",
    picto: "flow",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_WEBPACK]: {
    slug: "webpack",
    label: "Webpack",
    picto: "webpack",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_REACT_TESTING]: {
    slug: "reacttestinglibrary",
    label: "react-testing-library",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_GIT]: {
    slug: "git",
    label: "Git",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_BLENDER]: {
    slug: "blender",
    label: "Blender",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_INKSCAPE]: {
    slug: "inkscape",
    label: "Inkscape",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_GIMP]: {
    slug: "gimp",
    label: "Gimp",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_FIGMA]: {
    slug: "figma",
    label: "Figma",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_ILLUSTRATOR]: {
    slug: "illustrator",
    label: "Illustrator",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_PHOTOSHOP]: {
    slug: "photoshop",
    label: "Photoshop",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_INDESIGN]: {
    slug: "indesign",
    label: "InDesign",
    categoryId: CAT_DESIGN,
  },
  [Tags.TAG_PHOTO]: {
    slug: "photo",
    label: "Photo",
    categoryId: CAT_BLOG,
  },
  [Tags.TAG_TRAVEL]: {
    slug: "travel",
    label: "Travel",
    categoryId: CAT_BLOG,
  },
  [Tags.TAG_VIDEO_GAME]: {
    slug: "videogame",
    label: "Video Game",
    categoryId: CAT_BLOG,
  },
  [Tags.TAG_EXPERIMENTAL]: {
    slug: "experimental",
    label: "Experimental",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_OL]: {
    slug: "openlayers",
    label: "Open Layers",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_SPINE]: {
    slug: "spine",
    label: "Spine 2d",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_CONTEXT_2D]: {
    slug: "context2d",
    label: "Context 2d",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_SVG]: {
    slug: "svg",
    label: "Svg",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_KINECT]: {
    slug: "kinect",
    label: "Kinect",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_PROCESSING]: {
    slug: "processing",
    label: "Processing",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_WORDPRESS]: {
    slug: "wordpress",
    label: "Wordpress",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_GLTF]: {
    slug: "gltf",
    label: "Gltf",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_CONTEXT_AUDIO]: {
    slug: "contectaudio",
    label: "Context Audio",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_ESLINT]: {
    slug: "eslint",
    label: "Eslint",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_KANBAN]: {
    slug: "kanban",
    label: "Kanban",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_AGILE]: {
    slug: "agile",
    label: "Agile",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_WEBGPU]: {
    slug: "webgpu",
    label: "WebGPU",
    categoryId: CAT_CODE,
  },
  [Tags.TAG_WGSL]: {
    slug: "wgsl",
    label: "Wgsl",
    categoryId: CAT_CODE,
  },
};

export default (locale: Locale): MyState["tags"] =>
  Object.keys(tags).reduce((acc, cur) => {
    const { slug, picto, categoryId, label } = tags[cur];
    return {
      ...acc,
      [cur]: {
        slug,
        picto,
        categoryId,
        label: typeof label === "string" ? label : label[locale],
      },
    };
  }, {});
