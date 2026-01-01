import { useNavigate } from "react-router";
import type { CategoryId, EntryNav, Post } from "src/types";
import ProjectNavigation from "../components/ProjectNavigation";
import {
  getCategoryId,
  getContentBack,
  getContentNext,
  getContentPrevious,
  getEntries,
} from "../selectors";
import { getColorType } from "../utils";

const getEntryNav = (
  entries: Post[],
  slug: string,
): {
  nextEntry: EntryNav;
  prevEntry: EntryNav;
  category: CategoryId;
} => {
  const entryIdx = entries.findIndex((entry) => entry.slug === slug);
  if (entryIdx === -1) {
    return;
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

const ProjectNavigationContainer = ({ slug }: { slug: string }) => {
  const navigate = useNavigate();
  const stateEntries = getEntries();
  const categoryId = getCategoryId();
  const entries =
    categoryId == null
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  const navEntries = getEntryNav(entries, slug);
  if (!navEntries) {
    navigate("/");
    return null;
  }
  const $colorType = getColorType(categoryId) ?? 0;
  const labelBack = getContentBack();
  const labelPrevious = getContentPrevious();
  const labelNext = getContentNext();
  return (
    <ProjectNavigation
      nextEntry={navEntries.nextEntry}
      prevEntry={navEntries.prevEntry}
      $colorType={$colorType}
      labelBack={labelBack}
      labelPrevious={labelPrevious}
      labelNext={labelNext}
    />
  );
};

export default ProjectNavigationContainer;
