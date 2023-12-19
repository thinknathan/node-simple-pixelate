"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAtkinsonDithering = void 0;
const Jimp = require("jimp");
function applyAtkinsonDithering(image) {
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
            image.setPixelColor(Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a), x, y);
            const quantErrorR = oldColor.r - newColor.r;
            const quantErrorG = oldColor.g - newColor.g;
            const quantErrorB = oldColor.b - newColor.b;
            // Distribute the error to neighboring pixels
            distributeError(image, x + 1, y, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
            distributeError(image, x + 2, y, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
            distributeError(image, x - 1, y + 1, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
            distributeError(image, x, y + 1, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
            distributeError(image, x + 1, y + 1, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
            distributeError(image, x, y + 2, quantErrorR, quantErrorG, quantErrorB, 1 / 8);
        }
    }
}
exports.applyAtkinsonDithering = applyAtkinsonDithering;
function distributeError(image, x, y, quantErrorR, quantErrorG, quantErrorB, factor) {
    const oldColor = Jimp.intToRGBA(image.getPixelColor(x, y));
    const newColor = {
        r: clamp(oldColor.r + quantErrorR * factor, 0, 255),
        g: clamp(oldColor.g + quantErrorG * factor, 0, 255),
        b: clamp(oldColor.b + quantErrorB * factor, 0, 255),
        a: oldColor.a,
    };
    image.setPixelColor(Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a), x, y);
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
