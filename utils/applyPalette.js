"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPalette = void 0;
const Jimp = require("jimp");
/**
 * Applies a custom color palette to the given Jimp image.
 */
function applyPalette(image, palette, definedPalettesV) {
    if (!definedPalettesV[palette]) {
        console.error(`${palette} not found in predefined palettes.`);
        return;
    }
    const chosenPalette = definedPalettesV[palette];
    // Apply the custom palette
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, _idx) {
        const pixelColor = Jimp.intToRGBA(this.getPixelColor(x, y));
        const closestColor = findClosestColor(pixelColor, chosenPalette);
        // Set the pixel to the closest color in the palette
        this.setPixelColor(Jimp.rgbaToInt(closestColor.r, closestColor.g, closestColor.b, pixelColor.a), x, y);
    });
}
exports.applyPalette = applyPalette;
// Function to find the closest color in the palette
function findClosestColor(targetColor, palette) {
    return palette.reduce((closest, current) => {
        const distanceTarget = Math.abs(targetColor.r - closest.r) +
            Math.abs(targetColor.g - closest.g) +
            Math.abs(targetColor.b - closest.b);
        const distanceCurrent = Math.abs(targetColor.r - current.r) +
            Math.abs(targetColor.g - current.g) +
            Math.abs(targetColor.b - current.b);
        return distanceCurrent < distanceTarget ? current : closest;
    });
}
