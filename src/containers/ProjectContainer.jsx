import { useParams } from 'react-router-dom';
import Project from '../components/Project';
import { getContentBack, getEntry } from '../selectors';
import { getColorType } from '../utils';

const ProjectContainer = () => {
  const slug = useParams().slug || null;
  const entry = getEntry(slug);
  return <Project colorType={getColorType(entry.category)} {...entry} back={getContentBack()} />;
};

export default ProjectContainer;
