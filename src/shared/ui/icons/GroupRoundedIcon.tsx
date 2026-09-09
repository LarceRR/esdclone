import React from 'react'

export interface GroupRoundedIconProps {
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

export const GroupRoundedIcon: React.FC<GroupRoundedIconProps> = ({
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
                d='M1 17.2q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2v.8q0 .825-.587 1.413T15 20H3q-.825 0-1.412-.587T1 18zM18.45 20q.275-.45.413-.962T19 18v-1q0-1.1-.612-2.113T16.65 13.15q1.275.15 2.4.513t2.1.887q.9.5 1.375 1.112T23 17v1q0 .825-.587 1.413T21 20zM9 12q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m10-4q0 1.65-1.175 2.825T15 12q-.275 0-.7-.062t-.7-.138q.675-.8 1.038-1.775T15 8t-.362-2.025T13.6 4.2q.35-.125.7-.163T15 4q1.65 0 2.825 1.175T19 8'
            />
        </svg>
    )
}

export default GroupRoundedIcon
