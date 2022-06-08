import React from 'react'
import styles from './ColorSwatchInput.module.scss'
import { HexColor } from './fit/Fit'
import { ColorSupport } from './fit/ColorSupport'

type Params = {
    color: HexColor
    readonly?: boolean
    showRemove?: boolean
    removeDisabled?: boolean
    onChange?: (color: HexColor) => void
    onRemoveClick?: () => void
}

export function ColorSwatchInput({color, readonly = false, showRemove = true, removeDisabled = false, onRemoveClick, onChange}: Params) {
    const adjustedColor = color.length === 7 ? color : '#cccccc'
    const styleColor = {backgroundColor: adjustedColor, color: ColorSupport.contrastBlackWhite(adjustedColor)}
    return (
        <div className={styles.colorSwatchInput} style={styleColor}>
            <input
                className={styles.colorInput}
                style={styleColor}
                value={color}
                readOnly={readonly}
                onChange={e => onChange?.(e.target.value)}
                maxLength={7}
            />
            {showRemove
                ? <button className={styles.removeButton} onClick={onRemoveClick} disabled={removeDisabled} title={'Remove Color'}>
                    <span>✖</span>
                  </button>
                : null}
        </div>
    )
}
