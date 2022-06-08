import { describe, it, expect } from 'vitest'
import { Fit } from './Fit'

describe.concurrent('Fit', () => {
    it('optimize', () => {
        const templateColors = [
            '#9966FF',
            '#0055BC',
            '#00A1C2',
            '#ED6804',
            '#B3063D',
        ]
        const fit = new Fit()
        expect(fit.optimize(templateColors).length).toStrictEqual(templateColors.length)
    })
})
