import { ReactComponent as PlusIcon } from "Assets/svg/plus.svg";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getColorType, getTeaserPath } from "../utils";
import LazyImage from "./LazyImage";
import Loader from "./Loader";

const StyledLink = styled(Link).attrs({
  className: "teaser",
})`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 1em;
  width: 400px;
  height: 100px;
  opacity: 1;
  box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  transform: ${(p) => {
    if (p.$isVisible) {
      return p.$isHover && !p.isTouchDevice ? "scale(1.2)" : "none";
    }
    return "translateY(20%)";
  }};
  z-index: ${(p) => (p.$isVisible && p.$isHover && !p.isTouchDevice ? 1 : 0)};
  transition:
    opacity 1s ${(p) => p.theme.elastic},
    transform 1s ${(p) => p.theme.elastic},
    box-shadow 800ms linear;

  ${(p) => p.theme.active}
  ${(p) => p.theme.media.mobile`margin: 5px auto; width: 100%; height: auto;`}
`;

const StyledLazyImage = styled(LazyImage)`
  width: 100%;
  transform: ${(p) => (p.$isFocus ? "scale(1.1)" : "none")};
  transition: transform 5000ms ${(p) => p.theme.elastic};
  height: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-top: -25px;
    opacity: ${(p) => (p.$isFocus ? 0.7 : 0.8)};
  }
`;

const Infos = styled.div`
  overflow: hidden;
  background: ${(p) => p.theme.getGradient};
  height: 100%;
`;

const Title = styled.h3`
  position: absolute;
  top: 50%;
  left: 0;
  color: ${(p) => p.theme.text};
  font-size: 10em;
  letter-spacing: 0.1em;
  opacity: ${(p) => (p.$isFocus ? 0.4 : 0)};
  transition:
    opacity 1s ${(p) => p.theme.elastic},
    transform 1s ${(p) => p.theme.elastic};
  transform: ${(p) => (p.$isFocus ? "translate3d(0, -50%, 0)" : "translate3d(-100%, -50%, 0)")};
  z-index: 1;
  white-space: nowrap;
`;

const Plus = styled(PlusIcon)`
  position: absolute;
  top: 25%;
  left: 5%;
  width: auto;
  height: 50%;
  fill: ${(p) => p.theme.getColor};
  opacity: ${(p) => (p.$isFocus ? 1 : 0)};
  transition:
    opacity 1s ${(p) => p.theme.elastic},
    transform 1s ${(p) => p.theme.elastic};
  transform: ${(p) => (p.$isFocus ? "none" : "scale(0) rotate(45deg)")};
  z-index: 2;
`;

const WrapLoader = styled.div`
  margin: 20px auto;
`;

const Teaser = ({
  className,
  category,
  slug,
  title = "",
  currentHover,
  setCurrentHover = () => {},
  isTouchDevice,
}) => {
  const $colorType = getColorType(category);
  const [isHovered, setIsHovered] = useState(false);
  const [refInView, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const onEnter = () => setIsHovered(true);
  const onLeave = () => setIsHovered(false);

  useEffect(
    () => setCurrentHover(isHovered ? slug : ""),
    [isHovered, setCurrentHover, slug],
  );

  const opacity = useMemo(() => {
    if (!inView) {
      return 0;
    }
    if (isTouchDevice || currentHover === slug || currentHover === "") {
      return 1;
    }
    return 0.65;
  }, [currentHover, inView, isTouchDevice, slug]);

  return (
    <StyledLink
      ref={refInView}
      className={className}
      to={`/project/${slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      $levelOpacity={opacity}
      $isVisible={inView}
      title={title}
      $isHover={isHovered}
      isTouchDevice={isTouchDevice}
    >
      <Infos $colorType={$colorType}>
        <StyledLazyImage
          src={getTeaserPath(slug)}
          alt={title}
          width={400}
          height={150}
          withGlitch={isHovered}
          $isFocus={isHovered}
        >
          <WrapLoader>
            <Loader $colorType={$colorType} />
          </WrapLoader>
        </StyledLazyImage>
      </Infos>
      {!isTouchDevice ? (
        <>
          <Plus $isFocus={isHovered} $colorType={$colorType} />
          <Title $isFocus={isHovered}>{title}</Title>
        </>
      ) : null}
    </StyledLink>
  );
};

export default Teaser;
