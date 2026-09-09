import AddIcon from '@mui/icons-material/Add'
import { Button, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

export type CreatePlusTriggerProps = {
    /** Текст на широком экране (lg+) и подсказка при узком (только иконка +) */
    label: string
    disabled?: boolean
    onClick?: () => void
    sx?: SxProps<Theme>
    /** Ширина (px), ниже которой показывается только иконка «+». По умолчанию — breakpoint lg. */
    iconOnlyMaxWidth?: number
    fullWidth?: boolean
}

export const CreatePlusTrigger = ({
    label,
    disabled,
    onClick,
    sx,
    iconOnlyMaxWidth,
    fullWidth,
}: CreatePlusTriggerProps) => {
    const theme = useTheme()
    const narrowQuery =
        iconOnlyMaxWidth != null ? `(max-width:${iconOnlyMaxWidth}px)` : theme.breakpoints.down('lg')
    const isNarrow = useMediaQuery(narrowQuery)

    const fullWidthSx = fullWidth
        ? { width: '100%', maxWidth: '100%' as const }
        : undefined

    if (isNarrow) {
        return (
            <Tooltip title={label}>
                <span style={fullWidth ? { display: 'block', width: '100%' } : undefined}>
                    <IconButton
                        color='primary'
                        size='medium'
                        disabled={disabled}
                        onClick={onClick}
                        aria-label={label}
                        sx={{
                            'bgcolor': 'primary.main',
                            'color': '#fff',
                            'borderRadius': '0.5rem',
                            'width': fullWidth ? '100%' : 38,
                            'height': 38,
                            '&:hover': { bgcolor: 'primary.dark' },
                            '&.Mui-disabled': {
                                bgcolor: 'action.disabledBackground',
                                color: 'action.disabled',
                            },
                            ...fullWidthSx,
                            ...sx,
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </span>
            </Tooltip>
        )
    }

    return (
        <Button
            variant='contained'
            size='medium'
            fullWidth={fullWidth}
            disabled={disabled}
            onClick={onClick}
            sx={{
                minHeight: 38,
                height: 38,
                py: 0,
                ...fullWidthSx,
                ...sx,
            }}
        >
            {label}
        </Button>
    )
}
