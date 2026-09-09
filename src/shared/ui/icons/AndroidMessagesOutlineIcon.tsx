import React from 'react'

export interface AndroidMessagesOutlineIconProps {
    size?: number
    color?: string
    background?: string
    opacity?: number
    rotation?: number
    shadow?: number
    flipHorizontal?: boolean
    flipVertical?: boolean
    padding?: number
}

export const AndroidMessagesOutlineIcon: React.FC<AndroidMessagesOutlineIconProps> = ({
    size = undefined,
    color = 'currentColor',
    background = 'transparent',
    opacity = 1,
    rotation = 0,
    shadow = 0,
    flipHorizontal = false,
    flipVertical = false,
    padding = 0,
}) => {
    const transforms: string[] = []
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
    if (flipHorizontal) transforms.push('scaleX(-1)')
    if (flipVertical) transforms.push('scaleY(-1)')

    const viewBoxSize = 24 + padding * 2
    const viewBoxOffset = -padding
    const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox={viewBox}
            width={size}
            height={size}
            fill='none'
            style={{
                color,
                opacity,
                transform: transforms.length ? transforms.join(' ') : undefined,
                filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
                backgroundColor: background !== 'transparent' ? background : undefined,
            }}
            aria-hidden
        >
            <path
                fill='currentColor'
                d='m5 8.75l-2.75-3.1q-.425-.5-.162-1.075Q2.35 4 3 4h17q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20H7q-.825 0-1.412-.587Q5 18.825 5 18ZM5.225 6ZM9 13h9q.425 0 .712-.288Q19 12.425 19 12t-.288-.713Q18.425 11 18 11H9q-.425 0-.712.287Q8 11.575 8 12t.288.712Q8.575 13 9 13Zm0 3h6q.425 0 .713-.288Q16 15.425 16 15t-.287-.713Q15.425 14 15 14H9q-.425 0-.712.287Q8 14.575 8 15t.288.712Q8.575 16 9 16Zm0-6h9q.425 0 .712-.288Q19 9.425 19 9t-.288-.713Q18.425 8 18 8H9q-.425 0-.712.287Q8 8.575 8 9t.288.712Q8.575 10 9 10ZM7 8v10h13V6H5.225Z'
            />
        </svg>
    )
}

export default AndroidMessagesOutlineIcon
