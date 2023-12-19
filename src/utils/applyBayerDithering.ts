import * as Jimp from "jimp";

export function applyBayerDithering(image: Jimp) {
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
