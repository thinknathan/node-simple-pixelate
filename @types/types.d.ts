declare type Color = {
  r: number;
  g: number;
  b: number;
};

declare type ColorKey = "r" | "g" | "b";

declare type Options = {
  filename: string | undefined;
  folderPath: string | undefined;
  scale: number;
  afterScale: number;
  cubic: boolean;
  pixelSize: number;
  ditherAlgo: string;
  alphaThreshold: number;
  colorLimit: number;
  palette: string | undefined;
  customPalette: Color[] | undefined;
  lowPass: boolean;
  normalize: boolean;
  grayScale: boolean;
  contrast: number;
  randomColor: boolean;
  width: number | undefined;
  height: number | undefined;
};
