import { forwardRef, useState, useCallback } from "react";
import styled from "styled-components";

import GlitchImage from "./GlitchImage";

const Wrap = styled.div`
  position: relative;
  overflow: hidden;
`;
const IMG = styled.img`
  opacity: ${(p) => (p.$isLoaded ? 1 : 0)};
  visibility: ${(p) => (p.$isLoaded ? "visible" : "hidden")};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`;

const LazyImage = forwardRef(
  ({ className, withGlitch, alt, width, height, children, src }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const hasLoaded = useCallback(() => setIsLoaded(true), [setIsLoaded]);

    return (
      <Wrap ref={ref} className={className}>
        <IMG
          alt={`_${alt}`}
          src={src}
          onLoad={hasLoaded}
          $isLoaded={isLoaded}
          width={width || "auto"}
          height={height || "auto"}
        />
        {isLoaded && withGlitch && <GlitchImage src={src} />}
        {!isLoaded && children}
      </Wrap>
    );
  },
);

export default LazyImage;
