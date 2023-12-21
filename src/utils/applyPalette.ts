import * as Jimp from 'jimp';

import { type definedPalettes } from './definedPalettes';

/**
 * Applies a custom color palette to the given Jimp image.
 */
export function applyPalette(
	image: Jimp,
	palette: string,
	definedPalettesV: typeof definedPalettes,
): void {
	if (!definedPalettesV[palette]) {
		console.error(`Error: ${palette} not found in predefined palettes.`);
		return;
	}

	const chosenPalette = definedPalettesV[palette];

	// Apply the custom palette
	image.scan(
		0,
		0,
		image.bitmap.width,
		image.bitmap.height,
		function (x, y, _idx) {
			const pixelColor = Jimp.intToRGBA(this.getPixelColor(x, y));
			const closestColor = findClosestColor(pixelColor, chosenPalette);

			// Set the pixel to the closest color in the palette
			this.setPixelColor(
				Jimp.rgbaToInt(
					closestColor.r,
					closestColor.g,
					closestColor.b,
					pixelColor.a,
				),
				x,
				y,
			);
		},
	);
}

// Function to find the closest color in the palette
function findClosestColor(targetColor: Color, palette: Palette): Color {
	return palette.reduce((closest, current) => {
		const distanceTarget =
			Math.abs(targetColor.r - closest.r) +
			Math.abs(targetColor.g - closest.g) +
			Math.abs(targetColor.b - closest.b);
		const distanceCurrent =
			Math.abs(targetColor.r - current.r) +
			Math.abs(targetColor.g - current.g) +
			Math.abs(targetColor.b - current.b);
		return distanceCurrent < distanceTarget ? current : closest;
	});
}
