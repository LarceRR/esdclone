import React, { useId } from 'react'

export interface FinancialReportIconProps {
    size?: number
    /** Заливка «плашки» (по умолчанию primary проекта) */
    backgroundColor?: string
}

/**
 * Квадрат со скруглением в primary, линия графика — вырез (прозрачно через SVG mask),
 * как на референсе: фон primary, график «маской».
 */
export const FinancialReportIcon: React.FC<FinancialReportIconProps> = ({
    size = 17,
    backgroundColor = 'var(--primary-color)',
}) => {
    const maskId = useId().replace(/:/g, '')

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width={size}
            height={size}
            style={{ display: 'block', width: size, height: size }}
            aria-hidden
        >
            <defs>
                <mask
                    id={maskId}
                    maskUnits='userSpaceOnUse'
                >
                    {/* Белое = непрозрачно в маске → виден primary */}
                    <rect
                        width='24'
                        height='24'
                        rx='5'
                        ry='5'
                        fill='white'
                    />
                    {/* Чёрное в маске = прозрачность → «вырез» под фон сайдбара */}
                    <path
                        d='M5 16.5 L9.5 10.5 L13 13.5 L17.5 7.5'
                        fill='none'
                        stroke='black'
                        strokeWidth='2.4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </mask>
            </defs>
            <rect
                width='24'
                height='24'
                rx='5'
                ry='5'
                style={{ fill: backgroundColor }}
                mask={`url(#${maskId})`}
            />
        </svg>
    )
}

export default FinancialReportIcon
