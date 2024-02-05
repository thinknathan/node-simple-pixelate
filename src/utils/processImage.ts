import * as Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';
import { parentPort, isMainThread } from 'worker_threads';

import { definedPalettes } from './definedPalettes';
import { applyAlphaThreshold } from './applyAlphaThreshold';
import { applyAtkinsonDithering } from './applyAtkinsonDithering';
import { applyBayerDithering } from './applyBayerDithering';
import { applyBWThreshold } from './applyBWThreshold';
import { applyLowPassFilter } from './applyLowPassFilter';
import { applyPalette } from './applyPalette';
import { applyMedianCut } from './applyMedianCut';

function errorCallback(err: unknown) {
	if (err) {
		console.error(err);
	}
}

/**
 * Processes the given image with various image manipulation options.
 *
 * @param options - Image processing options.
 * @param skipExtCheck - (Optional) Skips extension check if set to true.
 */
export function processImage(options: Options, skipExtCheck?: boolean): void {
	const { filename } = options;
	Jimp.read(filename!)
		.then((image) => {
			// Continue if image is successfully read
			if (image) {
				skipExtCheck = true;
				continueProcessing(image, options);
			}
		})
		.catch((err) => {
			if (skipExtCheck) {
				console.error(err);
			}
		})
		.finally(() => {
			if (skipExtCheck) {
				return;
			}
			// Check for supported image formats if skipExtCheck is false
			const supportedFormats = ['.png', '.gif', '.jpg', '.jpeg'];
			let foundImage = false;

			// Attempt to read the image with different extensions
			const promises = supportedFormats.map((ext) => {
				const fullFilename = filename + ext;
				return (
					Jimp.read(fullFilename)
						.then((image) => {
							foundImage = true;
							continueProcessing(image, options);
						})
						// Silence errors since we'll handle them later
						.catch(() => {})
				);
			});

			// Wait for all promises to be resolved
			Promise.all(promises)
				.then(() => {
					if (!foundImage) {
						console.error(`Error: Could not find ${filename}`);
					}
				})
				.catch(errorCallback);
		});
}

function continueProcessing(image: Jimp, options: Options): void {
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
	const baseFilename = path.basename(filename!, path.extname(filename!));
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

	image.write(outputFilename, errorCallback);
	console.log(`Image saved: ${outputFilename}`);
}

// If used as a worker thread, get file name from message
if (!isMainThread) {
	const workIsDone = () => parentPort?.postMessage('complete');

	parentPort?.on(
		'message',
		async (message: { filePath: string; options: Options }) => {
			const { filePath, options } = message;
			options.filename = filePath;
			processImage(options, true);
			workIsDone();
		},
	);
}
