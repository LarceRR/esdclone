import React from 'react'

export interface CategoryRoundedIconProps {
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

export const CategoryRoundedIcon: React.FC<CategoryRoundedIconProps> = ({
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
                d='M7.425 9.475L11.15 3.4q.15-.25.375-.363T12 2.925t.475.113t.375.362l3.725 6.075q.15.25.15.525t-.125.5t-.35.363t-.525.137h-7.45q-.3 0-.525-.137T7.4 10.5t-.125-.5t.15-.525M17.5 22q-1.875 0-3.187-1.312T13 17.5t1.313-3.187T17.5 13t3.188 1.313T22 17.5t-1.312 3.188T17.5 22M3 20.5v-6q0-.425.288-.712T4 13.5h6q.425 0 .713.288T11 14.5v6q0 .425-.288.713T10 21.5H4q-.425 0-.712-.288T3 20.5'
            />
        </svg>
    )
}

export default CategoryRoundedIcon
