import * as Jimp from "jimp";
import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";
import * as definedPalettesImport from "./px-palettes";

const outputFolder = "output";
const customPaletteName = "CUSTOM";
const definedPalettes = definedPalettesImport as typeof definedPalettesImport &
  Record<string, Color[]>;

type Color = {
  r: number;
  g: number;
  b: number;
};

type ColorKey = "r" | "g" | "b";

type Options = {
  filename: string;
  scale: number;
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
  width: number | undefined;
  height: number | undefined;
};

function processImage(options: Options): void {
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
    applyPalette(image, customPaletteName);
  } else if (palette) {
    // PREDEFINED PALETTE
    applyPalette(image, palette);
  } else {
    // DYNAMIC COLOUR LIMIT
    // Special case for 2-colour using black/white threshold
    if (colorLimit === 2) {
      applyBWThreshold(image);
    } else {
      definedPalettes[customPaletteName] = medianCut(image, colorLimit);
      applyPalette(image, customPaletteName);
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

function medianCut(image: Jimp, colorLimit: number): Color[] {
  const pixels: Color[] = [];

  // Collect all pixels from the image
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const pixelColor = Jimp.intToRGBA(this.getPixelColor(x, y));
      pixels.push({
        r: pixelColor.r,
        g: pixelColor.g,
        b: pixelColor.b,
      });
    },
  );

  // Recursive function to split the color space
  function recursiveMedianCut(pixelArray: Color[], depth: number): Color[] {
    if (depth === 0 || pixelArray.length <= colorLimit) {
      // Average color of pixels in the current cube
      const averageColor = pixelArray.reduce(
        (acc, pixel) => ({
          r: acc.r + pixel.r,
          g: acc.g + pixel.g,
          b: acc.b + pixel.b,
        }),
        { r: 0, g: 0, b: 0 },
      );

      const numPixels = pixelArray.length;
      return [
        {
          r: Math.round(averageColor.r / numPixels),
          g: Math.round(averageColor.g / numPixels),
          b: Math.round(averageColor.b / numPixels),
        },
      ];
    }

    // Randomly choose an axis to split
    const randomAxis = ["r", "g", "b"][
      Math.floor(Math.random() * 3)
    ] as ColorKey;

    // Sort the channel values for the chosen axis
    const sortedChannel = pixelArray
      .map((pixel) => pixel[randomAxis])
      .sort((a, b) => a - b);

    const medianIndex = Math.floor(sortedChannel.length / 2);

    // Split the pixel array into two halves based on the chosen axis
    const firstHalf = pixelArray.filter(
      (pixel) => pixel[randomAxis] <= sortedChannel[medianIndex],
    );
    const secondHalf = pixelArray.filter(
      (pixel) => pixel[randomAxis] > sortedChannel[medianIndex],
    );

    // Recursively process both halves
    const firstHalfColors = recursiveMedianCut(firstHalf, depth - 1);
    const secondHalfColors = recursiveMedianCut(secondHalf, depth - 1);

    // Combine and return the colors from both halves
    return [...firstHalfColors, ...secondHalfColors];
  }

  // Perform median cut and get the reduced color palette
  const colorPalette = recursiveMedianCut(
    pixels,
    Math.ceil(Math.log2(colorLimit)),
  );

  // Output the color palette in the specified format
  const formattedPalette: Color[] = colorPalette.map((color: Color) => ({
    r: color.r,
    g: color.g,
    b: color.b,
    // You can add color names or any other information here if needed
  }));

  return formattedPalette;
}

function applyBayerDithering(image: Jimp) {
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  const { width, height } = image.bitmap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldColor = Jimp.intToRGBA(image.getPixelColor(x, y));
      const newColor = {
        r: oldColor.r > bayerMatrix[x % 4][y % 4] * 16 ? 255 : 0,
        g: oldColor.g > bayerMatrix[x % 4][y % 4] * 16 ? 255 : 0,
        b: oldColor.b > bayerMatrix[x % 4][y % 4] * 16 ? 255 : 0,
        a: oldColor.a,
      };
      image.setPixelColor(
        Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a),
        x,
        y,
      );
    }
  }
}

function applyAlphaThreshold(image: Jimp, alphaThreshold: number): void {
  // ALPHA THRESHOLD
  const threshold = Math.round(alphaThreshold * 255); // Convert threshold to 0-255 range

  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const alpha = this.bitmap.data[idx + 3];
      this.bitmap.data[idx + 3] = alpha > threshold ? 255 : 0;
    },
  );
}

function applyBWThreshold(image: Jimp): void {
  const threshold = 128; // Adjust this threshold as needed
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      // Calculate luminance (a common method for grayscale conversion)
      const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

      // Set the pixel to black or white based on the threshold
      const newValue = luminance > threshold ? 255 : 0;

      // Set red, green, and blue channels to the new value
      this.bitmap.data[idx + 0] = newValue;
      this.bitmap.data[idx + 1] = newValue;
      this.bitmap.data[idx + 2] = newValue;
    },
  );
}

function applyAtkinsonDithering(image: Jimp): void {
  const { width, height } = image.bitmap;

  for (let y = 0; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const oldColor = Jimp.intToRGBA(image.getPixelColor(x, y));
      const newColor = {
        r: oldColor.r > 128 ? 255 : 0,
        g: oldColor.g > 128 ? 255 : 0,
        b: oldColor.b > 128 ? 255 : 0,
        a: oldColor.a,
      };
      image.setPixelColor(
        Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a),
        x,
        y,
      );

      const quantErrorR = oldColor.r - newColor.r;
      const quantErrorG = oldColor.g - newColor.g;
      const quantErrorB = oldColor.b - newColor.b;

      // Distribute the error to neighboring pixels
      distributeError(
        image,
        x + 1,
        y,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
      distributeError(
        image,
        x + 2,
        y,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
      distributeError(
        image,
        x - 1,
        y + 1,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
      distributeError(
        image,
        x,
        y + 1,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
      distributeError(
        image,
        x + 1,
        y + 1,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
      distributeError(
        image,
        x,
        y + 2,
        quantErrorR,
        quantErrorG,
        quantErrorB,
        1 / 8,
      );
    }
  }
}

function distributeError(
  image: Jimp,
  x: number,
  y: number,
  quantErrorR: number,
  quantErrorG: number,
  quantErrorB: number,
  factor: number,
): void {
  const oldColor = Jimp.intToRGBA(image.getPixelColor(x, y));

  const newColor = {
    r: clamp(oldColor.r + quantErrorR * factor, 0, 255),
    g: clamp(oldColor.g + quantErrorG * factor, 0, 255),
    b: clamp(oldColor.b + quantErrorB * factor, 0, 255),
    a: oldColor.a,
  };

  image.setPixelColor(
    Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a),
    x,
    y,
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function applyLowPassFilter(image: Jimp): void {
  const { width, height } = image.bitmap;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const neighbors = [
        image.getPixelColor(x - 1, y - 1),
        image.getPixelColor(x, y - 1),
        image.getPixelColor(x + 1, y - 1),
        image.getPixelColor(x - 1, y),
        image.getPixelColor(x, y),
        image.getPixelColor(x + 1, y),
        image.getPixelColor(x - 1, y + 1),
        image.getPixelColor(x, y + 1),
        image.getPixelColor(x + 1, y + 1),
      ];

      const averageColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      };

      neighbors.forEach((neighbor) => {
        const rgba = Jimp.intToRGBA(neighbor);
        averageColor.r += rgba.r;
        averageColor.g += rgba.g;
        averageColor.b += rgba.b;
        averageColor.a += rgba.a;
      });

      averageColor.r /= neighbors.length;
      averageColor.g /= neighbors.length;
      averageColor.b /= neighbors.length;
      averageColor.a /= neighbors.length;

      image.setPixelColor(
        Jimp.rgbaToInt(
          averageColor.r,
          averageColor.g,
          averageColor.b,
          averageColor.a,
        ),
        x,
        y,
      );
    }
  }
}

// Function to find the closest color in the palette
function findClosestColor(targetColor: Color, palette: Color[]): Color {
  return palette.reduce((closest, current) => {
    const distanceTarget =
      Math.abs(targetColor.r - closest.r) +
      Math.abs(targetColor.g - closest.g) +
      Math.abs(targetColor.b - closest.b);
    const distanceCurrent =
      Math.abs(targetColor.r - current.r) +
      Math.abs(targetColor.g - current.g) +
      Math.abs(targetColor.b - current.b);
    return distanceCurrent < distanceTarget ? current : closest;
  });
}

function applyPalette(image: Jimp, palette: string): void {
  if (!definedPalettes[palette]) {
    console.error(`${palette} not found in predefined palettes.`);
    return;
  }

  const chosenPalette = definedPalettes[palette];

  // Apply the custom palette
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const pixelColor = Jimp.intToRGBA(this.getPixelColor(x, y));
      const closestColor = findClosestColor(pixelColor, chosenPalette);

      // Set the pixel to the closest color in the palette
      this.setPixelColor(
        Jimp.rgbaToInt(
          closestColor.r,
          closestColor.g,
          closestColor.b,
          pixelColor.a,
        ),
        x,
        y,
      );
    },
  );
}

// Command line argument parsing
const options = yargs
  .option("f", {
    alias: "filename",
    describe: "Input image filename",
    demandOption: true,
    type: "string",
  })
  .option("s", {
    alias: "scale",
    describe: "Scale the image up or down by this factor",
    type: "number",
    default: 1,
    coerce: (value) => {
      if (value <= 0) {
        throw new Error("scale should be > 0");
      }
      return value;
    },
  })
  .option("x", {
    alias: "contrast",
    describe: "Adjust contrast by a value between -1 and +1",
    type: "number",
    default: 0,
    coerce: (value) => {
      if (value < -1 || value > 1) {
        throw new Error("contrast should be between -1 and 1");
      }
      return value;
    },
  })
  .option("z", {
    alias: "pixelSize",
    describe: "Adjust blockiness by pixel size",
    type: "number",
    default: 0,
    coerce: (value) => {
      if (value < 0) {
        throw new Error("pixelSize should not be lower than 0");
      }
      return Math.round(value);
    },
  })
  .option("d", {
    alias: "ditherAlgo",
    describe: "Dithering algorithm: floyd, bayer, atkinson or none",
    type: "string",
    default: "none",
    choices: ["floyd", "bayer", "atkinson", "none"],
  })
  .option("t", {
    alias: "alphaThreshold",
    describe: "Adjust transparent pixels to hide/show based on threshold",
    type: "number",
    default: 0.6,
    coerce: (value) => {
      if (value < 0.000001 || value > 0.999999) {
        throw new Error("alphaThreshold should be a range > 0 and < 1");
      }
      return value;
    },
  })
  .option("c", {
    alias: "colorLimit",
    describe: "Limit number of colours",
    type: "number",
    default: 8,
    coerce: (value) => {
      if (value < 2) {
        throw new Error("colorLimit should not be lower than 2");
      }
      return Math.round(value);
    },
  })
  .option("p", {
    alias: "palette",
    describe: "Use a predefined custom palette",
    type: "string",
    choices: [
      "APPLE_II_HI",
      "GAMEBOY_ORIGINAL",
      "GAMEBOY_COMBO_UP",
      "GAMEBOY_COMBO_DOWN",
      "GAMEBOY_COMBO_LEFT",
      "GAMEBOY_COMBO_RIGHT",
      "GAMEBOY_A_UP",
      "GAMEBOY_A_DOWN",
      "GAMEBOY_A_LEFT",
      "GAMEBOY_A_RIGHT",
      "GAMEBOY_B_UP",
      "GAMEBOY_B_DOWN",
      "GAMEBOY_B_LEFT",
      "GAMEBOY_B_RIGHT",
      "GAMEBOY_POCKET",
      "GAMEBOY_VIRTUALBOY",
      "TELETEXT",
      "BBC_MICRO",
      "CGA_MODE4_PAL1",
      "CGA_MODE5_PAL1",
      "CGA_MODE4_PAL2",
      "ZX_SPECTRUM",
      "APPLE_II_LO",
      "COMMODORE_64",
      "MICROSOFT_WINDOWS_16",
      "MICROSOFT_WINDOWS_20",
      "PICO_8",
      "MSX",
      "MONO_OBRADINN_IBM",
      "MONO_OBRADINN_MAC",
      "MONO_BJG",
      "MONO_BW",
      "MONO_PHOSPHOR_AMBER",
      "MONO_PHOSPHOR_LTAMBER",
      "MONO_PHOSPHOR_GREEN1",
      "MONO_PHOSPHOR_GREEN2",
      "MONO_PHOSPHOR_GREEN3",
      "MONO_PHOSPHOR_APPLE",
      "APPLE_II_MONO",
      "MONO_PHOSPHOR_APPLEC",
      "APPLE_II_MONOC",
      "MICROSOFT_WINDOWS_PAINT",
      "AMSTRAD_CPC",
      "ATARI_2600",
      "ATARI_5200",
      "ATARI_7800",
      "ATARI_LYNX",
    ],
  })
  .option("o", {
    alias: "customPalette",
    describe: "Custom palette in the format [[r, g, b], [r, g, b], ...]",
    type: "array",
    coerce: (value) => {
      // Convert the string to a proper array representation
      const parsedArray = JSON.parse(`[${value.join("")}]`).pop();

      // Validate the format and range of values
      if (
        Array.isArray(parsedArray) &&
        parsedArray.every(
          (color) =>
            Array.isArray(color) &&
            color.length === 3 &&
            color.every(
              (channel) =>
                typeof channel === "number" && channel >= 0 && channel <= 255,
            ),
        )
      ) {
        parsedArray.map((color) =>
          color.map((channel: number) => Math.round(channel)),
        );
        return parsedArray.map((color) => ({
          r: color[0],
          g: color[1],
          b: color[2],
        }));
      } else {
        throw new Error(
          "Invalid customPalette format. It should be an array of arrays, each containing three numbers in the range 0 to 255.",
        );
      }
    },
  })
  .option("l", {
    alias: "lowPass",
    describe: "Use lowpass filter to reduce noise",
    type: "boolean",
    default: false,
  })
  .option("n", {
    alias: "normalize",
    describe: "Normalize image colour for consistency",
    type: "boolean",
    default: true,
  })
  .option("g", {
    alias: "grayScale",
    describe: "Transform image to grayscale",
    type: "boolean",
    default: false,
  })
  .option("w", {
    alias: "width",
    describe: "Output image width",
    type: "number",
    coerce: (value) => {
      if (value !== undefined && value < 1) {
        throw new Error("width should not be lower than 1");
      }
      return Math.round(value);
    },
  })
  .option("h", {
    alias: "height",
    describe: "Output image height",
    type: "number",
    coerce: (value) => {
      if (value !== undefined && value < 1) {
        throw new Error("height should not be lower than 1");
      }
      return Math.round(value);
    },
  }).argv as unknown as Options;

// Invoke image processing with the parsed options
processImage(options);
