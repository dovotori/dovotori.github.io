import React from 'react';
import styled from 'styled-components';

import ButtonBack from './ButtonBack';
import ProjectImage from './ProjectImage';
import ProjectHtml from './ProjectHtml';

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 0 0 10%;
`;

const ImagesList = styled.div`
  margin: 4em auto;
  ${(p) => p.theme.scrollbar} img {
    display: block;
    width: 100%;
  }

  ${(p) => p.theme.media.tablet`
    position: relative;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    height: auto;
    left: auto;
  `}
`;

const Images = styled.div`
  width: calc(100% - 20px);
  margin: 0 auto;
`;

const StyledProjectHtml = styled(ProjectHtml)`
  background: ${(p) => (p.noBackground ? 'transparent' : p.theme.getGradient)};
  --project-color: ${(p) => p.theme.getColor};
`;

const Project = ({ slug, images, colorType, html: hasHtml }) => {
  return (
    <>
      {hasHtml && (
        <StyledProjectHtml
          slug={slug}
          colorType={colorType}
          noBackground={!!hasHtml.noBackground}
        />
      )}
      <WrapContent>
        {images && (
          <ImagesList>
            <Images>
              {Array(images)
                .fill()
                .map((_, idx) => idx)
                .map((idx) => (
                  <ProjectImage
                    key={`image-${slug}-${idx}`}
                    idx={idx}
                    slug={slug}
                    colorType={colorType}
                  />
                ))}
            </Images>
          </ImagesList>
        )}
        <ButtonBack colorType={colorType} />
      </WrapContent>
    </>
  );
};

export default Project;
