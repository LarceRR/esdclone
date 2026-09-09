import styles from './WalletWithdrawModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { FormEvent, useMemo, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useCreateWalletWithdrawMutation, useGetWalletSummaryQuery } from '@/shared/api'
import {
    WALLET_WITHDRAW_FEE_PERCENT,
    WALLET_WITHDRAW_MIN_USDT,
    walletWithdrawNetworks,
} from '@/shared/api/list/walletApi/types.ts'
import { formatWalletMoney } from '@/widgets/WalletModule/mockData'

const methods = ['Виртуальная валюта']
const currencies = ['USDT', 'ETH']

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const WalletWithdrawModule = () => {
    useSetPageTitle('Вывод средств')
    const navigate = useNavigate()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const [method, setMethod] = useState(methods[0])
    const [currency, setCurrency] = useState(currencies[0])
    const [network, setNetwork] = useState<string>(walletWithdrawNetworks[0])
    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('')

    const { data: summaryResponse, isFetching: isSummaryLoading } = useGetWalletSummaryQuery()
    const [createWalletWithdraw, { isLoading: isSubmitting }] = useCreateWalletWithdrawMutation()

    const balance = summaryResponse?.data.balance ?? 0
    const parsedAmount = Number(amount)
    const validAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0
    const serviceFee = validAmount * (WALLET_WITHDRAW_FEE_PERCENT / 100)
    const actualReceived = Math.max(validAmount - serviceFee, 0)

    const actualReceivedLabel = useMemo(() => actualReceived.toFixed(6), [actualReceived])
    const serviceFeeLabel = useMemo(() => serviceFee.toFixed(2), [serviceFee])

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!address.trim()) {
            TOAST_ERROR('Введите адрес вывода')
            return
        }

        if (currency === 'USDT' && validAmount < WALLET_WITHDRAW_MIN_USDT) {
            TOAST_ERROR(`Минимальная сумма вывода — ${WALLET_WITHDRAW_MIN_USDT} USDT`)
            return
        }

        if (validAmount <= 0) {
            TOAST_ERROR('Введите сумму вывода')
            return
        }

        try {
            const response = await createWalletWithdraw({
                amount: validAmount,
                currency,
                network,
                address: address.trim(),
            }).unwrap()

            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось отправить заявку')
                return
            }

            TOAST_SUCCESS(response.message || 'Заявка на вывод отправлена')
            navigate(ELinks.MONEY_LIST)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось отправить заявку'))
        }
    }

    return (
        <div className={styles.WalletWithdrawModule}>
            <PageLoader active={isSummaryLoading || isSubmitting} />

            <Link
                className={styles.backLink}
                to={ELinks.MONEY_LIST}
            >
                ← Назад к кошельку
            </Link>

            <section className={styles.formPanel}>
                <form
                    className={styles.form}
                    onSubmit={(event) => void handleSubmit(event)}
                >
                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>
                            <span className={styles.required}>* </span>
                            Способ вывода
                        </span>
                        <select
                            className={styles.select}
                            value={method}
                            onChange={(event) => setMethod(event.target.value)}
                        >
                            {methods.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>
                            <span className={styles.required}>* </span>
                            Валюта вывода
                        </span>
                        <select
                            className={styles.select}
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value)}
                        >
                            {currencies.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>
                            <span className={styles.required}>* </span>
                            Сеть вывода
                        </span>
                        <select
                            className={styles.select}
                            value={network}
                            onChange={(event) => setNetwork(event.target.value)}
                        >
                            {walletWithdrawNetworks.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>
                            <span className={styles.required}>* </span>
                            Адрес вывода
                        </span>
                        <input
                            className={styles.input}
                            type='text'
                            value={address}
                            placeholder='Пожалуйста, введите адрес вывода'
                            onChange={(event) => setAddress(event.target.value)}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>
                            <span className={styles.required}>* </span>
                            Сумма вывода
                        </span>
                        <div className={styles.fieldControl}>
                            <div className={styles.inputWithSuffix}>
                                <input
                                    type='text'
                                    value={amount}
                                    placeholder={`Диапазон вывода ≥ ${WALLET_WITHDRAW_MIN_USDT} USDT`}
                                    onChange={(event) => setAmount(event.target.value)}
                                />
                                <b>{currency}</b>
                            </div>
                            <span className={styles.hint}>Баланс {formatWalletMoney(balance)}</span>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Фактически получено</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.inputWithSuffix}>
                                <input
                                    type='text'
                                    value={actualReceivedLabel}
                                    readOnly
                                />
                                <b>{currency}</b>
                            </div>
                            <span className={styles.hint}>≈ {actualReceivedLabel} {currency}</span>
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.fieldLabel}>Комиссия за обслуживание</span>
                        <div className={styles.fieldControl}>
                            <div className={styles.inputWithSuffix}>
                                <input
                                    type='text'
                                    value={serviceFeeLabel}
                                    readOnly
                                />
                                <b>{WALLET_WITHDRAW_FEE_PERCENT}.00%</b>
                                <b>{currency}</b>
                            </div>
                            <span className={styles.hint}>≈ {serviceFeeLabel} {currency}</span>
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

export default WalletWithdrawModule
