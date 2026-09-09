import AddIcon from '@mui/icons-material/Add'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import { Tooltip, useMediaQuery, useTheme } from '@mui/material'

export type CreateSubmitLoadingButtonProps = Omit<LoadingButtonProps, 'children'> & {
    /** Текст при ширине > 768px */
    desktopLabel: string
    /** Подсказка при ≤768px (и aria-label) */
    narrowTooltip: string
}

export const CreateSubmitLoadingButton = ({ desktopLabel, narrowTooltip, loading, sx, ...rest }: CreateSubmitLoadingButtonProps) => {
    const theme = useTheme()
    const narrow = useMediaQuery(theme.breakpoints.down('md'))

    const button = (
        <LoadingButton
            loading={loading}
            size='medium'
            variant='contained'
            aria-label={narrow ? narrowTooltip : desktopLabel}
            sx={{
                ...(narrow ? { minWidth: 44, px: 1 } : {}),
                ...(sx && typeof sx === 'object' ? sx : {}),
            }}
            {...rest}
        >
            {narrow ? <AddIcon /> : desktopLabel}
        </LoadingButton>
    )

    if (narrow) {
        return (
            <Tooltip title={narrowTooltip}>
                <span>{button}</span>
            </Tooltip>
        )
    }

    return button
}
