import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

import { Loop, Context, Mouse, ManagerAssets, Keyboard } from "Labo/webgl";

import Loader from "./Loader";
import { capitalize, getEnvPath } from "../utils";

const Styled = styled.div`
  position: relative;
  canvas {
    opacity: ${(p) => (p.isReady ? 1 : 0)};
    transition: opacity 500ms ease-out;
  }
`;

const Canvas = (props) => {
  const { width, height, className, colorType } = props;
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const loop = new Loop();
    const mouse = null;
    const keyboard = null;

    // const setup = async () => {
    //   let assets = null;
    //   const js = await import(`../labo/${props.slug}.js`);
    //   const { Scene, config } = js.default;
    //   if (config.assets) {
    //     const am = new ManagerAssets();
    //     assets = await am.get(config.assets.map((path) => getEnvPath(path)));
    //   }
    //   const context = new Context(ref.current);

    //   const scene = new Scene(
    //     context.get(),
    //     config,
    //     assets,
    //     props.width,
    //     props.height
    //   );

    //   if (config.keyboard) {
    //     keyboard = new Keyboard(config.keyboard);
    //   }
    //   if (config.mouse) {
    //     const callbacks = config.mouse.reduce(
    //       (acc, cur) => ({
    //         ...acc,
    //         [`callback${capitalize(cur)}`]: scene[`onMouse${capitalize(cur)}`],
    //       }),
    //       {}
    //     );
    //     mouse = new Mouse(ref.current, callbacks);
    //   }

    //   loop.setCallback(() => {
    //     if (keyboard) {
    //       keyboard.start();
    //       scene.setKeyboardInteraction(keyboard);
    //     }
    //     scene.render();
    //     if (keyboard) keyboard.end();
    //   });
    //   loop.start();
    //   setIsLoading(false);
    // };

    // setup();

    return () => {
      loop.stop();
      if (mouse) {
        mouse.cancel();
      }
    };
  }, []);

  return (
    <Styled className={className} isReady={!isLoading}>
      <canvas ref={ref} width={width} height={height} />
      {isLoading && <Loader colorType={colorType} />}
    </Styled>
  );
};

export default Canvas;
