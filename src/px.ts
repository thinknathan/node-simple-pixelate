#!/usr/bin/env node

import * as yargs from 'yargs';
import * as os from 'os';

import { processImage } from './utils/processImage';
import { processPath } from './utils/processPath';

function main() {
	// Parse command line arguments
	const options = yargs
		.option('f', {
			alias: 'filename',
			describe: 'Input image filename',
			type: 'string',
		})
		.option('i', {
			alias: 'folderPath',
			describe: 'Input folder',
			type: 'string',
		})
		.option('s', {
			alias: 'scale',
			describe: 'Scale the image up or down by this factor',
			type: 'number',
			default: 1,
			coerce: (value) => {
				if (value <= 0) {
					throw new Error('scale should be > 0');
				}
				return value;
			},
		})
		.option('a', {
			alias: 'afterScale',
			describe: 'Rescale the image up or down by this factor, as the last step',
			type: 'number',
			default: 1,
			coerce: (value) => {
				if (value <= 0) {
					throw new Error('scale should be > 0');
				}
				return value;
			},
		})
		.option('x', {
			alias: 'contrast',
			describe: 'Adjust contrast by a value between -1 and +1',
			type: 'number',
			default: 0,
			coerce: (value) => {
				if (value < -1 || value > 1) {
					throw new Error('contrast should be between -1 and 1');
				}
				return value;
			},
		})
		.option('z', {
			alias: 'pixelSize',
			describe: 'Adjust blockiness by pixel size',
			type: 'number',
			default: 0,
			coerce: (value) => {
				if (value < 0) {
					throw new Error('pixelSize should not be lower than 0');
				}
				return Math.round(value);
			},
		})
		.option('d', {
			alias: 'ditherAlgo',
			describe: 'Dithering algorithm: floyd, bayer, atkinson or none',
			type: 'string',
			default: 'none',
			choices: ['floyd', 'bayer', 'atkinson', 'none'],
		})
		.option('t', {
			alias: 'alphaThreshold',
			describe: 'Adjust transparent pixels to hide/show based on threshold',
			type: 'number',
			default: 0.6,
			coerce: (value) => {
				if (value < 0.000001 || value > 0.999999) {
					throw new Error('alphaThreshold should be a range > 0 and < 1');
				}
				return value;
			},
		})
		.option('c', {
			alias: 'colorLimit',
			describe: 'Limit number of colours',
			type: 'number',
			default: 8,
			coerce: (value) => {
				if (value < 2) {
					throw new Error('colorLimit should not be lower than 2');
				}
				return Math.round(value);
			},
		})
		.option('p', {
			alias: 'palette',
			describe: 'Use a predefined custom palette',
			type: 'string',
			choices: [
				'APPLE_II_HI',
				'GAMEBOY_ORIGINAL',
				'GAMEBOY_COMBO_UP',
				'GAMEBOY_COMBO_DOWN',
				'GAMEBOY_COMBO_LEFT',
				'GAMEBOY_COMBO_RIGHT',
				'GAMEBOY_A_UP',
				'GAMEBOY_A_DOWN',
				'GAMEBOY_A_LEFT',
				'GAMEBOY_A_RIGHT',
				'GAMEBOY_B_UP',
				'GAMEBOY_B_DOWN',
				'GAMEBOY_B_LEFT',
				'GAMEBOY_B_RIGHT',
				'GAMEBOY_POCKET',
				'GAMEBOY_VIRTUALBOY',
				'TELETEXT',
				'BBC_MICRO',
				'CGA_MODE4_PAL1',
				'CGA_MODE5_PAL1',
				'CGA_MODE4_PAL2',
				'ZX_SPECTRUM',
				'APPLE_II_LO',
				'COMMODORE_64',
				'MICROSOFT_WINDOWS_16',
				'MICROSOFT_WINDOWS_20',
				'PICO_8',
				'MSX',
				'MONO_OBRADINN_IBM',
				'MONO_OBRADINN_MAC',
				'MONO_BJG',
				'MONO_BW',
				'MONO_PHOSPHOR_AMBER',
				'MONO_PHOSPHOR_LTAMBER',
				'MONO_PHOSPHOR_GREEN1',
				'MONO_PHOSPHOR_GREEN2',
				'MONO_PHOSPHOR_GREEN3',
				'MONO_PHOSPHOR_APPLE',
				'APPLE_II_MONO',
				'MONO_PHOSPHOR_APPLEC',
				'APPLE_II_MONOC',
				'MICROSOFT_WINDOWS_PAINT',
				'AMSTRAD_CPC',
				'ATARI_2600',
				'ATARI_5200',
				'ATARI_7800',
				'ATARI_LYNX',
			],
		})
		.option('o', {
			alias: 'customPalette',
			describe: 'Custom palette in the format [[r, g, b], [r, g, b], ...]',
			type: 'array',
			coerce: (value) => {
				// Convert the string to a proper array representation
				const parsedArray = JSON.parse(`[${value.join('')}]`).pop();

				// Validate the format and range of values
				if (
					Array.isArray(parsedArray) &&
					parsedArray.every(
						(color) =>
							Array.isArray(color) &&
							color.length === 3 &&
							color.every(
								(channel) =>
									typeof channel === 'number' && channel >= 0 && channel <= 255,
							),
					)
				) {
					parsedArray.map((color) =>
						color.map((channel: number) => Math.round(channel)),
					);
					return parsedArray.map((color) => ({
						r: color[0],
						g: color[1],
						b: color[2],
					}));
				} else {
					throw new Error(
						'Invalid customPalette format. It should be an array of arrays, each containing three numbers in the range 0 to 255.',
					);
				}
			},
		})
		.option('l', {
			alias: 'lowPass',
			describe: 'Use lowpass filter to reduce noise',
			type: 'boolean',
			default: false,
		})
		.option('u', {
			alias: 'cubic',
			describe:
				'Uses bicubic interpolation instead of bilinear for initial resizing',
			type: 'boolean',
			default: true,
		})
		.option('r', {
			alias: 'randomColor',
			describe: 'Use randomness when reducing palette to colorLimit',
			type: 'boolean',
			default: true,
		})
		.option('n', {
			alias: 'normalize',
			describe: 'Normalize image colour for consistency',
			type: 'boolean',
			default: true,
		})
		.option('g', {
			alias: 'grayScale',
			describe: 'Transform image to grayscale',
			type: 'boolean',
			default: false,
		})
		.option('w', {
			alias: 'width',
			describe: 'Output image width',
			type: 'number',
			coerce: (value) => {
				if (value !== undefined && value < 1) {
					throw new Error('width should not be lower than 1');
				}
				return Math.round(value);
			},
		})
		.option('h', {
			alias: 'height',
			describe: 'Output image height',
			type: 'number',
			coerce: (value) => {
				if (value !== undefined && value < 1) {
					throw new Error('height should not be lower than 1');
				}
				return Math.round(value);
			},
		}).argv as unknown as Options;

	if (options.filename) {
		// Process a single image
		processImage(options);
	} else if (options.folderPath) {
		// Process all images in a folder, splitting the task into threads
		let numCores = 2;
		try {
			numCores = os.cpus().length;
		} catch (err) {
			console.error(err);
		}
		numCores = Math.max(numCores - 1, 1);
		processPath(options.folderPath, options, numCores);
	} else {
		console.log(
			'Requires either `filename` or `folderPath`. Run `px --help` for help.',
		);
	}
}

main();
