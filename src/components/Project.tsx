import type { Post } from "src/types";
import styled from "styled-components";
import ButtonBack from "./ButtonBack";
import ProjectImage from "./ProjectImage";
import ProjectLabo from "./ProjectLabo";

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 0 0 10%;
`;

const ImagesList = styled.div`
  margin: 4em auto;
  img {
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
  background: ${(p) => (p.noBackground ? "transparent" : p.theme.getGradient)};
  --project-color: ${(p) => p.theme.getColor};
`;

const Project = ({
  slug,
  images,
  colorType,
  labo,
  back,
}: {
  slug: string;
  images?: number;
  colorType: number;
  labo?: Post["labo"];
  back: string;
}) => (
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
              .fill(0)
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
      <ButtonBack $colorType={null} label={back} />
    </WrapContent>
  </>
);

export default Project;
