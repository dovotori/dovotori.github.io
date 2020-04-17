import React, { useLayoutEffect } from 'react';
import styled from 'styled-components';

import ButtonBack from './ButtonBack';
import Bloc from './Bloc';
import TypingMessage from './TypingMessage';
import ProjectImage from './ProjectImage';
import { Title } from '../themes/styled';
import Canvas from './Canvas';
import useFetchHtml from '../hooks/useFetchHtml';
import useFetchJs from '../hooks/useFetchJs';
import useFetchAssets from '../hooks/useFetchAssets';
import { getHtmlPath } from '../utils';

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

const Html = styled.div`
  text-align: left;
  color: ${(p) => p.theme.light};
  margin: 4em auto;
  max-width: none;
  width: calc(100% - 20px);

  img {
    width: 100%;
    height: auto;
    margin: 1em auto;
    box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  }
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

const StyledCanvas = styled(Canvas)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0 auto;

  canvas {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    max-width: ${(p) => p.width}px;
    max-height: ${(p) => p.height}px;
  }
`;

const StyledTitle = styled(Title)`
  margin: 1em 0;
  padding: 0 10px;
`;

const Project = ({
  slug,
  title,
  description,
  images,
  date,
  colorType,
  canvas,
  sources,
  html: hasHtml
}) => {
  const pixelRatio = window.devicePixelRatio;

  const { pending: pendingHtml, value: html, error: errorHtml } = useFetchHtml(
    getHtmlPath(slug), hasHtml
  );

  const { pending: pendingJs, value: js, error: errorJs } = useFetchJs(
    slug
  );

  const { pending: pendingAssets, value: assets, error: errorAssets } = useFetchAssets(sources);

  useLayoutEffect(() => {
    if (!pendingAssets && !errorAssets && !pendingHtml && !errorHtml && !pendingJs && !errorJs && js) {
      js.default(assets);
    }
  }, [pendingAssets, errorAssets, assets, pendingHtml, errorHtml, pendingJs, js, errorJs]);

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
              <Text>{description}</Text>
            </Description>
          )}
          {html && (
            <Html dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </WrapTexte>
        {images && (
          <ImagesList>
            <Images>
              {Array(images).fill().map((_, idx) => idx)
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
        {canvas && (
          <StyledCanvas
            colorType={colorType}
            slug={slug}
            width={1024 * pixelRatio}
            height={1024 * pixelRatio}
          />
        )}
        <ButtonBack colorType={colorType} />
      </WrapContent>
    </StyledProject>
  );
};

export default Project;
