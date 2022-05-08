import { useParams } from 'react-router-dom';

import { getColorType } from '../utils';

import Project from '../components/Project';
import { getEntry } from '../selectors';

const ProjectContainer = () => {
  const slug = useParams().slug || null;
  const entry = getEntry(slug);
  console.log(getColorType(entry.category));
  return <Project
    colorType={getColorType(entry.category)}
    {...entry}
  />;
};

export default ProjectContainer;
