import { useParams } from 'react-router-dom';

import ProjectCommon from '../components/ProjectCommon';
import { getEntry, getTags } from '../selectors';
import { getColorType } from '../utils';

const ProjectCommonContainer = () => {
  const slug = useParams().slug || null;
  const entry = getEntry(slug);
  if (entry === null) {
    window.location.href = '/';
  }
  const tags = getTags();
  return (
    <ProjectCommon
      slug={slug}
      $colorType={getColorType(entry.category)}
      title={entry.title}
      description={entry.description}
      date={entry.date}
      inverseTitle={entry.inverseTitle}
      tags={entry.tags.map((tag) => tags[tag])}
      links={entry.links}
    />
  );
};

export default ProjectCommonContainer;
