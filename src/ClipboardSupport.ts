import { HexColor } from './fit/Fit'

const REGEX_HEX_COLOR = /(#?[\dA-F]{6})/gi

export class ClipboardSupport {
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
        if (typeof navigator?.clipboard?.readText === 'function') {
            return new Promise((resolve, reject) => navigator.clipboard.readText()
                .then(
                    (text: string) => {
                        resolve(ClipboardSupport.fromText(text))
                    },
                    (error) => {
                        console.error(error)
                        alert(`Could not paste text:\n${error}`)
                        reject(error)
                    }
                )
            )
        }

        console.error('navigator.clipboard.readText not supported.')
        alert(`Sorry, not supported in your browser. Try pasting the entire text directly into one of the inputs.`)
        return Promise.resolve([])
    }

    static fromText(text: string): HexColor[] {
        return Array.from(text.matchAll(REGEX_HEX_COLOR))
                    .map(r => r[0].toUpperCase())
                    .map(c => c.startsWith('#') ? c : `#${c}`)
    }
}
