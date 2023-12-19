"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLowPassFilter = void 0;
const Jimp = require("jimp");
/**
 * Applies a low-pass filter to the given Jimp image.
 * Smoothens the image by averaging the colors of neighboring pixels.
 */
function applyLowPassFilter(image) {
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
            image.setPixelColor(Jimp.rgbaToInt(averageColor.r, averageColor.g, averageColor.b, averageColor.a), x, y);
        }
    }
}
exports.applyLowPassFilter = applyLowPassFilter;
