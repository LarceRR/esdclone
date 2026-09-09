import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useGetGroupsQuery, useLazyGetUserQuery, useUpdateUserMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoadingButton } from '@mui/lab'
import { IUserUpdate } from '@/shared/api/types'

interface IForm {
    onClose: () => void
    userId: number
}

const initialData: IUserUpdate = {
    id: 0,
    surname: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    group_id: 1,
}

export const Form: React.FC<IForm> = ({ onClose, userId }) => {
    // queries
    const { data: groupsList } = useGetGroupsQuery()
    const [getUser] = useLazyGetUserQuery()
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { handleSubmit, control } = useForm<IUserUpdate>({
        // @ts-ignore
        defaultValues: async () => {
            return await getUser(userId)
                .unwrap()
                .then((res) => {
                    return {
                        id: userId,
                        name: res?.data[0]?.name,
                        surname: res?.data[0]?.surname,
                        email: res?.data[0]?.email,
                        phone: res?.data[0]?.phone,
                        password: res?.data[0].password,
                        group_id: res?.data[0]?.group_id || 0,
                    }
                })
                .catch((error) => {
                    console.error(error)
                    TOAST_ERROR('Ошибка получения информации о пользователе')
                    console.log('tut')
                    return initialData
                })
        },
    })

    const onSubmit: SubmitHandler<IUserUpdate> = (data) => {
        console.log(data)
        updateUser(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Пользователен успешно изменён'))
            .catch((err) => TOAST_ERROR(err.data.message))
            .finally(() => onClose())
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            label={'ФИО'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'name'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            label={'Фамилия'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'surname'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            type={'email'}
                            label={'E-Mail'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'email'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            label={'Телефон'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'phone'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel
                                size={'small'}
                                id='demo-simple-select-label'
                            >
                                {groupsList?.data?.find((group) => group.id === field.value)?.name || 'Группа'}
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Группа'
                                size={'small'}
                                onChange={(e) => field.onChange(e)}
                            >
                                {!groupsList?.data?.length && (
                                    <MenuItem
                                        disabled={true}
                                        value={'error'}
                                    >
                                        {'Группы отсутствуют'}
                                    </MenuItem>
                                )}
                                {groupsList?.data?.map((group) => (
                                    <MenuItem
                                        key={group.id}
                                        value={group.id}
                                    >
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    name={'group_id'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            size={'small'}
                            fullWidth
                            type={'password'}
                            label={'Пароль'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'password'}
                />
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={'1rem'}
                    marginTop={'0.5rem'}
                >
                    <LoadingButton
                        loading={isLoading}
                        size={'medium'}
                        type={'submit'}
                        variant={'contained'}
                    >
                        Изменить
                    </LoadingButton>
                    <Button
                        size={'medium'}
                        onClick={onClose}
                        color={'error'}
                        variant={'outlined'}
                    >
                        Отменить
                    </Button>
                </Box>
            </Box>
        </form>
    )
}
