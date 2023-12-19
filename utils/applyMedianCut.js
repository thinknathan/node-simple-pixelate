"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMedianCut = void 0;
const Jimp = require("jimp");
function applyMedianCut(image, colorLimit) {
    const pixels = [];
    // Collect all pixels from the image
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const pixelColor = Jimp.intToRGBA(this.getPixelColor(x, y));
        pixels.push({
            r: pixelColor.r,
            g: pixelColor.g,
            b: pixelColor.b,
        });
    });
    // Recursive function to split the color space
    function recursiveMedianCut(pixelArray, depth) {
        if (depth === 0 || pixelArray.length <= colorLimit) {
            // Average color of pixels in the current cube
            const averageColor = pixelArray.reduce((acc, pixel) => ({
                r: acc.r + pixel.r,
                g: acc.g + pixel.g,
                b: acc.b + pixel.b,
            }), { r: 0, g: 0, b: 0 });
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
        const randomAxis = ["r", "g", "b"][Math.floor(Math.random() * 3)];
        // Sort the channel values for the chosen axis
        const sortedChannel = pixelArray
            .map((pixel) => pixel[randomAxis])
            .sort((a, b) => a - b);
        const medianIndex = Math.floor(sortedChannel.length / 2);
        // Split the pixel array into two halves based on the chosen axis
        const firstHalf = pixelArray.filter((pixel) => pixel[randomAxis] <= sortedChannel[medianIndex]);
        const secondHalf = pixelArray.filter((pixel) => pixel[randomAxis] > sortedChannel[medianIndex]);
        // Recursively process both halves
        const firstHalfColors = recursiveMedianCut(firstHalf, depth - 1);
        const secondHalfColors = recursiveMedianCut(secondHalf, depth - 1);
        // Combine and return the colors from both halves
        return [...firstHalfColors, ...secondHalfColors];
    }
    // Perform median cut and get the reduced color palette
    const colorPalette = recursiveMedianCut(pixels, Math.ceil(Math.log2(colorLimit)));
    // Output the color palette in the specified format
    const formattedPalette = colorPalette.map((color) => ({
        r: color.r,
        g: color.g,
        b: color.b,
        // You can add color names or any other information here if needed
    }));
    return formattedPalette;
}
exports.applyMedianCut = applyMedianCut;
