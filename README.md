# node-simple-pixelate

Command-line utility that pixelizes images to create pixel art. Inspired by [pyxelate](https://github.com/sedthh/pyxelate), but for Node.

## Install

1. Install [Nodejs](https://nodejs.org/en) or equivalent

2. Clone this project
   `git clone https://github.com/thinknathan/node-simple-pixelate`

3. Install dependencies
   `npm i`
   or
   `yarn`

## Usage

`node px.cjs`

### Options

```
-f, --filename        Input image filename                            [string]
-i, --folderPath      Input folder                                    [string]
-s, --scale           Scale the image up or down by this factor
                                                         [number] [default: 1]
-x, --contrast        Adjust contrast by a value between -1 and +1
                                                         [number] [default: 0]
-z, --pixelSize       Adjust blockiness by pixel size    [number] [default: 0]
-d, --ditherAlgo      Dithering algorithm: floyd, bayer, atkinson or none
   [string] [choices: "floyd", "bayer", "atkinson", "none"] [default: "none"]
-t, --alphaThreshold  Adjust transparent pixels to hide/show based on
                     threshold                        [number] [default: 0.6]
-c, --colorLimit      Limit number of colours            [number] [default: 8]
-p, --palette         Use a predefined custom palette
      [string] [choices: "APPLE_II_HI", "GAMEBOY_ORIGINAL", "GAMEBOY_COMBO_UP",
            "GAMEBOY_COMBO_DOWN", "GAMEBOY_COMBO_LEFT", "GAMEBOY_COMBO_RIGHT",
         "GAMEBOY_A_UP", "GAMEBOY_A_DOWN", "GAMEBOY_A_LEFT", "GAMEBOY_A_RIGHT",
         "GAMEBOY_B_UP", "GAMEBOY_B_DOWN", "GAMEBOY_B_LEFT", "GAMEBOY_B_RIGHT",
               "GAMEBOY_POCKET", "GAMEBOY_VIRTUALBOY", "TELETEXT", "BBC_MICRO",
         "CGA_MODE4_PAL1", "CGA_MODE5_PAL1", "CGA_MODE4_PAL2", "ZX_SPECTRUM",
"APPLE_II_LO", "COMMODORE_64", "MICROSOFT_WINDOWS_16", "MICROSOFT_WINDOWS_20",
         "PICO_8", "MSX", "MONO_OBRADINN_IBM", "MONO_OBRADINN_MAC", "MONO_BJG",
                     "MONO_BW", "MONO_PHOSPHOR_AMBER", "MONO_PHOSPHOR_LTAMBER",
      "MONO_PHOSPHOR_GREEN1", "MONO_PHOSPHOR_GREEN2", "MONO_PHOSPHOR_GREEN3",
               "MONO_PHOSPHOR_APPLE", "APPLE_II_MONO", "MONO_PHOSPHOR_APPLEC",
      "APPLE_II_MONOC", "MICROSOFT_WINDOWS_PAINT", "AMSTRAD_CPC", "ATARI_2600",
                                    "ATARI_5200", "ATARI_7800", "ATARI_LYNX"]
-o, --customPalette   Custom palette in the format [[r, g, b], [r, g, b], ...]
                                                                        [array]
-l, --lowPass         Use lowpass filter to reduce noise
                                                   [boolean] [default: false]
-r, --randomColor     Use randomness when reducing palette to colorLimit
                                                      [boolean] [default: true]
-n, --normalize       Normalize image colour for consistency
                                                      [boolean] [default: true]
-g, --grayScale       Transform image to grayscale  [boolean] [default: false]
-w, --width           Output image width                              [number]
-h, --height          Output image height                             [number]
```

## Background

Created with Chat-GPT 3.5.
