import { useParams } from 'react-router-dom';

import ProjectCommon from '../components/ProjectCommon';
import { getColorType } from '../utils';
import { getEntry } from '../selectors';

const ProjectCommonContainer = () => {
  const slug = useParams().slug || null;
  const entry = getEntry(slug);
  if (entry === null) {
    window.location.href = '/';
  }
  return <ProjectCommon
    slug={slug}
    $colorType={getColorType(entry.category)}
    title={entry.title}
    description={entry.description}
    date={entry.date}
    inverseTitle={entry.inverseTitle}
  />;
};

export default ProjectCommonContainer;
