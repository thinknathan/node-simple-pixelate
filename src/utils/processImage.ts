import * as Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';
import { workerData, isMainThread } from 'worker_threads';

import { definedPalettes } from './definedPalettes';
import { applyAlphaThreshold } from './applyAlphaThreshold';
import { applyAtkinsonDithering } from './applyAtkinsonDithering';
import { applyBayerDithering } from './applyBayerDithering';
import { applyBWThreshold } from './applyBWThreshold';
import { applyLowPassFilter } from './applyLowPassFilter';
import { applyPalette } from './applyPalette';
import { applyMedianCut } from './applyMedianCut';

/**
 * Processes the given image with various image manipulation options.
 *
 * @param options - Image processing options.
 * @param skipExtCheck - (Optional) Skips extension check if set to true.
 */
export function processImage(options: Options, skipExtCheck?: boolean): void {
	const {
		filename,
		scale,
		afterScale,
		cubic,
		pixelSize,
		ditherAlgo,
		alphaThreshold,
		colorLimit,
		palette,
		customPalette,
		randomColor,
		lowPass,
		normalize,
		grayScale,
		contrast,
		width,
		height,
	} = options;

	if (filename) {
		Jimp.read(filename, (err, image) => {
			if (err && skipExtCheck) {
				console.error(err);
			} else {
				// Continue if image is successfully read
				if (image) {
					continueProcessing(
						image,
						scale,
						afterScale,
						cubic,
						pixelSize,
						ditherAlgo,
						alphaThreshold,
						colorLimit,
						palette,
						customPalette,
						randomColor,
						lowPass,
						normalize,
						grayScale,
						contrast,
						width,
						height,
						filename,
					);
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
					continueProcessing(
						image,
						scale,
						afterScale,
						cubic,
						pixelSize,
						ditherAlgo,
						alphaThreshold,
						colorLimit,
						palette,
						customPalette,
						randomColor,
						lowPass,
						normalize,
						grayScale,
						contrast,
						width,
						height,
						fullFilename,
					);
				}
			});
		}
	});

	if (foundImage === false) {
		throw new Error(`Could not find ${filename}`);
	}
}

function continueProcessing(
	image: Jimp,
	scale: number,
	afterScale: number,
	cubic: boolean,
	pixelSize: number,
	ditherAlgo: string,
	alphaThreshold: number,
	colorLimit: number,
	palette: string | undefined,
	customPalette: Color[] | undefined,
	randomColor: boolean,
	lowPass: boolean,
	normalize: boolean,
	grayScale: boolean,
	contrast: number,
	width: number | undefined,
	height: number | undefined,
	inputFilename: string,
): void {
	// RESIZE
	if (width || height) {
		image.resize(
			width ? width : Jimp.AUTO,
			height ? height : Jimp.AUTO,
			cubic ? Jimp.RESIZE_BICUBIC : Jimp.RESIZE_BILINEAR,
		);
	} else if (scale !== 1) {
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
		applyLowPassFilter(image);
	}

	// OPACITY
	applyAlphaThreshold(image, alphaThreshold);

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
	} else if (ditherAlgo === 'atkinson' && !doAtkinsonLate) {
		applyAtkinsonDithering(image);
	} else if (ditherAlgo === 'bayer') {
		applyBayerDithering(image);
	}

	// PIXELATE
	if (pixelSize > 0) {
		image.pixelate(pixelSize);
	}

	const customPaletteName = 'CUSTOM';
	if (customPalette) {
		// USER-DEFINED PALETTE
		definedPalettes[customPaletteName] = customPalette;
		applyPalette(image, customPaletteName, definedPalettes);
	} else if (palette) {
		// PREDEFINED PALETTE
		applyPalette(image, palette, definedPalettes);
	} else {
		// DYNAMIC COLOUR LIMIT
		// Use black/white threshold
		if (doBWThreshold) {
			applyBWThreshold(image);
		} else {
			definedPalettes[customPaletteName] = applyMedianCut(
				image,
				colorLimit,
				randomColor,
			);
			applyPalette(image, customPaletteName, definedPalettes);
			// Apply atkinson late in the run after applying palette
			if (ditherAlgo === 'atkinson' && doAtkinsonLate) {
				applyAtkinsonDithering(image);
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
	const baseFilename = path.basename(
		inputFilename,
		path.extname(inputFilename),
	);
	let outputFilename = `${outputFolder}/${baseFilename}-d_${ditherAlgo}`;
	if (customPalette) {
		outputFilename = `${outputFilename}-o_custom`;
	} else if (palette) {
		outputFilename = `${outputFilename}-p_${palette}`;
	} else {
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
if (!isMainThread) {
	const { filePath, options } = workerData;
	options.filename = filePath;
	processImage(options, true);
}
