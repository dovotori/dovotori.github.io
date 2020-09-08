import React from 'react';

import ProjectHeader from './ProjectHeader';
import ProjectNavigationContainer from '../containers/ProjectNavigationContainer';

const ProjectCommon = (props) => {
  const { slug, title, description, date, colorType } = props;
  const descriptions = description && (Array.isArray(description) ? description : [description]);
  return (
    <>
      <ProjectNavigationContainer slug={slug} />
      <ProjectHeader title={title} description={descriptions} date={date} colorType={colorType} />
    </>
  );
};

export default ProjectCommon;
