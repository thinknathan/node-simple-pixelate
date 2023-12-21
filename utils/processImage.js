"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const worker_threads_1 = require("worker_threads");
const definedPalettes_1 = require("./definedPalettes");
const applyAlphaThreshold_1 = require("./applyAlphaThreshold");
const applyAtkinsonDithering_1 = require("./applyAtkinsonDithering");
const applyBayerDithering_1 = require("./applyBayerDithering");
const applyBWThreshold_1 = require("./applyBWThreshold");
const applyLowPassFilter_1 = require("./applyLowPassFilter");
const applyPalette_1 = require("./applyPalette");
const applyMedianCut_1 = require("./applyMedianCut");
/**
 * Processes the given image with various image manipulation options.
 *
 * @param options - Image processing options.
 * @param skipExtCheck - (Optional) Skips extension check if set to true.
 */
function processImage(options, skipExtCheck) {
    const { filename, scale, afterScale, cubic, pixelSize, ditherAlgo, alphaThreshold, colorLimit, palette, customPalette, randomColor, lowPass, normalize, grayScale, contrast, width, height, } = options;
    if (filename) {
        Jimp.read(filename, (err, image) => {
            if (err && skipExtCheck) {
                console.error(err);
            }
            else {
                // Continue if image is successfully read
                if (image) {
                    continueProcessing(image, scale, afterScale, cubic, pixelSize, ditherAlgo, alphaThreshold, colorLimit, palette, customPalette, randomColor, lowPass, normalize, grayScale, contrast, width, height, filename);
                    return;
                }
            }
        });
    }
    if (skipExtCheck) {
        return;
    }
    // Check for supported image formats if skipExtCheck is false
    const supportedFormats = ['.png', '.gif', '.jpg', '.jpeg'];
    let foundImage = false;
    // Attempt to read the image with different extensions
    supportedFormats.forEach((ext) => {
        const fullFilename = filename + ext;
        if (!foundImage) {
            Jimp.read(fullFilename, (err, image) => {
                if (!foundImage && !err) {
                    foundImage = true;
                    continueProcessing(image, scale, afterScale, cubic, pixelSize, ditherAlgo, alphaThreshold, colorLimit, palette, customPalette, randomColor, lowPass, normalize, grayScale, contrast, width, height, fullFilename);
                }
            });
        }
    });
}
exports.processImage = processImage;
function continueProcessing(image, scale, afterScale, cubic, pixelSize, ditherAlgo, alphaThreshold, colorLimit, palette, customPalette, randomColor, lowPass, normalize, grayScale, contrast, width, height, inputFilename) {
    // RESIZE
    if (width || height) {
        image.resize(width ? width : Jimp.AUTO, height ? height : Jimp.AUTO, cubic ? Jimp.RESIZE_BICUBIC : Jimp.RESIZE_BILINEAR);
    }
    else if (scale !== 1) {
        image.scale(scale, cubic ? Jimp.RESIZE_BICUBIC : Jimp.RESIZE_BILINEAR);
    }
    // NORMALIZE
    if (normalize) {
        image.normalize();
    }
    // CONTRAST
    if (contrast !== 0) {
        image.contrast(contrast);
    }
    // LOW PASS
    if (lowPass) {
        (0, applyLowPassFilter_1.applyLowPassFilter)(image);
    }
    // OPACITY
    (0, applyAlphaThreshold_1.applyAlphaThreshold)(image, alphaThreshold);
    // GRAYSCALE
    // Skip if colorLimit is 2 because of a special case handled later
    const doBWThreshold = grayScale && colorLimit === 2;
    if (grayScale && !doBWThreshold) {
        image.greyscale();
    }
    // DITHERING
    // Wait to apply atkinson if we're sampling our own palette
    const doAtkinsonLate = !customPalette && !palette && !doBWThreshold;
    if (ditherAlgo === 'floyd') {
        image.dither565();
    }
    else if (ditherAlgo === 'atkinson' && !doAtkinsonLate) {
        (0, applyAtkinsonDithering_1.applyAtkinsonDithering)(image);
    }
    else if (ditherAlgo === 'bayer') {
        (0, applyBayerDithering_1.applyBayerDithering)(image);
    }
    // PIXELATE
    if (pixelSize > 0) {
        image.pixelate(pixelSize);
    }
    const customPaletteName = 'CUSTOM';
    if (customPalette) {
        // USER-DEFINED PALETTE
        definedPalettes_1.definedPalettes[customPaletteName] = customPalette;
        (0, applyPalette_1.applyPalette)(image, customPaletteName, definedPalettes_1.definedPalettes);
    }
    else if (palette) {
        // PREDEFINED PALETTE
        (0, applyPalette_1.applyPalette)(image, palette, definedPalettes_1.definedPalettes);
    }
    else {
        // DYNAMIC COLOUR LIMIT
        // Use black/white threshold
        if (doBWThreshold) {
            (0, applyBWThreshold_1.applyBWThreshold)(image);
        }
        else {
            definedPalettes_1.definedPalettes[customPaletteName] = (0, applyMedianCut_1.applyMedianCut)(image, colorLimit, randomColor);
            (0, applyPalette_1.applyPalette)(image, customPaletteName, definedPalettes_1.definedPalettes);
            // Apply atkinson late in the run after applying palette
            if (ditherAlgo === 'atkinson' && doAtkinsonLate) {
                (0, applyAtkinsonDithering_1.applyAtkinsonDithering)(image);
            }
        }
    }
    if (!(width || height) && afterScale !== 1) {
        image.scale(afterScale, Jimp.RESIZE_NEAREST_NEIGHBOR);
    }
    const outputFolder = 'output';
    // Create a folder for output if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }
    // Incorporate the input filename into the output filename
    const baseFilename = path.basename(inputFilename, path.extname(inputFilename));
    let outputFilename = `${outputFolder}/${baseFilename}-d_${ditherAlgo}`;
    if (customPalette) {
        outputFilename = `${outputFilename}-o_custom`;
    }
    else if (palette) {
        outputFilename = `${outputFilename}-p_${palette}`;
    }
    else {
        outputFilename = `${outputFilename}-c_${colorLimit}`;
    }
    if (grayScale) {
        outputFilename = `${outputFilename}-g`;
    }
    if (lowPass) {
        outputFilename = `${outputFilename}-l`;
    }
    if (pixelSize > 0) {
        outputFilename = `${outputFilename}-z_${pixelSize}`;
    }
    outputFilename = `${outputFilename}.png`;
    image.write(outputFilename);
    console.log(`Image saved: ${outputFilename}`);
}
// If used as a worker thread, get file name from message
if (!worker_threads_1.isMainThread) {
    const { filePath, options } = worker_threads_1.workerData;
    options.filename = filePath;
    processImage(options, true);
}
