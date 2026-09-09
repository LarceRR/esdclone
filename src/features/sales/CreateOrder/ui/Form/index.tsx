import { useCreateCustomerOrderMutation, useGetUsersListQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from '../CreateOrder/CreateOrder.module.css'
import { Box, Button, MenuItem, Select } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export const Form: React.FC<{ onClose: () => void }> = ({ onClose }: { onClose: () => void }) => {
    const [createOrder, { isLoading }] = useCreateCustomerOrderMutation()
    const { data: usersList } = useGetUsersListQuery()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { control, handleSubmit } = useForm<any>()

    const onSubmit: SubmitHandler<any> = (data) => {
        createOrder(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Заказ успешно добавлена'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении продажи! ${err?.data?.message}`)
            })
            .finally(() => onClose())
    }

    return (
        <form
            className={styles.Form}
            onSubmit={handleSubmit(onSubmit)}
        >
            <h3>Добавление нового заказа</h3>
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'1rem'}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Клиент</h5>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'0.5rem'}
                    >
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <Select
                                    size='small'
                                    displayEmpty
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={'Выберите клиента'}
                                    sx={{ minWidth: 200 }}
                                    defaultValue={''}
                                >
                                    <MenuItem value={''}>Выберите клиента</MenuItem>
                                    {usersList?.data?.map((user: any) => (
                                        <MenuItem
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name + ' ' + user.surname}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                            name={'user_id'}
                        />
                    </Box>
                </Box>
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
                        Добавить
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
