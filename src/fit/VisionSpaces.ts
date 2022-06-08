// Bretel et al method for simulating color vision deficiency
// Adapted from https://github.com/MaPePeR/jsColorblindSimulator
// In turn adapted from libDaltonLens https://daltonlens.org (public domain)

import { ColorRGB, ColorSupport } from './ColorSupport'
import chroma, { Color } from 'chroma-js'

type BretelParam = {
    rgbCvdFromRgb1: number[]
    rgbCvdFromRgb2: number[]
    separationPlaneNormal: number[]
}

type BretelParams = {
    Protan: BretelParam
    Deutan: BretelParam
    Tritan: BretelParam
}

type BretelMode = keyof BretelParams

const BRETEL_PARAMS: BretelParams = {
    Protan: {
        rgbCvdFromRgb1: [
            0.1451, 1.20165, -0.34675, 0.10447, 0.85316, 0.04237, 0.00429, -0.00603, 1.00174,
        ],
        rgbCvdFromRgb2: [
            0.14115, 1.16782, -0.30897, 0.10495, 0.8573, 0.03776, 0.00431, -0.00586, 1.00155,
        ],
        separationPlaneNormal: [0.00048, 0.00416, -0.00464],
    },
    Deutan: {
        rgbCvdFromRgb1: [
            0.36198, 0.86755, -0.22953, 0.26099, 0.64512, 0.09389, -0.01975, 0.02686, 0.99289,
        ],
        rgbCvdFromRgb2: [
            0.37009, 0.8854, -0.25549, 0.25767, 0.63782, 0.10451, -0.0195, 0.02741, 0.99209,
        ],
        separationPlaneNormal: [-0.00293, -0.00645, 0.00938],
    },
    Tritan: {
        rgbCvdFromRgb1: [
            1.01354, 0.14268, -0.15622, -0.01181, 0.87561, 0.13619, 0.07707, 0.81208, 0.11085,
        ],
        rgbCvdFromRgb2: [
            0.93337, 0.19999, -0.13336, 0.05809, 0.82565, 0.11626, -0.37923, 1.13825, 0.24098,
        ],
        separationPlaneNormal: [0.0396, -0.02831, -0.01129],
    }
}

const SRGB_TO_LINEAR_RGB_LOOKUP = Array.from(Array(256).keys()).map(i => ColorSupport.convertSRGBToLinearRGB(i))

function transformBretel(sRGB: ColorRGB, mode: BretelMode, severity: number): ColorRGB {
    // Go from sRGB to linearRGB
    const rgb = Array(3)
    rgb[0] = SRGB_TO_LINEAR_RGB_LOOKUP[sRGB[0]]
    rgb[1] = SRGB_TO_LINEAR_RGB_LOOKUP[sRGB[1]]
    rgb[2] = SRGB_TO_LINEAR_RGB_LOOKUP[sRGB[2]]

    const params = BRETEL_PARAMS[mode]
    const separationPlaneNormal = params.separationPlaneNormal
    const rgbCvdFromRgb1 = params.rgbCvdFromRgb1
    const rgbCvdFromRgb2 = params.rgbCvdFromRgb2

    // Check on which plane we should project by comparing wih the separation plane normal.
    const dotWithSepPlane =
        rgb[0] * separationPlaneNormal[0] +
        rgb[1] * separationPlaneNormal[1] +
        rgb[2] * separationPlaneNormal[2]

    const rgbCvdFromRgb = dotWithSepPlane >= 0
        ? rgbCvdFromRgb1
        : rgbCvdFromRgb2

    // Transform to the full dichromat projection plane.
    const rgb_cvd = Array(3);
    rgb_cvd[0] =
        rgbCvdFromRgb[0] * rgb[0] +
        rgbCvdFromRgb[1] * rgb[1] +
        rgbCvdFromRgb[2] * rgb[2]

    rgb_cvd[1] =
        rgbCvdFromRgb[3] * rgb[0] +
        rgbCvdFromRgb[4] * rgb[1] +
        rgbCvdFromRgb[5] * rgb[2]

    rgb_cvd[2] =
        rgbCvdFromRgb[6] * rgb[0] +
        rgbCvdFromRgb[7] * rgb[1] +
        rgbCvdFromRgb[8] * rgb[2]

    // Apply the severity factor as a linear interpolation.
    // It's the same to do it in the RGB space or in the LMS
    // space since it's a linear transform.
    rgb_cvd[0] = rgb_cvd[0] * severity + rgb[0] * (1.0 - severity)
    rgb_cvd[1] = rgb_cvd[1] * severity + rgb[1] * (1.0 - severity)
    rgb_cvd[2] = rgb_cvd[2] * severity + rgb[2] * (1.0 - severity)

    // Go back to sRGB
    return [
        ColorSupport.convertLinearRGBToSRGB(rgb_cvd[0]),
        ColorSupport.convertLinearRGBToSRGB(rgb_cvd[1]),
        ColorSupport.convertLinearRGBToSRGB(rgb_cvd[2]),
    ]
}

export type TransformFunction = (v: ColorRGB) => ColorRGB

const VISION_SPACE_TRANSFORMS: {[s: string]: TransformFunction} = {
    Normal: (v: ColorRGB) => v,
    Protanopia: (v: ColorRGB) => transformBretel(v, 'Protan', 1.0),
    Protanomaly: (v: ColorRGB) => transformBretel(v, 'Protan', 0.6),
    Deuteranopia: (v: ColorRGB) => transformBretel(v, 'Deutan', 1.0),
    Deuteranomaly: (v: ColorRGB) => transformBretel(v, 'Deutan', 0.6),
    Tritanopia: (v: ColorRGB) => transformBretel(v, 'Tritan', 1.0),
    Tritanomaly: (v: ColorRGB) => transformBretel(v, 'Tritan', 0.6),
    Achromatopsia: (v: ColorRGB) => ColorSupport.monochromeWithSeverity(v, 1.0),
    Achromatomaly: (v: ColorRGB) => ColorSupport.monochromeWithSeverity(v, 0.6),
}

export type VisionSpace = keyof typeof VISION_SPACE_TRANSFORMS

export class VisionSpaces {
    static Transforms: {[k in VisionSpace]: TransformFunction} = VISION_SPACE_TRANSFORMS

    static distances(list: Color[], visionSpace: VisionSpace): number[] {
        const distances: number[] = [];
        const transformed: Color[] = list.map((c: Color) =>
            chroma(this.Transforms[visionSpace](c.rgb()))
        )
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                distances.push(ColorSupport.distanceDeltaE(transformed[i], transformed[j]));
            }
        }
        return distances;
    }
}
