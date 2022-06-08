import { HexColor } from './fit/Fit'

const REGEX_HEX_COLOR = /(#?[\dA-F]{6})/gi

export class CopyPasteSupport {
    static copy(colors: HexColor[]) {
        const text = colors.join("\n").toUpperCase()
        navigator.clipboard.writeText(text)
            .then(
                () => {},
                (error) => {
                    console.error(error)
                    alert(`Could not copy text:\n${error}`)
                }
            );
    }

    static async paste(): Promise<HexColor[]> {
        return new Promise((resolve, reject) => navigator.clipboard.readText()
            .then(
                (text: string) => {
                    resolve(CopyPasteSupport.fromText(text))
                },
                (error) => {
                    console.error(error)
                    alert(`Could not paste text:\n${error}`)
                    reject(error)
                }
            )
        )
    }

    static fromText(text: string): HexColor[] {
        return Array.from(text.matchAll(REGEX_HEX_COLOR))
                    .map(r => r[0].toUpperCase())
                    .map(c => c.startsWith('#') ? c : `#${c}`)
    }
}
