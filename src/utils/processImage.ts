import * as Jimp from "jimp";
import * as fs from "fs";
import * as path from "path";
import { workerData, isMainThread } from "worker_threads";

import { definedPalettesImport } from "./definedPalettes";
import { applyAlphaThreshold } from "./applyAlphaThreshold";
import { applyAtkinsonDithering } from "./applyAtkinsonDithering";
import { applyBayerDithering } from "./applyBayerDithering";
import { applyBWThreshold } from "./applyBWThreshold";
import { applyLowPassFilter } from "./applyLowPassFilter";
import { applyPalette } from "./applyPalette";
import { applyMedianCut } from "./applyMedianCut";

const outputFolder = "output";
const customPaletteName = "CUSTOM";
const definedPalettes = definedPalettesImport as typeof definedPalettesImport &
  Record<string, Color[]>;

/**
 * Processes the given image with various image manipulation options.
 *
 * @param options - Image processing options.
 * @param skipExtCheck - (Optional) Skips extension check if set to true.
 */
export function processImage(options: Options, skipExtCheck?: boolean): void {
  const {
    filename,
    scale,
    pixelSize,
    ditherAlgo,
    alphaThreshold,
    colorLimit,
    palette,
    customPalette,
    lowPass,
    normalize,
    grayScale,
    contrast,
    width,
    height,
  } = options;

  if (filename && skipExtCheck) {
    Jimp.read(filename, (err, image) => {
      if (!err) {
        continueProcessing(
          image,
          scale,
          pixelSize,
          ditherAlgo,
          alphaThreshold,
          colorLimit,
          palette,
          customPalette,
          lowPass,
          normalize,
          grayScale,
          contrast,
          width,
          height,
          filename,
        );
      }
    });
    return;
  }

  const supportedFormats = [".png", ".gif", ".jpg", ".jpeg"];
  let foundImage = false;

  // Attempt to read the image with different extensions
  supportedFormats.forEach((ext) => {
    const fullFilename = filename + ext;

    if (!foundImage) {
      Jimp.read(fullFilename, (err, image) => {
        if (!foundImage && !err) {
          foundImage = true;
          continueProcessing(
            image,
            scale,
            pixelSize,
            ditherAlgo,
            alphaThreshold,
            colorLimit,
            palette,
            customPalette,
            lowPass,
            normalize,
            grayScale,
            contrast,
            width,
            height,
            fullFilename,
          );
        }
      });
    }
  });
}

function continueProcessing(
  image: Jimp,
  scale: number,
  pixelSize: number,
  ditherAlgo: string,
  alphaThreshold: number,
  colorLimit: number,
  palette: string | undefined,
  customPalette: Color[] | undefined,
  lowPass: boolean,
  normalize: boolean,
  grayScale: boolean,
  contrast: number,
  width: number | undefined,
  height: number | undefined,
  inputFilename: string,
): void {
  // RESIZE
  if (width || height) {
    image.resize(width ? width : Jimp.AUTO, height ? height : Jimp.AUTO);
  } else {
    image.scale(scale);
  }

  // NORMALIZE
  if (normalize) {
    image.normalize();
  }

  // CONTRAST
  if (contrast !== 0) {
    image.contrast(contrast);
  }

  // LOW PASS
  if (lowPass) {
    applyLowPassFilter(image);
  }

  // OPACITY
  applyAlphaThreshold(image, alphaThreshold);

  // GRAYSCALE
  if (grayScale) {
    image.greyscale();
  }

  // DITHERING
  if (ditherAlgo === "floyd") {
    image.dither565();
  } else if (ditherAlgo === "atkinson") {
    applyAtkinsonDithering(image);
  } else if (ditherAlgo === "bayer") {
    applyBayerDithering(image);
  }

  // PIXELATE
  if (pixelSize > 0) {
    image.pixelate(pixelSize);
  }

  if (customPalette) {
    // USER-DEFINED PALETTE
    definedPalettes[customPaletteName] = customPalette;
    applyPalette(image, customPaletteName, definedPalettes);
  } else if (palette) {
    // PREDEFINED PALETTE
    applyPalette(image, palette, definedPalettes);
  } else {
    // DYNAMIC COLOUR LIMIT
    // Special case for 2-colour using black/white threshold
    if (colorLimit === 2) {
      applyBWThreshold(image);
    } else {
      definedPalettes[customPaletteName] = applyMedianCut(image, colorLimit);
      applyPalette(image, customPaletteName, definedPalettes);
    }
  }

  // Create a folder for output if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Incorporate the input filename into the output filename
  const baseFilename = path.basename(
    inputFilename,
    path.extname(inputFilename),
  );
  const outputFilename = `${outputFolder}/${baseFilename}_f${ditherAlgo}_c${colorLimit}_p${pixelSize}.png`;

  image.write(outputFilename);
  console.log(`Image saved: ${outputFilename}`);
}

// If used as a worker thread, get file name from message
if (!isMainThread) {
  const { filePath, options } = workerData;
  options.filename = filePath;
  processImage(options, true);
}
