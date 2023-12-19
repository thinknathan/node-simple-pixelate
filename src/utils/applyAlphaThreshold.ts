import * as Jimp from "jimp";

export function applyAlphaThreshold(image: Jimp, alphaThreshold: number): void {
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
