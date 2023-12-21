// Adapted from Pyxelate
// @link https://github.com/sedthh/pyxelate/blob/master/pyxelate/pal.py
// @license MIT

const APPLE_II_HI = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 136, g: 0, b: 0 }, // Red
	{ r: 170, g: 255, b: 238 }, // Cyan
	{ r: 204, g: 68, b: 204 }, // Purple
	{ r: 0, g: 204, b: 85 }, // Green
	{ r: 0, g: 0, b: 170 }, // Blue
	{ r: 238, g: 238, b: 119 }, // Yellow
	{ r: 221, g: 136, b: 85 }, // Orange
	{ r: 102, g: 68, b: 0 }, // Brown
	{ r: 255, g: 119, b: 119 }, // Light Red
	{ r: 51, g: 51, b: 51 }, // Dark Gray
	{ r: 119, g: 119, b: 119 }, // Gray
	{ r: 170, g: 255, b: 102 }, // Light Green
	{ r: 0, g: 136, b: 255 }, // Light Blue
	{ r: 187, g: 187, b: 187 }, // Light Gray
] as const;

const GAMEBOY_ORIGINAL = [
	{ r: 155, g: 188, b: 15 }, // Light Green
	{ r: 139, g: 172, b: 15 }, // Dark Green
	{ r: 48, g: 98, b: 48 }, // Dark Gray
	{ r: 15, g: 56, b: 15 }, // Black
] as const;

const GAMEBOY_COMBO_UP = [
	{ r: 4, g: 2, b: 4 },
	{ r: 133, g: 66, b: 4 },
	{ r: 236, g: 154, b: 84 },
	{ r: 253, g: 253, b: 253 },
] as const;

const GAMEBOY_COMBO_DOWN = [
	{ r: 4, g: 2, b: 4 },
	{ r: 156, g: 146, b: 245 },
	{ r: 236, g: 138, b: 140 },
	{ r: 253, g: 253, b: 172 },
] as const;

const GAMEBOY_COMBO_LEFT = [
	{ r: 4, g: 2, b: 4 },
	{ r: 4, g: 50, b: 252 },
	{ r: 124, g: 170, b: 252 },
	{ r: 253, g: 253, b: 253 },
	{ r: 173, g: 38, b: 36 },
	{ r: 236, g: 138, b: 140 },
	{ r: 76, g: 138, b: 4 },
	{ r: 4, g: 250, b: 4 },
] as const;

const GAMEBOY_COMBO_RIGHT = [
	{ r: 4, g: 2, b: 4 },
	{ r: 252, g: 38, b: 4 },
	{ r: 4, g: 250, b: 4 },
	{ r: 253, g: 253, b: 253 },
] as const;

const GAMEBOY_A_UP = [
	{ r: 4, g: 2, b: 4 },
	{ r: 173, g: 38, b: 36 },
	{ r: 236, g: 138, b: 140 },
	{ r: 253, g: 253, b: 253 },
	{ r: 76, g: 138, b: 4 },
	{ r: 4, g: 250, b: 4 },
	{ r: 4, g: 50, b: 252 },
	{ r: 124, g: 170, b: 252 },
] as const;

const GAMEBOY_A_DOWN = [
	{ r: 4, g: 2, b: 4 },
	{ r: 252, g: 38, b: 4 },
	{ r: 242, g: 254, b: 4 },
	{ r: 253, g: 253, b: 253 },
] as const;

const GAMEBOY_A_LEFT = [
	{ r: 4, g: 2, b: 4 },
	{ r: 11, g: 7, b: 21 },
	{ r: 142, g: 133, b: 222 },
	{ r: 253, g: 253, b: 253 },
	{ r: 173, g: 38, b: 36 },
	{ r: 236, g: 138, b: 140 },
	{ r: 132, g: 138, b: 4 },
	{ r: 236, g: 154, b: 84 },
] as const;

const GAMEBOY_A_RIGHT = [
	{ r: 4, g: 2, b: 4 },
	{ r: 4, g: 50, b: 252 },
	{ r: 4, g: 250, b: 4 },
	{ r: 253, g: 253, b: 253 },
	{ r: 173, g: 38, b: 36 },
	{ r: 236, g: 138, b: 140 },
] as const;

const GAMEBOY_B_UP = [
	{ r: 76, g: 42, b: 4 },
	{ r: 148, g: 122, b: 76 },
	{ r: 196, g: 174, b: 148 },
	{ r: 252, g: 186, b: 182 },
	{ r: 0, g: 0, b: 0 },
	{ r: 133, g: 66, b: 4 },
	{ r: 236, g: 154, b: 84 },
] as const;

const GAMEBOY_B_DOWN = [
	{ r: 4, g: 2, b: 4 },
	{ r: 133, g: 66, b: 4 },
	{ r: 242, g: 254, b: 4 },
	{ r: 253, g: 253, b: 253 },
	{ r: 11, g: 50, b: 252 },
	{ r: 124, g: 170, b: 252 },
	{ r: 76, g: 138, b: 4 },
	{ r: 4, g: 250, b: 4 },
] as const;

const GAMEBOY_B_LEFT = [
	{ r: 4, g: 2, b: 4 },
	{ r: 116, g: 114, b: 116 },
	{ r: 188, g: 186, b: 188 },
	{ r: 252, g: 186, b: 182 },
] as const;

const GAMEBOY_B_RIGHT = [
	{ r: 252, g: 186, b: 182 },
	{ r: 242, g: 254, b: 4 },
	{ r: 11, g: 162, b: 164 },
	{ r: 4, g: 2, b: 4 },
] as const;

const GAMEBOY_POCKET = [
	{ r: 0, g: 0, b: 0 },
	{ r: 85, g: 85, b: 85 },
	{ r: 170, g: 170, b: 170 },
	{ r: 255, g: 255, b: 255 },
] as const;

const GAMEBOY_VIRTUALBOY = [
	{ r: 239, g: 0, b: 0 },
	{ r: 164, g: 0, b: 0 },
	{ r: 85, g: 0, b: 0 },
	{ r: 0, g: 0, b: 0 },
] as const;

const TELETEXT = [
	{ r: 0, g: 0, b: 0 },
	{ r: 255, g: 0, b: 0 },
	{ r: 0, g: 128, b: 0 },
	{ r: 255, g: 255, b: 0 },
	{ r: 0, g: 0, b: 255 },
	{ r: 255, g: 0, b: 255 },
	{ r: 0, g: 255, b: 255 },
	{ r: 255, g: 255, b: 255 },
] as const;

const BBC_MICRO = TELETEXT;

const CGA_MODE4_PAL1 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 255, g: 255, b: 255 },
	{ r: 0, g: 255, b: 255 },
	{ r: 255, g: 0, b: 255 },
] as const;

const CGA_MODE5_PAL1 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 85, g: 255, b: 255 },
	{ r: 255, g: 85, b: 85 },
	{ r: 255, g: 255, b: 255 },
] as const;

const CGA_MODE4_PAL2 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 85, g: 255, b: 85 },
	{ r: 255, g: 85, b: 85 },
	{ r: 85, g: 255, b: 85 },
] as const;

const ZX_SPECTRUM = [
	{ r: 0, g: 0, b: 0 },
	{ r: 0, g: 39, b: 251 },
	{ r: 255, g: 48, b: 22 },
	{ r: 255, g: 63, b: 252 },
	{ r: 0, g: 249, b: 44 },
	{ r: 0, g: 252, b: 255 },
	{ r: 255, g: 253, b: 51 },
	{ r: 255, g: 255, b: 255 },
] as const;

const APPLE_II_LO = [
	{ r: 0, g: 0, b: 0 },
	{ r: 133, g: 59, b: 81 },
	{ r: 80, g: 71, b: 137 },
	{ r: 234, g: 93, b: 240 },
	{ r: 0, g: 104, b: 82 },
	{ r: 146, g: 146, b: 146 },
	{ r: 0, g: 168, b: 241 },
	{ r: 202, g: 195, b: 248 },
	{ r: 81, g: 92, b: 15 },
	{ r: 235, g: 127, b: 35 },
	{ r: 146, g: 146, b: 146 },
	{ r: 246, g: 186, b: 202 },
	{ r: 0, g: 202, b: 41 },
	{ r: 203, g: 211, b: 155 },
	{ r: 154, g: 220, b: 204 },
	{ r: 255, g: 255, b: 255 },
] as const;

const COMMODORE_64 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 255, g: 255, b: 255 },
	{ r: 161, g: 77, b: 67 },
	{ r: 106, g: 193, b: 200 },
	{ r: 162, g: 87, b: 165 },
	{ r: 92, g: 173, b: 95 },
	{ r: 79, g: 68, b: 156 },
	{ r: 203, g: 214, b: 137 },
	{ r: 163, g: 104, b: 58 },
	{ r: 110, g: 84, b: 11 },
	{ r: 204, g: 127, b: 118 },
	{ r: 99, g: 99, b: 99 },
	{ r: 139, g: 139, b: 139 },
	{ r: 155, g: 227, b: 157 },
	{ r: 138, g: 127, b: 206 },
	{ r: 175, g: 175, b: 175 },
] as const;

const MICROSOFT_WINDOWS_16 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 128, g: 0, b: 0 },
	{ r: 0, g: 128, b: 0 },
	{ r: 128, g: 128, b: 0 },
	{ r: 0, g: 0, b: 128 },
	{ r: 128, g: 0, b: 128 },
	{ r: 0, g: 128, b: 128 },
	{ r: 192, g: 192, b: 192 },
	{ r: 128, g: 128, b: 128 },
	{ r: 255, g: 0, b: 0 },
	{ r: 0, g: 255, b: 0 },
	{ r: 255, g: 255, b: 0 },
	{ r: 0, g: 0, b: 255 },
	{ r: 255, g: 0, b: 255 },
	{ r: 0, g: 255, b: 255 },
	{ r: 255, g: 255, b: 255 },
] as const;

const MICROSOFT_WINDOWS_20 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 128, g: 0, b: 0 },
	{ r: 0, g: 128, b: 0 },
	{ r: 128, g: 128, b: 0 },
	{ r: 0, g: 0, b: 128 },
	{ r: 128, g: 0, b: 128 },
	{ r: 0, g: 128, b: 128 },
	{ r: 192, g: 192, b: 192 },
	{ r: 192, g: 221, b: 192 },
	{ r: 166, g: 202, b: 240 },
	{ r: 255, g: 252, b: 240 },
	{ r: 159, g: 159, b: 164 },
	{ r: 128, g: 128, b: 128 },
	{ r: 255, g: 0, b: 0 },
	{ r: 0, g: 255, b: 0 },
	{ r: 255, g: 255, b: 0 },
	{ r: 0, g: 0, b: 255 },
	{ r: 255, g: 0, b: 255 },
	{ r: 0, g: 255, b: 255 },
	{ r: 255, g: 255, b: 255 },
] as const;

const PICO_8 = [
	{ r: 0, g: 0, b: 0 },
	{ r: 29, g: 43, b: 83 },
	{ r: 126, g: 37, b: 83 },
	{ r: 0, g: 170, b: 81 },
	{ r: 171, g: 82, b: 54 },
	{ r: 95, g: 87, b: 79 },
	{ r: 194, g: 195, b: 199 },
	{ r: 255, g: 242, b: 0 },
	{ r: 255, g: 0, b: 47 },
	{ r: 255, g: 163, b: 0 },
	{ r: 255, g: 236, b: 39 },
	{ r: 0, g: 228, b: 54 },
	{ r: 41, g: 173, b: 255 },
	{ r: 131, g: 118, b: 156 },
	{ r: 255, g: 119, b: 168 },
	{ r: 255, g: 204, b: 170 },
] as const;

const MSX = [
	{ r: 0, g: 0, b: 0 },
	{ r: 62, g: 184, b: 73 },
	{ r: 116, g: 209, b: 125 },
	{ r: 89, g: 85, b: 224 },
	{ r: 128, g: 118, b: 241 },
	{ r: 185, g: 94, b: 80 },
	{ r: 101, g: 219, b: 239 },
	{ r: 219, g: 101, b: 89 },
	{ r: 255, g: 137, b: 125 },
	{ r: 204, g: 195, b: 94 },
	{ r: 221, g: 212, b: 135 },
	{ r: 58, g: 162, b: 65 },
	{ r: 184, g: 104, b: 180 },
	{ r: 204, g: 204, b: 204 },
	{ r: 255, g: 255, b: 255 },
] as const;

const MONO_OBRADINN_IBM = [
	{ r: 46, g: 48, b: 55 },
	{ r: 235, g: 229, b: 206 },
] as const;

const MONO_OBRADINN_MAC = [
	{ r: 51, g: 51, b: 25 },
	{ r: 229, g: 255, b: 255 },
] as const;

const MONO_BJG = [
	{ r: 239, g: 255, b: 245 },
	{ r: 44, g: 15, b: 51 },
] as const;

const MONO_BW = [
	{ r: 0, g: 0, b: 0 },
	{ r: 255, g: 255, b: 255 },
] as const;

const MONO_PHOSPHOR_AMBER = [
	{ r: 40, g: 40, b: 40 },
	{ r: 255, g: 176, b: 0 },
] as const;

const MONO_PHOSPHOR_LTAMBER = [
	{ r: 40, g: 40, b: 40 },
	{ r: 255, g: 204, b: 0 },
] as const;

const MONO_PHOSPHOR_GREEN1 = [
	{ r: 40, g: 40, b: 40 },
	{ r: 51, g: 255, b: 0 },
] as const;

const MONO_PHOSPHOR_GREEN2 = [
	{ r: 40, g: 40, b: 40 },
	{ r: 0, g: 255, b: 51 },
] as const;

const MONO_PHOSPHOR_GREEN3 = [
	{ r: 40, g: 40, b: 40 },
	{ r: 0, g: 255, b: 102 },
] as const;

const MONO_PHOSPHOR_APPLE = [
	{ r: 40, g: 40, b: 40 },
	{ r: 51, g: 255, b: 51 },
] as const;
const APPLE_II_MONO = MONO_PHOSPHOR_APPLE;

const MONO_PHOSPHOR_APPLEC = [
	{ r: 40, g: 40, b: 40 },
	{ r: 102, g: 255, b: 102 },
] as const;
const APPLE_II_MONOC = MONO_PHOSPHOR_APPLEC;

const MICROSOFT_WINDOWS_PAINT = [
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 192, g: 192, b: 192 }, // Light Gray
	{ r: 128, g: 128, b: 128 }, // Gray
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 128, g: 0, b: 0 }, // Maroon
	{ r: 255, g: 0, b: 0 }, // Red
	{ r: 128, g: 128, b: 0 }, // Olive
	{ r: 255, g: 255, b: 0 }, // Yellow
	{ r: 0, g: 128, b: 0 }, // Green
	{ r: 0, g: 255, b: 0 }, // Lime
	{ r: 0, g: 128, b: 128 }, // Teal
	{ r: 0, g: 255, b: 255 }, // Aqua
	{ r: 0, g: 0, b: 128 }, // Navy
	{ r: 0, g: 0, b: 255 }, // Blue
	{ r: 128, g: 0, b: 128 }, // Purple
	{ r: 255, g: 0, b: 255 }, // Fuchsia
] as const;

const AMSTRAD_CPC = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 0, g: 0, b: 255 }, // Blue
	{ r: 255, g: 0, b: 0 }, // Red
	{ r: 255, g: 0, b: 255 }, // Magenta
	{ r: 0, g: 255, b: 0 }, // Green
	{ r: 0, g: 255, b: 255 }, // Cyan
	{ r: 255, g: 255, b: 0 }, // Yellow
	{ r: 255, g: 255, b: 255 }, // White
] as const;

const ATARI_2600 = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 132, g: 132, b: 132 }, // Light Gray
	{ r: 76, g: 76, b: 76 }, // Dark Gray
] as const;

const ATARI_5200 = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 132, g: 132, b: 132 }, // Light Gray
	{ r: 76, g: 76, b: 76 }, // Dark Gray
	{ r: 255, g: 0, b: 0 }, // Red
	{ r: 0, g: 255, b: 0 }, // Green
	{ r: 0, g: 0, b: 255 }, // Blue
	{ r: 255, g: 255, b: 0 }, // Yellow
] as const;

const ATARI_7800 = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 132, g: 132, b: 132 }, // Light Gray
	{ r: 76, g: 76, b: 76 }, // Dark Gray
	{ r: 255, g: 0, b: 0 }, // Red
	{ r: 0, g: 255, b: 0 }, // Green
	{ r: 0, g: 0, b: 255 }, // Blue
	{ r: 255, g: 255, b: 0 }, // Yellow
] as const;

const ATARI_LYNX = [
	{ r: 0, g: 0, b: 0 }, // Black
	{ r: 255, g: 255, b: 255 }, // White
	{ r: 132, g: 132, b: 132 }, // Light Gray
	{ r: 76, g: 76, b: 76 }, // Dark Gray
	{ r: 255, g: 0, b: 0 }, // Red
	{ r: 0, g: 255, b: 0 }, // Green
	{ r: 0, g: 0, b: 255 }, // Blue
	{ r: 255, g: 255, b: 0 }, // Yellow
] as const;

const definedPalettes: Record<string, Palette> = {
	APPLE_II_HI,
	GAMEBOY_ORIGINAL,
	GAMEBOY_COMBO_UP,
	GAMEBOY_COMBO_DOWN,
	GAMEBOY_COMBO_LEFT,
	GAMEBOY_COMBO_RIGHT,
	GAMEBOY_A_UP,
	GAMEBOY_A_DOWN,
	GAMEBOY_A_LEFT,
	GAMEBOY_A_RIGHT,
	GAMEBOY_B_UP,
	GAMEBOY_B_DOWN,
	GAMEBOY_B_LEFT,
	GAMEBOY_B_RIGHT,
	GAMEBOY_POCKET,
	GAMEBOY_VIRTUALBOY,
	TELETEXT,
	BBC_MICRO,
	CGA_MODE4_PAL1,
	CGA_MODE5_PAL1,
	CGA_MODE4_PAL2,
	ZX_SPECTRUM,
	APPLE_II_LO,
	COMMODORE_64,
	MICROSOFT_WINDOWS_16,
	MICROSOFT_WINDOWS_20,
	PICO_8,
	MSX,
	MONO_OBRADINN_IBM,
	MONO_OBRADINN_MAC,
	MONO_BJG,
	MONO_BW,
	MONO_PHOSPHOR_AMBER,
	MONO_PHOSPHOR_LTAMBER,
	MONO_PHOSPHOR_GREEN1,
	MONO_PHOSPHOR_GREEN2,
	MONO_PHOSPHOR_GREEN3,
	MONO_PHOSPHOR_APPLE,
	APPLE_II_MONO,
	MONO_PHOSPHOR_APPLEC,
	APPLE_II_MONOC,
	MICROSOFT_WINDOWS_PAINT,
	AMSTRAD_CPC,
	ATARI_2600,
	ATARI_5200,
	ATARI_7800,
	ATARI_LYNX,
};

export { definedPalettes };

// MIT License

// Copyright (c) 2021 Richard Nagyfi

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
