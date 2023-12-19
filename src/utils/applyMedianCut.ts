import * as Jimp from "jimp";

/**
 * Applies the Median Cut algorithm to reduce the color palette of the given Jimp image.
 * Returns an array of representative colors based on the specified color limit.
 *
 * @returns An array of Color objects representing the reduced color palette.
 */
export function applyMedianCut(
  image: Jimp,
  colorLimit: number,
  useRandom: boolean,
): Color[] {
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
  function recursiveMedianCut(
    pixelArray: Color[],
    depth: number,
    random: boolean,
  ): Color[] {
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

    // Choose the axis to split (randomly or deterministically)
    const chosenAxis = random
      ? (["r", "g", "b"] as const)[Math.floor(Math.random() * 3)]
      : determineAxis(pixelArray);

    // Sort the channel values for the chosen axis
    const sortedChannel = pixelArray
      .map((pixel) => pixel[chosenAxis])
      .sort((a, b) => a - b);

    const medianIndex = Math.floor(sortedChannel.length / 2);

    // Split the pixel array into two halves based on the chosen axis
    const firstHalf = pixelArray.filter(
      (pixel) => pixel[chosenAxis] <= sortedChannel[medianIndex],
    );
    const secondHalf = pixelArray.filter(
      (pixel) => pixel[chosenAxis] > sortedChannel[medianIndex],
    );

    // Recursively process both halves
    const firstHalfColors = recursiveMedianCut(firstHalf, depth - 1, random);
    const secondHalfColors = recursiveMedianCut(secondHalf, depth - 1, random);

    // Combine and return the colors from both halves
    return [...firstHalfColors, ...secondHalfColors];
  }

  // Determine the axis based on the average channel value
  function determineAxis(pixelArray: Color[]): ColorKey {
    const averageValues = {
      r:
        pixelArray.reduce((sum, pixel) => sum + pixel.r, 0) / pixelArray.length,
      g:
        pixelArray.reduce((sum, pixel) => sum + pixel.g, 0) / pixelArray.length,
      b:
        pixelArray.reduce((sum, pixel) => sum + pixel.b, 0) / pixelArray.length,
    };

    // Find the axis with the maximum average value
    const chosenAxis = Object.keys(averageValues).reduce((a, b) =>
      averageValues[a as ColorKey] > averageValues[b as ColorKey] ? a : b,
    ) as ColorKey;

    return chosenAxis;
  }

  // Perform median cut and get the reduced color palette
  const colorPalette = recursiveMedianCut(
    pixels,
    Math.ceil(Math.log2(colorLimit)),
    useRandom,
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
