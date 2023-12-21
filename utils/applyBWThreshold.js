"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBWThreshold = void 0;
/**
 * Applies a black-and-white threshold to the given Jimp image.
 * Converts each pixel to either black or white based on luminance values.
 * Adjust the threshold to control the balance between black and white.
 */
function applyBWThreshold(image) {
    const threshold = 128;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (_x, _y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        // const alpha = this.bitmap.data[idx + 3];
        // Calculate luminance (a common method for grayscale conversion)
        const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
        // Set the pixel to black or white based on the threshold
        const newValue = luminance > threshold ? 255 : 0;
        // Set red, green, and blue channels to the new value
        this.bitmap.data[idx + 0] = newValue;
        this.bitmap.data[idx + 1] = newValue;
        this.bitmap.data[idx + 2] = newValue;
    });
}
exports.applyBWThreshold = applyBWThreshold;
