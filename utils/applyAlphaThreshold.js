"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAlphaThreshold = void 0;
/**
 * Applies an alpha threshold to the given Jimp image.
 * Pixels with alpha values above the threshold become fully opaque (255),
 * while those below the threshold become fully transparent (0).
 */
function applyAlphaThreshold(image, alphaThreshold) {
    // ALPHA THRESHOLD
    const threshold = Math.round(alphaThreshold * 255); // Convert threshold to 0-255 range
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (_x, _y, idx) {
        const alpha = this.bitmap.data[idx + 3];
        this.bitmap.data[idx + 3] = alpha > threshold ? 255 : 0;
    });
}
exports.applyAlphaThreshold = applyAlphaThreshold;
