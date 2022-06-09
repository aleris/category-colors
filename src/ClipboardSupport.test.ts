import { describe, it, expect } from 'vitest'
import { ClipboardSupport } from './ClipboardSupport'

describe.concurrent('CopyPasteSupport', () => {
    it('extract colors from simple text', () => {
        const text = `#AC2444, #65c590\n#B9A263`
        const colors = ClipboardSupport.fromText(text)
        expect(colors).toEqual(['#AC2444', '#65C590', '#B9A263'])
    })

    it('extract colors from text without #', () => {
        const text = `3ec240 and B9A263`
        const colors = ClipboardSupport.fromText(text)
        expect(colors).toEqual(['#3EC240', '#B9A263'])
    })

    it('extract colors from text copied from article', () => {
        const text = `The colors on the left (#3ec240, #65c590, #ac2444, #b9a263, and #ab088d) are the randomly-chosen 
            starting point of the algorithm. Running them through my loss function results in a score of 217.8.`
        const colors = ClipboardSupport.fromText(text)
        expect(colors).toEqual(['#3EC240', '#65C590', '#AC2444', '#B9A263', '#AB088D'])
    })

    it('extracts colors from text copied from Adobe Color', () => {
        const text = `
/* Color Theme Swatches in Hex */
@October-1-hex: #520120;
@October-2-hex: #08403E;
@October-3-hex: #706513;
@October-4-hex: #B57114;
@October-5-hex: #962B09;

/* Color Theme Swatches in RGBA */
@October-1-rgba: rgba(82, 1, 31, 1);
@October-2-rgba: rgba(8, 63, 61, 1);
@October-3-rgba: rgba(112, 100, 18, 1);
@October-4-rgba: rgba(181, 112, 20, 1);
@October-5-rgba: rgba(149, 42, 8, 1);

/* Color Theme Swatches in HSLA */
@October-1-hsla: hsla(337, 97, 16, 1);
@October-2-hsla: hsla(177, 77, 14, 1);
@October-3-hsla: hsla(52, 70, 25, 1);
@October-4-hsla: hsla(34, 80, 39, 1);
@October-5-hsla: hsla(14, 88, 31, 1);
        `

        const colors = ClipboardSupport.fromText(text)
        expect(colors).toEqual(['#520120', '#08403E', '#706513', '#B57114', '#962B09'])
    })
})
