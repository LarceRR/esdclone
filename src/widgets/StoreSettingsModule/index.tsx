import styles from './StoreSettingsModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { ChangeEvent, useEffect, useId, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PageLoader } from '@/shared/ui/PageLoader'
import {
    useDeleteShopImageMutation,
    useGetShopSettingsQuery,
    useSendEmailCodeMutation,
    useUpdatePhoneMutation,
    useUpdateShopSettingsMutation,
    useUploadAvatarMutation,
    useUploadShopImageMutation,
    useVerifyEmailMutation,
} from '@/shared/api/list/shopSettingsApi'
import type { ShopImageType } from '@/shared/api/list/shopSettingsApi/types.ts'
import { maskEmail, maskName, maskPhone } from './lib/masks'
import { PhoneSetupModal } from './ui/PhoneSetupModal'
import { EmailVerifyModal } from './ui/EmailVerifyModal'
import { NameViewModal } from './ui/NameViewModal'
import { LogoutForPasswordModal } from './ui/LogoutForPasswordModal'
import { ContractModal } from './ui/ContractModal'
import { usePerformLogout } from '@/widgets/general/NavbarContent/ui/LogoutFlow/usePerformLogout'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { resolveMediaUrl } from '@/shared/lib/media/resolveMediaUrl.ts'

const SOCIAL_FIELDS = [
    { key: 'social_facebook', label: 'Facebook' },
    { key: 'social_twitter', label: 'Twitter' },
    { key: 'social_google', label: 'Google' },
    { key: 'social_youtube', label: 'YouTube' },
    { key: 'social_instagram', label: 'Instagram' },
] as const

const BANNER_SLOTS: { id: ShopImageType; label: string }[] = [
    { id: 'banner_1', label: 'Баннер магазина 1 (1920×300)' },
    { id: 'banner_2', label: 'Баннер магазина 2 (1920×300)' },
    { id: 'banner_3', label: 'Баннер магазина 3 (1920×300)' },
]

const StoreSettingsModule = () => {
    useSetPageTitle('Настройки магазина')

    const logoInputId = useId()
    const avatarInputId = useId()
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const { data: settingsResponse, isLoading, isFetching, isError, error, refetch } = useGetShopSettingsQuery()
    const [updateSettings, { isLoading: isSaving }] = useUpdateShopSettingsMutation()
    const [uploadShopImage, { isLoading: isUploadingImage }] = useUploadShopImageMutation()
    const [deleteShopImage] = useDeleteShopImageMutation()
    const [updatePhone, { isLoading: isUpdatingPhone }] = useUpdatePhoneMutation()
    const [sendEmailCode, { isLoading: isSendingCode }] = useSendEmailCodeMutation()
    const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
    const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()

    const performLogout = usePerformLogout(ELinks.RECOVERY)

    const settings = settingsResponse?.data

    const [storeName, setStoreName] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [storeMobile, setStoreMobile] = useState('')
    const [storeProfile, setStoreProfile] = useState('')
    const [welcomeMessage, setWelcomeMessage] = useState('')
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
        facebook: '',
        twitter: '',
        google: '',
        youtube: '',
        instagram: '',
    })

    const [phoneModalOpen, setPhoneModalOpen] = useState(false)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [nameModalOpen, setNameModalOpen] = useState(false)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)
    const [contractModalOpen, setContractModalOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        if (!settings) return

        setStoreName(settings.shop.name ?? '')
        setContactPerson(settings.shop.contact_person ?? '')
        setStoreMobile(settings.shop.phone ?? '')
        setStoreProfile(settings.shop.profile ?? '')
        setWelcomeMessage(settings.shop.welcome_message ?? '')
        setSocialLinks({
            facebook: settings.shop.social_facebook ?? '',
            twitter: settings.shop.social_twitter ?? '',
            google: settings.shop.social_google ?? '',
            youtube: settings.shop.social_youtube ?? '',
            instagram: settings.shop.social_instagram ?? '',
        })
    }, [settings])

    useEffect(() => {
        if (!isError) return

        const message =
            error && typeof error === 'object' && 'data' in error
                ? (error as { data?: { message?: string } }).data?.message
                : undefined

        toast.error(message || 'Не удалось загрузить настройки магазина')
    }, [isError, error])

    const user = settings?.user
    const fullName = user ? `${user.name} ${user.surname}`.trim() : ''
    const isEmailVerified = Boolean(user?.email_verified_at)
    const hasPhone = Boolean(user?.phone)

    const handleSave = async () => {
        try {
            await updateSettings({
                name: storeName,
                contact_person: contactPerson || null,
                phone: storeMobile || null,
                profile: storeProfile || null,
                welcome_message: welcomeMessage || null,
                social_facebook: socialLinks.facebook || null,
                social_twitter: socialLinks.twitter || null,
                social_google: socialLinks.google || null,
                social_youtube: socialLinks.youtube || null,
                social_instagram: socialLinks.instagram || null,
            }).unwrap()
            toast.success('Настройки сохранены')
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось сохранить настройки')
        }
    }

    const handleShopImageUpload = async (type: ShopImageType, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        try {
            await uploadShopImage({ type, file }).unwrap()
            toast.success('Изображение загружено')
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось загрузить изображение')
        }
    }

    const handleShopImageDelete = async (type: ShopImageType) => {
        try {
            await deleteShopImage(type).unwrap()
            toast.success('Изображение удалено')
        } catch {
            toast.error('Не удалось удалить изображение')
        }
    }

    const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        try {
            await uploadAvatar(file).unwrap()
            toast.success('Аватар обновлён')
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось загрузить аватар')
        }
    }

    const handlePhoneSave = async (phone: string) => {
        try {
            await updatePhone({ phone }).unwrap()
            toast.success('Номер телефона обновлён')
            setPhoneModalOpen(false)
            refetch()
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось обновить номер')
        }
    }

    const handleSendEmailCode = async (email: string) => {
        try {
            const response = await sendEmailCode({ email }).unwrap()
            const code = response.data?.debug_verification_code
            if (code) {
                console.info('[Email Verify] Код подтверждения:', code)
            }
            toast.success('Код сгенерирован — смотрите консоль браузера')
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось отправить код')
            throw error
        }
    }

    const handleVerifyEmail = async (email: string, code: string) => {
        try {
            const response = await verifyEmail({ email, code }).unwrap()
            if (response.data?.user) {
                await refetch()
            }
            toast.success('Email подтверждён')
            setEmailModalOpen(false)
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Неверный или просроченный код')
            throw error
        }
    }

    const handleLogoutForPassword = async () => {
        setIsLoggingOut(true)
        try {
            await performLogout()
        } finally {
            setIsLoggingOut(false)
            setLogoutModalOpen(false)
        }
    }

    const logoUrl = resolveMediaUrl(settings?.shop.logo_url)
    const bannerUrls: Record<ShopImageType, string | null> = {
        logo: logoUrl,
        banner_1: resolveMediaUrl(settings?.shop.banner_1_url),
        banner_2: resolveMediaUrl(settings?.shop.banner_2_url),
        banner_3: resolveMediaUrl(settings?.shop.banner_3_url),
    }
    const avatarUrl =
        resolveMediaUrl(user?.avatar_url) ?? 'https://picsum.photos/seed/store-avatar/128/128'
    const contractUrl = resolveMediaUrl(settings?.contract_url) ?? settings?.contract_url ?? ''

    return (
        <div className={styles.StoreSettingsModule}>
            <PageLoader active={isLoading || isFetching || isSaving || isUploadingImage || isUploadingAvatar} />

            <div className={styles.layout}>
                <div className={styles.column}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Общая информация</h2>

                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Название магазина</span>
                            <input
                                className={styles.input}
                                type='text'
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </label>

                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>Логотип магазина</span>
                            <div className={styles.logoUploadWrap}>
                                {logoUrl ? (
                                    <div className={styles.logoPreview}>
                                        <img
                                            src={logoUrl}
                                            alt='Логотип магазина'
                                        />
                                        <button
                                            type='button'
                                            className={styles.logoRemove}
                                            aria-label='Удалить логотип'
                                            onClick={() => handleShopImageDelete('logo')}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        className={styles.logoUploadLabel}
                                        htmlFor={logoInputId}
                                    >
                                        <span className={styles.logoUploadIcon}>🖼</span>
                                        <span>Загрузить</span>
                                        <input
                                            id={logoInputId}
                                            type='file'
                                            accept='image/*'
                                            onChange={(e) => handleShopImageUpload('logo', e)}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Контактное лицо</span>
                            <input
                                className={styles.input}
                                type='text'
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Телефон магазина</span>
                            <input
                                className={styles.input}
                                type='tel'
                                value={storeMobile}
                                onChange={(e) => setStoreMobile(e.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Профиль магазина</span>
                            <textarea
                                className={styles.textarea}
                                value={storeProfile}
                                onChange={(e) => setStoreProfile(e.target.value)}
                            />
                            <p className={styles.fieldHint}>До 200 слов</p>
                        </label>

                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Приветствие в магазине</span>
                            <textarea
                                className={styles.textarea}
                                value={welcomeMessage}
                                onChange={(e) => setWelcomeMessage(e.target.value)}
                            />
                            <p className={styles.fieldHint}>До 200 слов</p>
                        </label>

                        <div className={styles.sectionDivider}>
                            <h3 className={styles.subsectionTitle}>Настройки баннеров</h3>

                            {BANNER_SLOTS.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={styles.bannerField}
                                >
                                    <span className={styles.bannerLabel}>{slot.label}</span>
                                    {bannerUrls[slot.id] ? (
                                        <div className={styles.bannerPreview}>
                                            <img
                                                src={bannerUrls[slot.id] ?? ''}
                                                alt={slot.label}
                                            />
                                            <button
                                                type='button'
                                                className={styles.bannerRemove}
                                                onClick={() => handleShopImageDelete(slot.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ) : (
                                        <label className={styles.bannerUpload}>
                                            <span className={styles.bannerUploadIcon}>📷</span>
                                            <span>Добавить изображение</span>
                                            <input
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => handleShopImageUpload(slot.id, e)}
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className={styles.column}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Социальные сети</h2>

                        {SOCIAL_FIELDS.map((item) => (
                            <label
                                key={item.key}
                                className={styles.field}
                            >
                                <span className={styles.fieldLabel}>{item.label}</span>
                                <input
                                    className={styles.input}
                                    type='url'
                                    placeholder='Введите ссылку, начиная с https://'
                                    value={socialLinks[item.key.replace('social_', '')] ?? ''}
                                    onChange={(e) =>
                                        setSocialLinks((prev) => ({
                                            ...prev,
                                            [item.key.replace('social_', '')]: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                        ))}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Личная информация</h2>

                        <div className={styles.infoRow}>
                            <span className={styles.infoRowLabel}>Аватар</span>
                            <div className={styles.avatarRow}>
                                <img
                                    className={styles.avatar}
                                    src={avatarUrl}
                                    alt='Аватар'
                                />
                                <input
                                    ref={avatarInputRef}
                                    id={avatarInputId}
                                    type='file'
                                    accept='image/*'
                                    className={styles.hiddenInput}
                                    onChange={handleAvatarUpload}
                                />
                                <button
                                    type='button'
                                    className={styles.actionLink}
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    Изменить
                                </button>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoRowLabel}>Имя</span>
                            <div className={styles.infoRowBody}>
                                <input
                                    className={styles.input}
                                    type='text'
                                    value={maskName(fullName)}
                                    disabled
                                />
                                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                    ✓ Подтверждено
                                </span>
                                <button
                                    type='button'
                                    className={styles.actionLink}
                                    onClick={() => setNameModalOpen(true)}
                                >
                                    Просмотр
                                </button>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoRowLabel}>Мобильный номер</span>
                            <div className={styles.infoRowBody}>
                                <input
                                    className={styles.input}
                                    type='tel'
                                    value={hasPhone ? maskPhone(user?.phone) : ''}
                                    placeholder='Не указан'
                                    disabled
                                />
                                <span
                                    className={`${styles.badge} ${hasPhone ? styles.badgeSuccess : styles.badgeError}`}
                                >
                                    {hasPhone ? '✓ Задан' : '✕ Не задан'}
                                </span>
                                <button
                                    type='button'
                                    className={styles.actionLink}
                                    onClick={() => setPhoneModalOpen(true)}
                                >
                                    Настроить
                                </button>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoRowLabel}>Email</span>
                            <div className={styles.infoRowBody}>
                                <input
                                    className={styles.input}
                                    type='email'
                                    value={user?.email ? maskEmail(user.email) : ''}
                                    disabled
                                />
                                <span
                                    className={`${styles.badge} ${isEmailVerified ? styles.badgeSuccess : styles.badgeWarning}`}
                                >
                                    {isEmailVerified ? '✓ Подтверждён' : '⏱ Ожидает подтверждения'}
                                </span>
                                <button
                                    type='button'
                                    className={styles.actionLink}
                                    onClick={() => setEmailModalOpen(true)}
                                >
                                    {isEmailVerified ? 'Изменить email' : 'Подтвердить email'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.linkOnlyRow}>
                            <span className={styles.infoRowLabel}>Пароль для входа</span>
                            <button
                                type='button'
                                className={styles.actionLink}
                                onClick={() => setLogoutModalOpen(true)}
                            >
                                Изменить
                            </button>
                        </div>

                        <div className={styles.linkOnlyRow}>
                            <span className={styles.infoRowLabel}>Электронный договор</span>
                            <button
                                type='button'
                                className={styles.actionLink}
                                onClick={() => setContractModalOpen(true)}
                            >
                                Просмотр
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <div className={styles.saveBar}>
                <button
                    type='button'
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    Сохранить настройки
                </button>
            </div>

            <PhoneSetupModal
                open={phoneModalOpen}
                initialPhone={user?.phone ?? ''}
                isSaving={isUpdatingPhone}
                onClose={() => setPhoneModalOpen(false)}
                onSave={handlePhoneSave}
            />

            <EmailVerifyModal
                open={emailModalOpen}
                initialEmail={user?.email ?? ''}
                isSending={isSendingCode}
                isVerifying={isVerifyingEmail}
                onClose={() => setEmailModalOpen(false)}
                onSendCode={handleSendEmailCode}
                onVerify={handleVerifyEmail}
            />

            <NameViewModal
                open={nameModalOpen}
                fullName={fullName}
                onClose={() => setNameModalOpen(false)}
            />

            <LogoutForPasswordModal
                open={logoutModalOpen}
                isLoading={isLoggingOut}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogoutForPassword}
            />

            <ContractModal
                open={contractModalOpen}
                contractUrl={contractUrl}
                onClose={() => setContractModalOpen(false)}
            />
        </div>
    )
}

export default StoreSettingsModule
