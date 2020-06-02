import { connect } from "react-redux";

import { getColorType } from "../utils";
import ProjectNavigation from "../components/ProjectNavigation";

const getEntryNav = (entries, slug) => {
  const entryIdx = entries.findIndex((entry) => entry.slug === slug);
  if (entryIdx === -1) {
    window.location = "/";
  }
  let nextEntryIdx = entryIdx + 1;
  let prevEntryIdx = entryIdx - 1;
  if (prevEntryIdx < 0) {
    prevEntryIdx = entries.length - 1;
  }
  if (nextEntryIdx >= entries.length) {
    nextEntryIdx = 0;
  }
  const nextEntry = entries[nextEntryIdx];
  const prevEntry = entries[prevEntryIdx];
  return {
    nextEntry: {
      category: nextEntry.category,
      slug: nextEntry.slug,
      title: nextEntry.title,
    },
    prevEntry: {
      category: prevEntry.category,
      slug: prevEntry.slug,
      title: prevEntry.title,
    },
    category: entries[entryIdx].category,
  };
};

const mapStateToProps = (state, props) => {
  const slug = props.match.params.slug || null;
  const { category, nextEntry, prevEntry } = getEntryNav(
    state.content.entries,
    slug
  );
  const colorType = getColorType(category);
  return {
    slug,
    nextEntry,
    prevEntry,
    colorType,
    isTouchDevice: state.device.isTouch,
  };
};

export default connect(mapStateToProps)(ProjectNavigation);
