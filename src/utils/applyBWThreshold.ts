import * as Jimp from "jimp";

export function applyBWThreshold(image: Jimp): void {
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
