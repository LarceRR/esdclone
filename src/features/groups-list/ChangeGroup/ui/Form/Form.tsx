import React, { memo, useCallback } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { EGroupNaming, IGroupUpdate } from '@/shared/api/types'
import { useToast } from '@/shared/lib/hooks/toast'
import { initialData } from '../../model/lib/initialData.ts'
import { useLazyGetGroupQuery, useUpdateGroupMutation } from '@/shared/api'
import { Box, Button, TextField } from '@mui/material'
import { CheckboxController } from '../CheckboxController/CheckboxController.tsx'
import { EControllers } from '@/features/groups-list/CreateGroup/model/types'
import { LoadingButton } from '@mui/lab'
import styles from './Form.module.css'

interface IFormProps {
    id: number
    onClose: () => void
}

export const Form: React.FC<IFormProps> = memo((props: IFormProps) => {
    const { id, onClose } = props
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    // queries
    const [getGroup] = useLazyGetGroupQuery()
    const [updateGroup, { isLoading }] = useUpdateGroupMutation()

    const {
        handleSubmit,
        control,
        formState: { defaultValues },
        setValue,
        getValues,
        watch,
    } = useForm<IGroupUpdate>({
        defaultValues: async (): Promise<IGroupUpdate> => {
            return await getGroup(id)
                .unwrap()
                .then((res): IGroupUpdate => {
                    console.log(res)
                    return {
                        id: id,
                        name: res?.data?.name,
                        rules: res?.data?.rules,
                    }
                })
                .catch((error) => {
                    console.error(error)
                    TOAST_ERROR('Ошибка получения информации о группе')
                    return initialData
                })
        },
    })

    const onSubmit: SubmitHandler<IGroupUpdate> = (data) => {
        const updatedDataForRequest = { ...data }
        delete updatedDataForRequest.rules
        // @ts-ignore
        updatedDataForRequest.rules = []

        // @ts-ignore
        Object.keys(data?.rules).map((key) => {
            // @ts-ignore
            Object.keys(data?.rules[key])?.map((controller) => {
                // @ts-ignore
                updatedDataForRequest.rules = [
                    // @ts-ignore
                    ...updatedDataForRequest.rules,
                    {
                        module: key,
                        controller,
                        // @ts-ignore
                        active: data.rules[key][controller],
                    },
                ]
            })
        })

        updateGroup(updatedDataForRequest)
            .unwrap()
            .then(() => TOAST_SUCCESS('Группа успешно обновлена'))
            .catch((error) => {
                console.error(error)
                TOAST_ERROR(`Ошибка при сохранении изменений в группе. ${error?.data?.message}`)
            })
            .finally(() => onClose())
    }

    const handleResetControls = useCallback((e: React.ChangeEvent<HTMLInputElement>, section: EGroupNaming) => {
        watch('rules')
        if (!e.target.checked) {
            setValue('rules', {
                ...defaultValues?.rules,
                [section]: {
                    ...initialData?.rules?.[section],
                },
            })
        }
    }, [])

    watch('rules')

    return (
        <form
            className={styles.Form}
            onSubmit={handleSubmit(onSubmit)}
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
                            label={'Наименование'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'name'}
                />
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                >
                    <h5>Группы</h5>
                    <Box
                        display={'flex'}
                        gap={'1rem'}
                    >
                        <CheckboxController
                            checkReset={(e) => handleResetControls(e, EGroupNaming.Group)}
                            control={control}
                            name={'rules.Group.ListController'}
                            label={EControllers.LIST}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Group]?.ListController}
                            name={'rules.Group.ShowController'}
                            label={EControllers.SHOW}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Group]?.ListController}
                            name={'rules.Group.StoreController'}
                            label={EControllers.STORE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Group]?.ListController}
                            name={'rules.Group.UpdateController'}
                            label={EControllers.UPDATE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Group]?.ListController}
                            name={'rules.Group.DeleteController'}
                            label={EControllers.DELETE}
                        />
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                >
                    <h5>Продукты</h5>
                    <Box
                        display={'flex'}
                        gap={'1rem'}
                    >
                        <CheckboxController
                            checkReset={(e) => handleResetControls(e, EGroupNaming.Product)}
                            control={control}
                            name={'rules.Product.ListController'}
                            label={EControllers.LIST}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Product]?.ListController}
                            name={'rules.Product.ShowController'}
                            label={EControllers.SHOW}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Product]?.ListController}
                            name={'rules.Product.StoreController'}
                            label={EControllers.STORE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Product]?.ListController}
                            name={'rules.Product.UpdateController'}
                            label={EControllers.UPDATE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Product]?.ListController}
                            name={'rules.Product.DeleteController'}
                            label={EControllers.DELETE}
                        />
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                >
                    <h5>Категории</h5>
                    <Box
                        display={'flex'}
                        gap={'1rem'}
                    >
                        <CheckboxController
                            checkReset={(e) => handleResetControls(e, EGroupNaming.Categories)}
                            control={control}
                            name={'rules.Category.ListController'}
                            label={EControllers.LIST}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Categories]?.ListController}
                            name={'rules.Category.ShowController'}
                            label={EControllers.SHOW}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Categories]?.ListController}
                            name={'rules.Category.StoreController'}
                            label={EControllers.STORE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Categories]?.ListController}
                            name={'rules.Category.UpdateController'}
                            label={EControllers.UPDATE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.Categories]?.ListController}
                            name={'rules.Category.DeleteController'}
                            label={EControllers.DELETE}
                        />
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                >
                    <h5>Пользователи</h5>
                    <Box
                        display={'flex'}
                        gap={'1rem'}
                    >
                        <CheckboxController
                            checkReset={(e) => handleResetControls(e, EGroupNaming.User)}
                            control={control}
                            name={'rules.User.ListController'}
                            label={EControllers.LIST}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.User]?.ListController}
                            name={'rules.User.ShowController'}
                            label={EControllers.SHOW}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.User]?.ListController}
                            name={'rules.User.StoreController'}
                            label={EControllers.STORE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.User]?.ListController}
                            name={'rules.User.UpdateController'}
                            label={EControllers.UPDATE}
                        />
                        <CheckboxController
                            control={control}
                            disabled={!getValues()?.rules?.[EGroupNaming.User]?.ListController}
                            name={'rules.User.DeleteController'}
                            label={EControllers.DELETE}
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
})
