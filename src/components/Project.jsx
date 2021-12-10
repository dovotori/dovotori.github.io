import styled from 'styled-components';

import ButtonBack from './ButtonBack';
import ProjectImage from './ProjectImage';
import ProjectLabo from './ProjectLabo';
import CrossSvg from './Cross';

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
    height: auto;
    left: auto;
  `}
`;

const Images = styled.div`
  width: calc(100% - 20px);
  margin: 0 auto;
`;

const StyledProjectLabo = styled(ProjectLabo)`
  background: ${(p) => (p.noBackground ? 'transparent' : p.theme.getGradient)};
  --project-color: ${(p) => p.theme.getColor};
`;

const Cross = styled(CrossSvg)`
  margin: 0 auto 2em;
`;

const Center = styled.div`
  text-align: center;
  margin: 4em auto;
`;

const Project = ({ slug, images, colorType, labo }) => (
  <>
    {!!labo && (
      <StyledProjectLabo
        slug={slug}
        $colorType={colorType}
        colorType={colorType}
        noBackground={!!labo.noBackground}
        hasHtml={!!labo.hasHtml}
        hasJs={!!labo.hasJs}
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
                  $colorType={colorType}
                />
              ))}
          </Images>
        </ImagesList>
      )}
      <Center>
        <Cross $colorType={colorType} />
      </Center>
      <ButtonBack $colorType={colorType} />
    </WrapContent>
  </>
);

export default Project;
