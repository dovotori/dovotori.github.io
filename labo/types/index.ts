import type easings from "../lib/utils/easing";

type IVec3 = { x: number; y: number; z: number };

type IRange = { min: number; max: number; value: number; label: string };

type ILampe = {
  type: 0;
  position: IVec3;
  ambiant: [number, number, number];
  diffuse?: [number, number, number];
  specular?: [number, number, number];
  brillance?: number;
  strength?: number;
  near?: number;
  far?: number;
  radius?: number;
  direction?: [number, number, number];
  target?: IVec3;
  ortho?: { left: number; right: number; bottom: number; top: number };
};

type IMouseEvent = "drag" | "wheel" | "click" | "move" | "down" | "up";

type ICamera = {
  position: IVec3;
  target: IVec3;
  near: number;
  far: number;
  angle: number;
};

type IEffect = {
  params?: Record<string, number[]>;
  programName: string;
};

type IPostProcess = {
  shadow?: {
    epsilon: number;
    lighten: number;
    blur: {
      size: number;
      intensity: number;
    };
  };
  bloom?: {
    scale?: number;
    threshold?: number;
    intensity?: number;
    blur?: {
      size: number;
      intensity: number;
    };
  };
  ssao?: {
    // radius: 2.0,
    // strength: 0.5,
    radius: number;
    strength: number;
    blur: {
      size: number;
      intensity: number;
    };
  };
  sobel?: IEffect;
  bright?: IEffect;
  gaussianBlurHorizontal?: IEffect;
  gaussianBlurVertical?: IEffect;
  gaussianBlurHorizontal2?: IEffect;
  gaussianBlurVertical2?: IEffect;
  blend?: IEffect;
  glitch?: IEffect;
};

export interface LaboConfig {
  slug: string;
  MAIN_PROG?: string;
  MAIN_OBJ?: string;
  shaders?: string[];
  assets?: string[];
  camera?: ICamera;
  lampes?: ILampe[];
  mouse?: { domId?: string; events: IMouseEvent[] };
  controls?: {
    fullscreen: { domId?: string; buttonId: string };
    ranges?: Record<string, IRange>;
    checkboxes?: Record<string, { label: string; checked: boolean }>;
    modes?: number[];
  };
  useDepthTexture?: boolean;
  useDrawBuffer?: boolean;
  useWebGpu?: boolean;
  canvas: {
    width: number;
    height: number;
  };
  postprocess?: IPostProcess;
  particules?: {
    workgroupSize: number; // 1 - 256 // depend on computer limitations
    workgroupCount: number;
    size: number;
    speed: number;
  };
  fog?: {
    color: [number, number, number, number];
    start: number;
    end: number;
  };
  keyboard?: Record<string, number>;
}

export type IPrimitive = {
  arrayStride: number;
  attributes: Record<string, { format: string; offset: number; shaderLocation: number }>;
  bufferVertex: ArrayBuffer;
  bufferIndex: ArrayBuffer;
  indexCount: number;
};

export type EaseType = keyof typeof easings;
