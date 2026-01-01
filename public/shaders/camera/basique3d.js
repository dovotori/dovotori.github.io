import fragment from "./basicFrag";
import vertex from "./basicVertex";

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view"],
};
