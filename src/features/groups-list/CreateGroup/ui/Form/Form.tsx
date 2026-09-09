import React, { memo, useCallback } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { EGroupNaming, IGroupCreate } from '@/shared/api/types'
import { Box, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { EControllers } from '@/features/groups-list/CreateGroup/model/types'
import styles from './Form.module.css'
import { useCreateGroupMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { CheckboxController } from '../CheckboxController/CheckboxController.tsx'
import { initialData } from '../../model/lib/initialData.ts'

interface IFormProps {
    onClose: () => void
}

export const Form: React.FC<IFormProps> = memo(({ onClose }: IFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { defaultValues },
        setValue,
        getValues,
        watch,
    } = useForm<IGroupCreate>({
        defaultValues: {
            name: '',
            rules: initialData.rules,
        },
    })
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const [createGroup, { isLoading }] = useCreateGroupMutation()

    const onSubmit: SubmitHandler<IGroupCreate> = (data) => {
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

        createGroup(updatedDataForRequest)
            .unwrap()
            .then(() => TOAST_SUCCESS(`Группа успешно создана`))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка создания группы. ${err?.data?.message}`)
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
                            fullWidth
                            label={'Наименование'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'name'}
                />
                <Box className={styles.permissionBlock}>
                    <h5 className={styles.sectionTitle}>Группы</h5>
                    <Box className={styles.checkboxRow}>
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
                <Box className={styles.permissionBlock}>
                    <h5 className={styles.sectionTitle}>Продукты</h5>
                    <Box className={styles.checkboxRow}>
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
                <Box className={styles.permissionBlock}>
                    <h5 className={styles.sectionTitle}>Категории</h5>
                    <Box className={styles.checkboxRow}>
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
                <Box className={styles.permissionBlock}>
                    <h5 className={styles.sectionTitle}>Пользователи</h5>
                    <Box className={styles.checkboxRow}>
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
                        Создать
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
