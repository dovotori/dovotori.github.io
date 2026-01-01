import { useCallback, useState } from "react";
import styled from "styled-components";

import GlitchImage from "./GlitchImage";

const Wrap = styled.div`
  position: relative;
  overflow: hidden;
`;
const IMG = styled.img<{ $isLoaded: boolean }>`
  opacity: ${(p) => (p.$isLoaded ? 1 : 0)};
  visibility: ${(p) => (p.$isLoaded ? "visible" : "hidden")};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`;

const LazyImage = ({
  className,
  withGlitch,
  alt,
  width,
  height,
  children,
  src,
  ref,
  placeholderImg,
}: {
  className?: string;
  withGlitch?: boolean;
  alt: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  src: string;
  ref?: React.Ref<HTMLDivElement>;
  placeholderImg?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [finalSrc, setFinalSrc] = useState(src);
  const [usedPlaceholder, setUsedPlaceholder] = useState(false);

  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onError = useCallback(() => {
    if (placeholderImg && !usedPlaceholder) {
      // Try loading the placeholder
      setFinalSrc(placeholderImg);
      setUsedPlaceholder(true);
      setIsLoaded(false);
    } else {
      // No placeholder or placeholder also failed
      setHasError(true);
      setIsLoaded(true);
    }
  }, [placeholderImg, usedPlaceholder]);

  return (
    <Wrap ref={ref} className={className}>
      {!hasError && (
        <IMG
          alt={alt}
          src={finalSrc}
          onLoad={onLoad}
          onError={onError}
          $isLoaded={isLoaded}
          width={width ?? "auto"}
          height={height ?? "auto"}
        />
      )}
      {!hasError && isLoaded && withGlitch && <GlitchImage src={finalSrc} />}
      {!isLoaded && children}
    </Wrap>
  );
};

export default LazyImage;
