import { connect } from "react-redux";

import { getColorType } from "../utils";
import Project from "../components/Project";

const getEntry = (entries, slug) =>
  entries.filter((entry) => entry.slug === slug)[0] || null;

const mapStateToProps = (state, props) => {
  const slug = props.match.params.slug || null;
  const entry = getEntry(state.content.entries, slug);
  if (entry === null) {
    window.location.href = "/";
  }
  return {
    ...entry,
    colorType: getColorType(entry.category),
  };
};

export default connect(mapStateToProps)(Project);
