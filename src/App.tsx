import { useEffect, useState } from 'react'
import { Fit, HexColor } from './fit/Fit'
import { ColorSwatchInput, ColorSwatchType } from './ColorSwatchInput'
import { ClipboardSupport } from './ClipboardSupport'
import { ExampleChart, makeExampleChartData } from './ExampleChart'
import styles from './App.module.scss'
import { Footer } from './Footer'


const defaultTemplateColors = [
    '#9966FF',
    '#0055BC',
    '#00A1C2',
    '#ED6804',
    '#B3063D',
]

const fit = new Fit()

function App() {
    const [isRunningOptimization, setIsRunningOptimization] = useState<boolean>(false)
    const [templateColors, setTemplateColors] = useState(defaultTemplateColors)
    const [optimizedColors, setOptimizedColors] = useState<HexColor[]>([])
    const [exampleChartData, setExampleChartData] = useState(makeExampleChartData(optimizedColors.length))

    const resetOptimizedColors = (length: number) => {
        const neutralColors = Array.from({length}).map(_ => '#cccccc')
        setOptimizedColors(neutralColors)
    }

    useEffect(() => {
        resetOptimizedColors(templateColors.length)
    }, [])

    const runFitOptimization = () => {
        setIsRunningOptimization(true)
        resetOptimizedColors(optimizedColors.length)
        setExampleChartData(makeExampleChartData(optimizedColors.length))
        setTimeout(async () => {
            const result = fit.optimize(templateColors, optimizedColors.length)
            setOptimizedColors(result)
            setIsRunningOptimization(false)
        }, 50)
    }

    const handleTemplateColorOnChange = (color: HexColor, index: number) => {
        const updated = Array.from(templateColors)
        updated[index] = color
        setTemplateColors(updated)
        return
    }

    const handleTemplateColorOnPaste = (colors: HexColor[]) => {
        setTemplateColors(colors)
    }

    const handleOnAddTemplateColor = () => {
        setTemplateColors([...templateColors, '#cccccc'])
    }

    const handleTemplateColorOnRemoveClick = (index: number) => {
        templateColors.splice(index, 1)
        setTemplateColors([...templateColors])
        resetOptimizedColors(templateColors.length)
    }

    const handleOnAddOptimizedColor = () => {
        resetOptimizedColors(optimizedColors.length + 1)
    }

    const handleOptimizedColorOnRemoveClick = (index: number) => {
        optimizedColors.splice(index, 1)
        setOptimizedColors([...optimizedColors])
    }

    const handlePasteTemplateColorsOnClick = async () => {
        const colors = await ClipboardSupport.paste()
        if (1 < colors.length) {
            setTemplateColors(colors)
        }
    }

    const handleCopyOptimizedColorsOnClick = () => {
        ClipboardSupport.copy(optimizedColors)
    }

    return (
        <>
            <header>
                <h1 className={styles.title}>Category Colors</h1>
                <span className={styles.subTitle}>Color palettes generator for data visualization</span>
            </header>

            <main className={styles.main}>

                <h2 className={styles.sectionTitle}>Template Colors</h2>
                <section className={styles.colorsSection}>
                    {templateColors.map((color, index) =>
                        <ColorSwatchInput
                            type={ColorSwatchType.Template}
                            key={index}
                            color={color}
                            removeDisabled={isRunningOptimization || templateColors.length <= 2}
                            onRemoveClick={() => handleTemplateColorOnRemoveClick(index)}
                            onChange={color => handleTemplateColorOnChange(color, index)}
                            onPaste={colors => handleTemplateColorOnPaste(colors)}
                        />
                    )}
                    <button
                        className={styles.addButton}
                        disabled={isRunningOptimization || 10 < templateColors.length}
                        onClick={handleOnAddTemplateColor}
                    >
                        <span>Add</span>
                    </button>
                </section>

                <section className={styles.buttonsSection}>
                    <div className={styles.buttonsBar}>
                        <button
                            className={styles.copyButton}
                            onClick={handlePasteTemplateColorsOnClick}
                        >
                            <span>Paste Template Colors</span>
                        </button>
                        <button
                            className={styles.generateButton}
                            disabled={isRunningOptimization}
                            onClick={runFitOptimization}
                        >
                            <span>Generate</span>
                        </button>
                        <button
                            className={styles.copyButton}
                            onClick={handleCopyOptimizedColorsOnClick}
                        >
                            <span>Copy Optimized Colors</span>
                        </button>
                    </div>
                    <div className={styles.generatingMessageInfo}>
                        {isRunningOptimization
                            ? <span>generating... please wait... patiently...</span>
                            : <span>&nbsp;</span>}
                    </div>
                </section>

                <h2 className={styles.sectionTitle}>Optimized Colors</h2>

                <section className={styles.colorsSection}>

                    {optimizedColors.map((color, index) =>
                        <ColorSwatchInput
                            type={ColorSwatchType.Optimized}
                            key={index}
                            color={color}
                            readonly={true}
                            onRemoveClick={() => handleOptimizedColorOnRemoveClick(index)}
                            removeDisabled={isRunningOptimization || optimizedColors.length <= 3}
                        />
                    )}
                    <button
                        className={styles.addButton}
                        disabled={isRunningOptimization || 10 < optimizedColors.length}
                        onClick={handleOnAddOptimizedColor}
                    >
                        <span>Add</span>
                    </button>
                </section>

                <h2 className={styles.sectionTitle}>Example Visualization</h2>

                <section className={styles.exampleChartSection}>
                    <ExampleChart data={exampleChartData} colors={optimizedColors}/>
                </section>


            </main>

            <Footer/>
        </>
    )
}

export default App
