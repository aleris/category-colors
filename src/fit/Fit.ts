import chroma, { Color } from 'chroma-js'
import { VisionSpaces } from './VisionSpaces'
import { ColorSupport } from './ColorSupport'


export type HexColor = string

export class Fit {
    public constructor(
        public readonly startTemperature = 1000,
        public readonly coolingRate = 0.99,
        public readonly cutoff = 0.0001,
    ) { }

    public optimize(templateColors: HexColor[], numberOfTargetColors: number = templateColors.length) {
        return new Optimizer(this, templateColors, numberOfTargetColors).optimize()
    }
}

class Optimizer {
    public constructor(
        public readonly fit: Fit,
        public readonly templateColors: HexColor[],
        public readonly numberOfTargetColors: number = templateColors.length,
    ) { }

    public optimize() {
        const startColors = ColorSupport.randomColorArray(this.numberOfTargetColors)
        console.log('Optimize starting for:', startColors.map(c => c.hex()))

        const startCost = this.cost(startColors)

        const colors = Array.from(startColors)

        let temperature = this.fit.startTemperature

        while (this.fit.cutoff < temperature) {
            // for each color
            for (let i = 0; i < colors.length; i++) {
                // copy old colors
                const newColors = Array.from(colors)
                // move the current color randomly
                newColors[i] = ColorSupport.randomNearbyColor(newColors[i])
                // choose between the current state and the new state
                // based on the difference between the two, the temperature
                // of the algorithm, and some random chance
                const delta = this.cost(newColors) - this.cost(colors)
                const probability = Math.exp(-delta / temperature)
                if (Math.random() < probability) {
                    colors[i] = newColors[i]
                }
            }

            // decrease temperature
            temperature *= this.fit.coolingRate
        }

        console.info(`Optimization finalized.
Start colors: ${startColors.map((color) => color.hex())}
Start cost: ${startCost}
Final colors: ${colors.map((color) => color.hex())}
Final cost: ${this.cost(colors)}
Cost difference: ${this.cost(colors) - startCost}`)

        return colors.map(color => color.hex());
    }

    private cost(colors: Color[]) {
        const energyWeight = 1
        const rangeWeight = 1
        const targetWeight = 1
        const protanopiaWeight = 0.33
        const deuteranopiaWeight = 0.33
        const tritanopiaWeight = 0.33

        const normalDistances = VisionSpaces.distances(colors, 'Normal')
        const protanopiaDistances = VisionSpaces.distances(colors, 'Protanopia')
        const deuteranopiaDistances = VisionSpaces.distances(colors, 'Deuteranopia')
        const tritanopiaDistances = VisionSpaces.distances(colors, 'Tritanopia')

        const energyScore =  100 - Optimizer.average(normalDistances)
        const protanopiaScore = 100 - Optimizer.average(protanopiaDistances)
        const deuteranopiaScore = 100 - Optimizer.average(deuteranopiaDistances)
        const tritanopiaScore = 100 - Optimizer.average(tritanopiaDistances)
        const rangeScore = Optimizer.range(normalDistances)
        const targetScore = Optimizer.averageDistanceFromColors(colors, this.templateColors.map(c => chroma.hex(c)))

        return (
            energyWeight * energyScore +
            targetWeight * targetScore +
            rangeWeight * rangeScore +
            protanopiaWeight * protanopiaScore +
            deuteranopiaWeight * deuteranopiaScore +
            tritanopiaWeight * tritanopiaScore
        )
    }

    /**
     * calculates the distance between the highest and lowest values in an array
     * @param array
     */
    private static range = (array: number[]): number => {
        const sorted = array.sort((a, b) => a - b)
        return sorted[sorted.length - 1] - sorted[0]
    }

    /**
     * calculates the average of distances between an array of colors and an array of target colors
     * @param colors
     * @param targetColors
     */
    public static averageDistanceFromColors(colors: Color[], targetColors: Color[]): number {
        const distances = colors.map((c) =>
            ColorSupport.distanceDeltaE(c, ColorSupport.closestColorFromList(c, targetColors))
        )
        return this.average(distances)
    }

    /**
     * calculates the average of the numbers in the array
     * @param array
     * @private
     */
    private static average(array: number[]): number {
        return array.reduce((a, b) => a + b) / array.length
    }
}