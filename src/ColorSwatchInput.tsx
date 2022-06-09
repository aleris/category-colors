import React, { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from 'react'
import styles from './ColorSwatchInput.module.scss'
import { HexColor } from './fit/Fit'
import { ColorSupport } from './fit/ColorSupport'
import { ClipboardSupport } from './ClipboardSupport'

export enum ColorSwatchType {
    Template = 'template',
    Optimized = 'optimized',
}

type Params = {
    type: ColorSwatchType
    color: HexColor
    readonly?: boolean
    showRemove?: boolean
    removeDisabled?: boolean
    onRemoveClick?: () => void
    onChange?: (color: HexColor) => void
    onPaste?: (colors: HexColor[]) => void
}

const MIN_TOW_HEX_COLORS_LEN = 13

export function ColorSwatchInput({
    type,
    color,
    readonly = false,
    showRemove = true,
    removeDisabled = false,
    onRemoveClick,
    onChange,
    onPaste,
}: Params) {
    const adjustedColor = color.length === 7 ? color : '#cccccc'
    const styleColor = {backgroundColor: adjustedColor, color: ColorSupport.contrastBlackWhite(adjustedColor)}

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const text = e.target.value
        if (text.trim().length <= 7) {
            if (text.startsWith('#')) {
                onChange?.(text)
            } else {
                onChange?.(`#${text}`)
            }
        }
    }

    const handleOnPaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
        const text = e.clipboardData.getData('text')
        const colors = ClipboardSupport.fromText(text)
        if (2 <= colors.length) {
            onPaste?.(colors)
        }
    }

    return (
        <div className={styles.colorSwatchInput} style={styleColor}>
            <input
                className={`${styles.colorInput} ${type}`}
                style={styleColor}
                value={color}
                readOnly={readonly}
                onChange={handleOnChange}
                onPaste={handleOnPaste}
            />
            {showRemove
                ? <button
                    className={styles.removeButton}
                    onClick={onRemoveClick}
                    disabled={removeDisabled}
                    title={'Remove Color'}
                  >
                    <span>✖</span>
                  </button>
                : null}
        </div>
    )
}
