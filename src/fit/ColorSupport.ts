import chroma, { Color } from 'chroma-js'
import { HexColor } from './Fit'

export type ColorComponent = number

export type ColorRGB = [r: ColorComponent, g: ColorComponent, b: ColorComponent]

export class ColorSupport {
    static convertSRGBToLinearRGB(v: ColorComponent): ColorComponent {
        const fv = v / 255.0
        if (fv < 0.04045) return fv / 12.92
        return Math.pow((fv + 0.055) / 1.055, 2.4)
    }

    static convertLinearRGBToSRGB(v: ColorComponent): ColorComponent {
        if (v <= 0) return 0
        if (v >= 1) return 255
        if (v < 0.0031308) return 0.5 + v * 12.92 * 255
        return 255 * (Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055)
    }

    // Adjusted from the HCIRN code
    static monochromeWithSeverity(sRGB: ColorRGB, severity: number): ColorRGB {
        const z = Math.round(sRGB[0] * 0.299 + sRGB[1] * 0.587 + sRGB[2] * 0.114)
        const r = z * severity + (1.0 - severity) * sRGB[0]
        const g = z * severity + (1.0 - severity) * sRGB[1]
        const b = z * severity + (1.0 - severity) * sRGB[2]
        return [r, g, b]
    }

    static randomColor(): Color {
        return chroma.random()
    }

    static randomColorArray(length: number): Color[] {
        return Array.from({length}).map(_ => this.randomColor())
    }

    static distanceDeltaE(color1: Color, color2: Color) {
        return chroma.deltaE(color1, color2)
    }

    /**
     * Returns either black or white, whichever produces the greatest contrast for the given color.
     * @param color
     */
    static contrastBlackWhite(color: HexColor): HexColor {
        const withoutHash = color.replace('#', '')
        const r = parseInt(withoutHash.slice(0, 2), 16),
            g = parseInt(withoutHash.slice(2, 4), 16),
            b = parseInt(withoutHash.slice(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF'
    }

    /**
     * produces a color a small random distance away from the given color
     * @param color
     */
    public static randomNearbyColor(color: Color): Color {
        const channelToChange = this.randomInRange(3)
        const oldVal = color.gl()[channelToChange]
        let newVal = oldVal + Math.random() * 0.1 - 0.05
        if (newVal > 1) {
            newVal = 1
        } else if (newVal < 0) {
            newVal = 0
        }
        return color.set(`rgb.${"rgb"[channelToChange]}`, newVal * 255)
    }

    public static closestColorFromList = (mark: Color, list: Color[]) => {
        const distances = list.map((c) => this.distanceDeltaE(mark, c))
        const minIndex = distances.indexOf(Math.min(...distances))
        return list[minIndex]
    }

    private static randomInRange(upperBound: number) {
        return Math.floor(Math.random() * upperBound)
    }

}
