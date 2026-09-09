import styles from './WalletDepositModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useCreateWalletDepositMutation, useGetWalletAddressesQuery, useGetWalletSummaryQuery } from '@/shared/api'
import { walletCurrencies, walletNetworksByCurrency } from '@/shared/api/list/walletApi/types.ts'
import { formatWalletMoney } from '@/widgets/WalletModule/mockData'

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const WalletDepositModule = () => {
    useSetPageTitle('Пополнение')
    const navigate = useNavigate()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const [currency, setCurrency] = useState<(typeof walletCurrencies)[number]>('USDT')
    const [network, setNetwork] = useState('TRC20')
    const [amount, setAmount] = useState('')
    const [proofFile, setProofFile] = useState<File | null>(null)

    const { data: summaryResponse } = useGetWalletSummaryQuery()
    const { data: addressesResponse, isLoading: isAddressesLoading } = useGetWalletAddressesQuery({
        currency,
        network,
    })
    const [createWalletDeposit, { isLoading: isSubmitting }] = useCreateWalletDepositMutation()

    const networks = walletNetworksByCurrency[currency]
    const activeNetwork = networks.includes(network) ? network : networks[0]

    useEffect(() => {
        if (!networks.includes(network)) {
            setNetwork(networks[0])
        }
    }, [currency, network, networks])

    const depositAddress =
        addressesResponse?.data.find((item) => item.currency === currency && item.network === activeNetwork)?.address ??
        ''

    const pendingAmount = useMemo(() => {
        const parsed = Number(amount)
        return Number.isFinite(parsed) && parsed > 0 ? parsed.toFixed(2) : '0.00'
    }, [amount])

    const qrSrc = useMemo(
        () =>
            depositAddress
                ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(depositAddress)}`
                : '',
        [depositAddress],
    )

    const handleCurrencyChange = (nextCurrency: (typeof walletCurrencies)[number]) => {
        setCurrency(nextCurrency)
        setNetwork(walletNetworksByCurrency[nextCurrency][0])
    }

    const handleCopyAddress = async () => {
        if (!depositAddress) {
            TOAST_ERROR('Адрес для пополнения не найден')
            return
        }

        try {
            await navigator.clipboard.writeText(depositAddress)
            TOAST_SUCCESS('Адрес скопирован')
        } catch {
            TOAST_ERROR('Не удалось скопировать адрес')
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const parsedAmount = Number(amount)
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            TOAST_ERROR('Введите сумму пополнения')
            return
        }

        try {
            const response = await createWalletDeposit({
                amount: parsedAmount,
                currency,
                network: activeNetwork,
                proof: proofFile,
            }).unwrap()

            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось отправить заявку')
                return
            }

            TOAST_SUCCESS(response.message || 'Заявка на пополнение отправлена')
            navigate(ELinks.MONEY_LIST)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось отправить заявку'))
        }
    }

    const balance = summaryResponse?.data.balance ?? 0

    return (
        <div className={styles.WalletDepositModule}>
            <PageLoader active={isAddressesLoading || isSubmitting} />

            <Link
                className={styles.backLink}
                to={ELinks.MONEY_LIST}
            >
                ← Назад к кошельку
            </Link>

            <p className={styles.balanceHint}>Текущий баланс: {formatWalletMoney(balance)}</p>

            <section className={styles.formPanel}>
                <form
                    className={styles.form}
                    onSubmit={(event) => void handleSubmit(event)}
                >
                    <div className={styles.qrBlock}>
                        {qrSrc ? (
                            <img
                                className={styles.qrImage}
                                src={qrSrc}
                                alt='QR-код для пополнения'
                            />
                        ) : (
                            <div className={styles.qrPlaceholder}>Адрес загружается...</div>
                        )}
                        <p className={styles.qrHint}>Отсканируйте QR-код</p>
                    </div>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Валюта</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.optionGroup}>
                                {walletCurrencies.map((item) => (
                                    <button
                                        className={
                                            currency === item
                                                ? `${styles.optionButton} ${styles.optionButtonActive}`
                                                : styles.optionButton
                                        }
                                        type='button'
                                        key={item}
                                        onClick={() => handleCurrencyChange(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Сеть блокчейн</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.optionGroup}>
                                {networks.map((item) => (
                                    <button
                                        className={
                                            activeNetwork === item
                                                ? `${styles.optionButton} ${styles.optionButtonActive}`
                                                : styles.optionButton
                                        }
                                        type='button'
                                        key={item}
                                        onClick={() => setNetwork(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Адрес для пополнения</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.addressRow}>
                                <input
                                    className={styles.input}
                                    type='text'
                                    value={depositAddress}
                                    readOnly
                                />
                                <button
                                    className={styles.copyButton}
                                    type='button'
                                    onClick={() => void handleCopyAddress()}
                                >
                                    Копировать
                                </button>
                            </div>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Сумма пополнения</span>
                        <div className={styles.fieldControl}>
                            <input
                                className={styles.input}
                                type='text'
                                value={amount}
                                placeholder='Пожалуйста, введите сумму пополнения'
                                onChange={(event) => setAmount(event.target.value)}
                            />
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Ожидаемая сумма (курс 1:1)</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.inputWithSuffix}>
                                <input
                                    type='text'
                                    value={pendingAmount}
                                    readOnly
                                />
                                <b>{currency}</b>
                            </div>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Загрузите фото или скриншот подтверждения оплаты</span>
                        <div className={styles.fieldControl}>
                            <label className={styles.uploadArea}>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                                />
                                📷
                            </label>
                        </div>
                    </label>

                    <button
                        className={styles.submitButton}
                        type='submit'
                        disabled={isSubmitting}
                    >
                        Отправить
                    </button>
                </form>
            </section>
        </div>
    )
}

export default WalletDepositModule
