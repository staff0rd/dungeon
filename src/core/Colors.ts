import { Random } from './Random'

export const Colors = {
    Red: { 
      C50: 0xFFEBEE, 
      C100: 0xFFCDD2, 
      C200: 0xEF9A9A, 
      C300: 0xE57373, 
      C400: 0xEF5350, 
      C500: 0xF44336, 
      C600: 0xE53935, 
      C700: 0xD32F2F, 
      C800: 0xC62828, 
      C900: 0xB71C1C, 
      A100: 0xFF8A80, 
      A200: 0xFF5252, 
      A400: 0xFF1744, 
      A700: 0xD50000, 
    },

    Pink: { 
      C50: 0xFCE4EC, 
      C100: 0xF8BBD0, 
      C200: 0xF48FB1, 
      C300: 0xF06292, 
      C400: 0xEC407A, 
      C500: 0xE91E63, 
      C600: 0xD81B60, 
      C700: 0xC2185B, 
      C800: 0xAD1457, 
      C900: 0x880E4F, 
      A100: 0xFF80AB, 
      A200: 0xFF4081, 
      A400: 0xF50057, 
      A700: 0xC51162, 
    },

    Purple: { 
      C50: 0xF3E5F5, 
      C100: 0xE1BEE7, 
      C200: 0xCE93D8, 
      C300: 0xBA68C8, 
      C400: 0xAB47BC, 
      C500: 0x9C27B0, 
      C600: 0x8E24AA, 
      C700: 0x7B1FA2, 
      C800: 0x6A1B9A, 
      C900: 0x4A148C, 
      A100: 0xEA80FC, 
      A200: 0xE040FB, 
      A400: 0xD500F9, 
      A700: 0xAA00FF, 
    },

    DeepPurple: { 
      C50: 0xEDE7F6, 
      C100: 0xD1C4E9, 
      C200: 0xB39DDB, 
      C300: 0x9575CD, 
      C400: 0x7E57C2, 
      C500: 0x673AB7, 
      C600: 0x5E35B1, 
      C700: 0x512DA8, 
      C800: 0x4527A0, 
      C900: 0x311B92, 
      A100: 0xB388FF, 
      A200: 0x7C4DFF, 
      A400: 0x651FFF, 
      A700: 0x6200EA, 
    },

    Indigo: { 
      C50: 0xE8EAF6, 
      C100: 0xC5CAE9, 
      C200: 0x9FA8DA, 
      C300: 0x7986CB, 
      C400: 0x5C6BC0, 
      C500: 0x3F51B5, 
      C600: 0x3949AB, 
      C700: 0x303F9F, 
      C800: 0x283593, 
      C900: 0x1A237E, 
      A100: 0x8C9EFF, 
      A200: 0x536DFE, 
      A400: 0x3D5AFE, 
      A700: 0x304FFE, 
    },

    Blue: { 
      C50: 0xE3F2FD, 
      C100: 0xBBDEFB, 
      C200: 0x90CAF9, 
      C300: 0x64B5F6, 
      C400: 0x42A5F5, 
      C500: 0x2196F3, 
      C600: 0x1E88E5, 
      C700: 0x1976D2, 
      C800: 0x1565C0, 
      C900: 0x0D47A1, 
      A100: 0x82B1FF, 
      A200: 0x448AFF, 
      A400: 0x2979FF, 
      A700: 0x2962FF, 
    },

    LightBlue: { 
      C50: 0xE1F5FE, 
      C100: 0xB3E5FC, 
      C200: 0x81D4FA, 
      C300: 0x4FC3F7, 
      C400: 0x29B6F6, 
      C500: 0x03A9F4, 
      C600: 0x039BE5, 
      C700: 0x0288D1, 
      C800: 0x0277BD, 
      C900: 0x01579B, 
      A100: 0x80D8FF, 
      A200: 0x40C4FF, 
      A400: 0x00B0FF, 
      A700: 0x0091EA, 
    },

    Cyan: { 
      C50: 0xE0F7FA, 
      C100: 0xB2EBF2, 
      C200: 0x80DEEA, 
      C300: 0x4DD0E1, 
      C400: 0x26C6DA, 
      C500: 0x00BCD4, 
      C600: 0x00ACC1, 
      C700: 0x0097A7, 
      C800: 0x00838F, 
      C900: 0x006064, 
      A100: 0x84FFFF, 
      A200: 0x18FFFF, 
      A400: 0x00E5FF, 
      A700: 0x00B8D4, 
    },

    Teal: { 
      C50: 0xE0F2F1, 
      C100: 0xB2DFDB, 
      C200: 0x80CBC4, 
      C300: 0x4DB6AC, 
      C400: 0x26A69A, 
      C500: 0x009688, 
      C600: 0x00897B, 
      C700: 0x00796B, 
      C800: 0x00695C, 
      C900: 0x004D40, 
      A100: 0xA7FFEB, 
      A200: 0x64FFDA, 
      A400: 0x1DE9B6, 
      A700: 0x00BFA5, 
    },

    Green: { 
      C50: 0xE8F5E9, 
      C100: 0xC8E6C9, 
      C200: 0xA5D6A7, 
      C300: 0x81C784, 
      C400: 0x66BB6A, 
      C500: 0x4CAF50, 
      C600: 0x43A047, 
      C700: 0x388E3C, 
      C800: 0x2E7D32, 
      C900: 0x1B5E20, 
      A100: 0xB9F6CA, 
      A200: 0x69F0AE, 
      A400: 0x00E676, 
      A700: 0x00C853, 
    },

    LightGreen: { 
      C50: 0xF1F8E9, 
      C100: 0xDCEDC8, 
      C200: 0xC5E1A5, 
      C300: 0xAED581, 
      C400: 0x9CCC65, 
      C500: 0x8BC34A, 
      C600: 0x7CB342, 
      C700: 0x689F38, 
      C800: 0x558B2F, 
      C900: 0x33691E, 
      A100: 0xCCFF90, 
      A200: 0xB2FF59, 
      A400: 0x76FF03, 
      A700: 0x64DD17, 
    },

    Lime: { 
      C50: 0xF9FBE7, 
      C100: 0xF0F4C3, 
      C200: 0xE6EE9C, 
      C300: 0xDCE775, 
      C400: 0xD4E157, 
      C500: 0xCDDC39, 
      C600: 0xC0CA33, 
      C700: 0xAFB42B, 
      C800: 0x9E9D24, 
      C900: 0x827717, 
      A100: 0xF4FF81, 
      A200: 0xEEFF41, 
      A400: 0xC6FF00, 
      A700: 0xAEEA00, 
    },

    Yellow: { 
      C50: 0xFFFDE7, 
      C100: 0xFFF9C4, 
      C200: 0xFFF59D, 
      C300: 0xFFF176, 
      C400: 0xFFEE58, 
      C500: 0xFFEB3B, 
      C600: 0xFDD835, 
      C700: 0xFBC02D, 
      C800: 0xF9A825, 
      C900: 0xF57F17, 
      A100: 0xFFFF8D, 
      A200: 0xFFFF00, 
      A400: 0xFFEA00, 
      A700: 0xFFD600, 
    },

    Amber: { 
      C50: 0xFFF8E1, 
      C100: 0xFFECB3, 
      C200: 0xFFE082, 
      C300: 0xFFD54F, 
      C400: 0xFFCA28, 
      C500: 0xFFC107, 
      C600: 0xFFB300, 
      C700: 0xFFA000, 
      C800: 0xFF8F00, 
      C900: 0xFF6F00, 
      A100: 0xFFE57F, 
      A200: 0xFFD740, 
      A400: 0xFFC400, 
      A700: 0xFFAB00, 
    },

    Orange: { 
      C50: 0xFFF3E0, 
      C100: 0xFFE0B2, 
      C200: 0xFFCC80, 
      C300: 0xFFB74D, 
      C400: 0xFFA726, 
      C500: 0xFF9800, 
      C600: 0xFB8C00, 
      C700: 0xF57C00, 
      C800: 0xEF6C00, 
      C900: 0xE65100, 
      A100: 0xFFD180, 
      A200: 0xFFAB40, 
      A400: 0xFF9100, 
      A700: 0xFF6D00, 
    },

    DeepOrange: { 
      C50: 0xFBE9E7, 
      C100: 0xFFCCBC, 
      C200: 0xFFAB91, 
      C300: 0xFF8A65, 
      C400: 0xFF7043, 
      C500: 0xFF5722, 
      C600: 0xF4511E, 
      C700: 0xE64A19, 
      C800: 0xD84315, 
      C900: 0xBF360C, 
      A100: 0xFF9E80, 
      A200: 0xFF6E40, 
      A400: 0xFF3D00, 
      A700: 0xDD2C00, 
    },

    Brown: { 
      C50: 0xEFEBE9, 
      C100: 0xD7CCC8, 
      C200: 0xBCAAA4, 
      C300: 0xA1887F, 
      C400: 0x8D6E63, 
      C500: 0x795548, 
      C600: 0x6D4C41, 
      C700: 0x5D4037, 
      C800: 0x4E342E, 
      C900: 0x3E2723, 
    },

    Grey: { 
      C50: 0xFAFAFA, 
      C100: 0xF5F5F5, 
      C200: 0xEEEEEE, 
      C300: 0xE0E0E0, 
      C400: 0xBDBDBD, 
      C500: 0x9E9E9E, 
      C600: 0x757575, 
      C700: 0x616161, 
      C800: 0x424242, 
      C900: 0x212121, 
    },

    BlueGrey: { 
      C50: 0xECEFF1, 
      C100: 0xCFD8DC, 
      C200: 0xB0BEC5, 
      C300: 0x90A4AE, 
      C400: 0x78909C, 
      C500: 0x607D8B, 
      C600: 0x546E7A, 
      C700: 0x455A64, 
      C800: 0x37474F, 
      C900: 0x263238, 
    },

    Black: 0x000000,
    White: 0xFFFFFF
}

export const ColorUtils = {
  toHtml(color: number)  {
    return `#${color.toString(16).padStart(6, "0")}`;
  },
  randomShade(exclude?: string) : Shade {
    return Random.pick(this.randomColor(exclude).shades);
  },
  randomColor(exclude?: string) : Color {
    let colors = ColorsArray;
    if (exclude)
      colors = colors.filter(p => p.name != exclude);

    return Random.pick(colors);
  }
};

type Shade = {
  name: string;
  shade: any;
}

export type Color = {
  name: string;
  shades: Shade[],
  highlights: Shade[]
}

const colorAny: any = Colors;
const ColorsArray = Object.keys(Colors).filter(c => typeof(colorAny[c]) === "object")
  .map(c => {
  const colorsObject = colorAny[c];
  const shades = Object.keys(colorsObject)
    .filter(name => name.startsWith("C"))
    .map(s => { return <Shade>{name: s, shade: colorsObject[s]}});

  const highlights = Object.keys(colorsObject)
    .filter(name => name.startsWith("A"))
    .map(s => { return {name: s, shade: colorsObject[s]}});

  return <Color>{
    name: c,
    shades, 
    highlights
  }}
);