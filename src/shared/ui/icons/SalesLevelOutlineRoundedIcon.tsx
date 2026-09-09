import React from 'react'

export interface SalesLevelOutlineRoundedIconProps {
    size?: number
    color?: string
    strokeWidth?: number
    background?: string
    opacity?: number
    rotation?: number
    shadow?: number
    flipHorizontal?: boolean
    flipVertical?: boolean
    padding?: number
}

const BAG_ARROW_PATH =
    'M13 21H4C3.70052 20.9999 3.40488 20.9326 3.13489 20.8031C2.86491 20.6735 2.62747 20.4849 2.44011 20.2513C2.25275 20.0176 2.12024 19.7449 2.05237 19.4532C1.98451 19.1615 1.98301 18.8583 2.048 18.566L4.048 9.566C4.14673 9.12187 4.39393 8.72468 4.74881 8.43998C5.10369 8.15528 5.54503 8.00008 6 8H18C18.455 8.00008 18.8963 8.15528 19.2512 8.43998C19.6061 8.72468 19.8533 9.12187 19.952 9.566L21.3818 16M16 21V14.5M13 18L16 14.5L19 18'

const HANDLE_PATH =
    'M8 11V6C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6V11'

export const SalesLevelOutlineRoundedIcon: React.FC<SalesLevelOutlineRoundedIconProps> = ({
    size = undefined,
    color = 'currentColor',
    strokeWidth = 2,
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

    const strokeProps = {
        stroke: 'currentColor' as const,
        strokeWidth,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        fill: 'none' as const,
    }

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
            <path d={BAG_ARROW_PATH} {...strokeProps} />
            <path d={HANDLE_PATH} {...strokeProps} />
        </svg>
    )
}

export default SalesLevelOutlineRoundedIcon
