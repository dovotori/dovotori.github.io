import { useSelector } from "react-redux";

import ProjectNavigation from "../components/ProjectNavigation";
import {
  getEntries,
  getContentBack,
  getContentPrevious,
  getIsTouchDevice,
  getContentNext,
} from "../selectors";

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

const ProjectNavigationContainer = ({ slug }) => {
  const stateEntries = getEntries();
  const categoryId = useSelector((state) => state.device.category);
  const entries =
    categoryId === -1
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  const { nextEntry, prevEntry } = getEntryNav(entries, slug);
  const $colorType = null; // getColorType(category);
  const isTouchDevice = getIsTouchDevice();
  const labelBack = getContentBack();
  const labelPrevious = getContentPrevious();
  const labelNext = getContentNext();
  return (
    <ProjectNavigation
      slug={slug}
      nextEntry={nextEntry}
      prevEntry={prevEntry}
      $colorType={$colorType}
      isTouchDevice={isTouchDevice}
      labelBack={labelBack}
      labelPrevious={labelPrevious}
      labelNext={labelNext}
    />
  );
};

export default ProjectNavigationContainer;
