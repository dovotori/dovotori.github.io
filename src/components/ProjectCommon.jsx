import ProjectHeader from './ProjectHeader';
import ProjectNavigationContainer from '../containers/ProjectNavigationContainer';

const ProjectCommon = (props) => {
  const { slug, title, inverseTitle, description, date, $colorType } = props;
  const descriptions = description && (Array.isArray(description) ? description : [description]);
  return (
    <>
      <ProjectNavigationContainer slug={slug} />
      <ProjectHeader title={title} descriptions={descriptions} date={date} inverseTitle={inverseTitle} $colorType={$colorType} />
    </>
  );
};

export default ProjectCommon;
