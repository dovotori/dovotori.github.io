import ProjectNavigationContainer from '../containers/ProjectNavigationContainer';
import ProjectHeader from './ProjectHeader';

const ProjectCommon = (props) => {
  const { slug, title, inverseTitle, description, tags, date, link, $colorType } = props;
  const descriptions = description && (Array.isArray(description) ? description : [description]);
  return (
    <>
      <ProjectNavigationContainer slug={slug} />
      <ProjectHeader
        title={title}
        descriptions={descriptions}
        tags={tags}
        link={link}
        date={date}
        inverseTitle={inverseTitle}
        $colorType={$colorType}
      />
    </>
  );
};

export default ProjectCommon;
