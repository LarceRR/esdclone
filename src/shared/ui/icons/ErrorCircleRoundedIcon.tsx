import React from 'react'

export interface ErrorCircleRoundedIconProps {
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

export const ErrorCircleRoundedIcon: React.FC<ErrorCircleRoundedIconProps> = ({
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
                d='M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-9q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Z'
            />
        </svg>
    )
}

export default ErrorCircleRoundedIcon
