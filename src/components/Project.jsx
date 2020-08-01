import React from 'react';
import styled from 'styled-components';

import ButtonBack from './ButtonBack';
import Bloc from './Bloc';
import TypingMessage from './TypingMessage';
import ProjectImage from './ProjectImage';
import ProjectHtml from './ProjectHtml';

const TEXT_WIDTH = 400;

const StyledProject = styled(Bloc)`
  padding: 10% 0;
`;

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
  min-height: 100vh;
`;

const WrapTexte = styled.div``;

const Description = styled.div`
  text-align: left;
  color: ${(p) => p.theme.light};
  width: 100%;
  max-width: ${TEXT_WIDTH}px;

  ${(p) => p.theme.media.tablet`
    width: 100%;
  `};
`;

const Text = styled.p`
  background: ${(p) => `url(${p.theme.stripes}) repeat`};
  padding: 10px;
  width: calc(100% - 10px);
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

const Date = styled.p`
  text-align: left;
  display: inline-block;
  margin: 0;
  padding: 0.4em 10px;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.monospace}
`;

const StyledTitle = styled.h1`
  ${(p) => p.theme.title}
  margin: 1em 0;
  padding: 0 10px;
`;

const StyledProjectHtml = styled(ProjectHtml)`
  background: ${(p) => (p.noBackground ? 'transparent' : p.theme.getGradient)};
`;

const Project = ({ slug, title, description, images, date, colorType, html: hasHtml }) => {
  return (
    <StyledProject>
      <WrapContent>
        <WrapTexte>
          {title && (
            <StyledTitle colorType={colorType}>
              <TypingMessage message={title} />
            </StyledTitle>
          )}
          {date && <Date colorType={colorType}>{date}</Date>}
          {description && (
            <Description>
              {Array.isArray(description) ? (
                description.map((text) => <Text key={text}>{text}</Text>)
              ) : (
                <Text>{description}</Text>
              )}
            </Description>
          )}
          {hasHtml && (
            <StyledProjectHtml
              slug={slug}
              colorType={colorType}
              noBackground={hasHtml.noBackground}
            />
          )}
        </WrapTexte>
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
    </StyledProject>
  );
};

export default Project;
