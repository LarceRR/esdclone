import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { Box, Button, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material'
import {
    EInformationPageAccess,
    EInformationPageStatus,
    IInformationPageCreate,
    IInformationPageSeo,
    IInformationPageUpdate,
} from '@/shared/api/types'
import { useCreateInformationPageMutation, useGetInformationPageQuery, useGetInformationPagesListQuery, useUpdateInformationPageMutation } from '@/shared/api'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useToast } from '@/shared/lib/hooks/toast'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { translitSlug } from '@/shared/lib/slugify'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import styles from './InformationPageEditorModule.module.css'

interface InformationPageEditorModuleProps {
    pageId?: number
}

interface InformationPageFormValues {
    title: string
    slug: string
    access: EInformationPageAccess
    status: EInformationPageStatus
    contentHtml: string
    contentJson: string
    seo: IInformationPageSeo
}

const emptySeo: IInformationPageSeo = {
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    noIndex: false,
}

const defaultValues: InformationPageFormValues = {
    title: '',
    slug: '',
    access: EInformationPageAccess.Public,
    status: EInformationPageStatus.Draft,
    contentHtml: '<p></p>',
    contentJson: '',
    seo: emptySeo,
}

const urlFieldSx = {
    '& .MuiInputAdornment-root': {
        marginRight: 0,
    },
    '& .MuiInputAdornment-root .MuiTypography-root': {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        opacity: 0.55,
    },
    '& .MuiOutlinedInput-input': {
        paddingLeft: 0,
    },
}

function getPublicUrlPrefix(shopSlug: string): string {
    const suffix = shopSlug ? `/p/${shopSlug}/` : '/p/'
    if (typeof window === 'undefined') return suffix
    return `${window.location.origin}${suffix}`
}

function getErrorMessage(err: unknown): string {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return 'Ошибка сохранения страницы'
}

export const InformationPageEditorModule = ({ pageId }: InformationPageEditorModuleProps) => {
    const isEdit = typeof pageId === 'number' && pageId > 0
    const navigate = useNavigate()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { data: listData } = useGetInformationPagesListQuery()
    const [createPage, { isLoading: isCreating }] = useCreateInformationPageMutation()
    const [updatePage, { isLoading: isUpdating }] = useUpdateInformationPageMutation()
    const { data: pageData, isLoading: isPageLoading, isError } = useGetInformationPageQuery(pageId || 0, {
        skip: !isEdit,
    })

    const shopSlug = pageData?.data?.shopSlug || listData?.data?.shopSlug || ''
    const publicUrlPrefix = useMemo(() => getPublicUrlPrefix(shopSlug), [shopSlug])

    const [autoSlug, setAutoSlug] = useState(!isEdit)

    const {        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<InformationPageFormValues>({
        defaultValues,
    })

    const title = watch('title')
    const contentHtml = watch('contentHtml')

    useSetPageTitle(isEdit ? 'Редактирование страницы' : 'Создание страницы')

    useEffect(() => {
        if (!pageData?.data) return

        reset({
            title: pageData.data.title,
            slug: pageData.data.slug,
            access: pageData.data.access,
            status: pageData.data.status,
            contentHtml: pageData.data.contentHtml || '<p></p>',
            contentJson: pageData.data.contentJson,
            seo: pageData.data.seo,
        })
        setAutoSlug(false)
    }, [pageData?.data, reset])

    useEffect(() => {
        if (!autoSlug) return
        setValue('slug', translitSlug(title), { shouldValidate: true })
    }, [autoSlug, setValue, title])

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isDirty) return
            event.preventDefault()
            event.returnValue = ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

    const onSubmit: SubmitHandler<InformationPageFormValues> = (values) => {
        const payload: IInformationPageCreate = {
            ...values,
            slug: translitSlug(values.slug),
        }

        const request = isEdit
            ? updatePage({ ...payload, id: pageId } as IInformationPageUpdate).unwrap()
            : createPage(payload).unwrap()

        request
            .then(() => {
                TOAST_SUCCESS(isEdit ? 'Страница сохранена' : 'Страница создана')
                navigate(ELinks.INFORMATION_PAGES)
            })
            .catch((err) => {
                TOAST_ERROR(getErrorMessage(err))
            })
    }

    if (isPageLoading) return <LoaderTable />
    if (isEdit && isError) {
        return (
            <Box className={styles.card}>
                <Typography>Страница не найдена</Typography>
                <Button
                    variant='contained'
                    onClick={() => navigate(ELinks.INFORMATION_PAGES)}
                >
                    Вернуться к списку
                </Button>
            </Box>
        )
    }

    return (
        <div className={styles.EditorModule}>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.stack}>
                    <Box className={styles.card}>
                        <Typography variant='h6'>Основная информация</Typography>
                        <Controller
                            control={control}
                            name='title'
                            rules={{ required: 'Введите заголовок страницы' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    size='small'
                                    label='Заголовок'
                                    error={Boolean(errors.title)}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='slug'
                            rules={{
                                required: 'Введите URL страницы',
                                validate: (value) => Boolean(translitSlug(value)) || 'URL должен содержать буквы или цифры',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    size='small'
                                    label='URL'
                                    error={Boolean(errors.slug)}
                                    helperText={errors.slug?.message}
                                    sx={urlFieldSx}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>{publicUrlPrefix}</InputAdornment>,
                                    }}
                                    onChange={(event) => {
                                        setAutoSlug(false)
                                        field.onChange(translitSlug(event.target.value))
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Box className={styles.card}>
                        <Typography variant='h6'>Содержимое страницы</Typography>
                        <Controller
                            control={control}
                            name='contentHtml'
                            render={() => (
                                <RichTextEditor
                                    value={contentHtml}
                                    onChange={({ html, json }) => {
                                        setValue('contentHtml', html, { shouldDirty: true })
                                        setValue('contentJson', json, { shouldDirty: true })
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Box className={styles.card}>
                        <Typography variant='h6'>Настройки</Typography>
                        <Controller
                            control={control}
                            name='access'
                            render={({ field }) => (
                                <FormControl
                                    fullWidth
                                    size='small'
                                >
                                    <InputLabel id='information-page-access-label'>Доступность</InputLabel>
                                    <Select
                                        {...field}
                                        labelId='information-page-access-label'
                                        label='Доступность'
                                    >
                                        <MenuItem value={EInformationPageAccess.Public}>Всем</MenuItem>
                                        <MenuItem value={EInformationPageAccess.Authenticated}>Только авторизованным</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            control={control}
                            name='status'
                            render={({ field }) => (
                                <FormControl
                                    fullWidth
                                    size='small'
                                >
                                    <InputLabel id='information-page-status-label'>Статус</InputLabel>
                                    <Select
                                        {...field}
                                        labelId='information-page-status-label'
                                        label='Статус'
                                    >
                                        <MenuItem value={EInformationPageStatus.Draft}>Черновик</MenuItem>
                                        <MenuItem value={EInformationPageStatus.Published}>Опубликовано</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>

                    <Box className={styles.card}>
                        <Typography variant='h6'>SEO</Typography>
                        <Controller
                            control={control}
                            name='seo.metaTitle'
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    size='small'
                                    label='Meta title'
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='seo.metaDescription'
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    size='small'
                                    label='Meta description'
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='seo.ogTitle'
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    size='small'
                                    label='OG title'
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='seo.ogDescription'
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    size='small'
                                    label='OG description'
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name='seo.noIndex'
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={field.value}
                                            onChange={(event) => field.onChange(event.target.checked)}
                                        />
                                    }
                                    label='Запретить индексацию'
                                />
                            )}
                        />
                    </Box>
                </div>

                <Box className={styles.actions}>
                    <LoadingButton
                        loading={isCreating || isUpdating}
                        type='submit'
                        variant='contained'
                    >
                        Сохранить
                    </LoadingButton>
                    <Button
                        variant='outlined'
                        color='error'
                        onClick={() => navigate(ELinks.INFORMATION_PAGES)}
                    >
                        Отменить
                    </Button>
                </Box>
            </form>
        </div>
    )
}
