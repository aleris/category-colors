import { describe, it, expect } from 'vitest'
import { ColorSupport } from './ColorSupport'

describe.concurrent('ColorConvert', () => {
    it('converts sRGB to linear RGB', () => {
        expect(ColorSupport.convertSRGBToLinearRGB(0)).toBeCloseTo(0, 10)
        expect(ColorSupport.convertSRGBToLinearRGB(1)).toBeCloseTo(0.0003035269835488375, 10)
        expect(ColorSupport.convertSRGBToLinearRGB(127)).toBeCloseTo(0.21223075741405523, 10)
        expect(ColorSupport.convertSRGBToLinearRGB(254)).toBeCloseTo(0.9911020971138298, 10)
        expect(ColorSupport.convertSRGBToLinearRGB(255)).toBeCloseTo(1, 10)
    })

    it('converts linear RGB to sRGB', () => {
        expect(ColorSupport.convertLinearRGBToSRGB(0)).toBeCloseTo(0, 10)
        expect(ColorSupport.convertLinearRGBToSRGB(0.0003035269835488375)).toBeCloseTo(1.5, 10)
        expect(ColorSupport.convertLinearRGBToSRGB(0.21223075741405523)).toBeCloseTo(127, 10)
        expect(ColorSupport.convertLinearRGBToSRGB(0.9911020971138298)).toBeCloseTo(254, 10)
        expect(ColorSupport.convertLinearRGBToSRGB(1)).toBeCloseTo(255, 10)
    })

    it('converts monochrome with severity', () => {
        expect(ColorSupport.monochromeWithSeverity([1, 127, 254], 0.25)).toEqual([26.75, 121.25, 216.5])
        expect(ColorSupport.monochromeWithSeverity([1, 127, 254], 0.75)).toEqual([78.25, 109.75, 141.5])
    })
})
