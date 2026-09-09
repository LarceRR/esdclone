import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './OnlineCashbox.module.css'
import { Box, Button, FormControlLabel, styled, Switch, SwitchProps, TextField } from '@mui/material'
import classNames from 'classnames'

interface IForm {
    toggle: boolean
    serverAddress: string
    login: string
    password: string
    deviceNumber: string
    checkCopies: string
    text: string
}

export const OnlineCashbox = () => {
    const { control, handleSubmit } = useForm<IForm>({
        defaultValues: {
            toggle: false,
            serverAddress: '',
            login: '',
            password: '',
            deviceNumber: '',
            checkCopies: '',
            text: '',
        },
    })

    const onSubmit: SubmitHandler<IForm> = (data) => console.log(data)

    return (
        <form
            className={styles.OnlineCashbox}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <IOSSwitch
                                size={'medium'}
                                color={field.value ? 'success' : 'primary'}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        }
                        label={<b className={classNames(styles.label, field.value && styles.active)}>Использовать онлайн-кассу</b>}
                    />
                )}
                name={'toggle'}
            />
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Адрес сервера'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'serverAddress'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Номер устройства'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'deviceNumber'}
                />
            </Box>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Логин'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'login'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            type={'password'}
                            fullWidth
                            label={'Пароль'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'password'}
                />
            </Box>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Копий чека'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'checkCopies'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            size={'small'}
                            fullWidth
                            label={'Произвольный текст (верх)'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'text'}
                />
            </Box>
            <Button
                type={'submit'}
                variant={'contained'}
                size={'medium'}
                sx={{ width: '25%' }}
            >
                Сохранить
            </Button>
        </form>
    )
}

export const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
        focusVisibleClassName='.Mui-focusVisible'
        disableRipple
        {...props}
    />
))(({ theme }) => ({
    'width': 38,
    'height': 21,
    'padding': 0,
    'margin': '0 0.75rem',
    '& .MuiSwitch-switchBase': {
        'padding': 0,
        'margin': 2,
        'transitionDuration': '300ms',
        '&.Mui-checked': {
            'transform': 'translateX(16px)',
            'color': '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#ccfdd6',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#ccfdd6',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
            '& .MuiSwitch-thumb': {
                background: '#2ECA45',
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 18,
        height: 18,
        backgroundColor: '#b2b2b2',
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}))
