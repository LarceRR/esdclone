import { useEffect, useState } from 'react'
import { ModalSample } from '@/shared/ui/ModalSample'
import { PageLoader } from '@/shared/ui/PageLoader'
import {
    useCreateShopOrderMutation,
    useGetShopOrderMutation,
    useUpdateShopOrderMutation,
} from '@/shared/api'
import type { IShopOrderStorePayload } from '@/shared/api/list/shopOrdersApi/types.ts'
import styles from '../SalesListModule.module.css'

const paymentStatuses = ['Оплачен', 'Не оплачен', 'Ожидает оплаты', 'Частично оплачен', 'Возврат']
const purchaseStatuses = ['Куплен', 'Ожидает покупки', 'В обработке', 'Отменён']
const logisticsStatuses = [
    'Ожидает оплаты покупателем',
    'Покупатель оплатил',
    'Поставщики получили заказы',
    'Транспортируется',
    'Подписано покупателем',
    'Заказ завершён',
]

const defaultForm: IShopOrderStorePayload = {
    consignee_name: '',
    consignee_email: '',
    consignee_phone: '',
    sales_amount: 0,
    purchase_amount: 0,
    payment_method: '',
    payment_status: 'Ожидает оплаты',
    purchase_status: 'Ожидает покупки',
    logistics_status: 'Ожидает оплаты покупателем',
    products: [
        {
            product_number: '',
            product_name: '',
            specification: '',
            quantity: 1,
            image: null,
            price: 0,
        },
    ],
}

interface ShopOrderFormModalProps {
    open: boolean
    orderId: number | null
    onClose: () => void
    onSuccess: (message: string) => void
    onError: (message: string) => void
}

export const ShopOrderFormModal = ({ open, orderId, onClose, onSuccess, onError }: ShopOrderFormModalProps) => {
    const isEdit = orderId != null
    const [form, setForm] = useState<IShopOrderStorePayload>(defaultForm)
    const [getShopOrder] = useGetShopOrderMutation()
    const [createShopOrder, { isLoading: isCreating }] = useCreateShopOrderMutation()
    const [updateShopOrder, { isLoading: isUpdating }] = useUpdateShopOrderMutation()
    const [isLoadingOrder, setIsLoadingOrder] = useState(false)

    const isSaving = isCreating || isUpdating

    useEffect(() => {
        if (!open) {
            setForm(defaultForm)
            setIsLoadingOrder(false)
            return
        }

        if (!isEdit) {
            setForm(defaultForm)
            return
        }

        setIsLoadingOrder(true)
        getShopOrder(orderId)
            .unwrap()
            .then((response) => {
                const { order, products } = response.data
                setForm({
                    consignee_name: order.consignee_name,
                    consignee_email: order.consignee_email ?? '',
                    consignee_phone: order.consignee_phone ?? '',
                    consignee_address: order.consignee_address ?? '',
                    consignee_country: order.consignee_country ?? '',
                    consignee_province: order.consignee_province ?? '',
                    consignee_city: order.consignee_city ?? '',
                    consignee_postal_code: order.consignee_postal_code ?? '',
                    sales_amount: Number(order.sales_amount),
                    purchase_amount: Number(order.purchase_amount ?? 0),
                    profit: order.profit != null ? Number(order.profit) : undefined,
                    payment_method: order.payment_method ?? '',
                    payment_status: order.payment_status,
                    purchase_status: order.purchase_status,
                    logistics_status: order.logistics_status,
                    order_time: order.order_time,
                    products: products.length
                        ? products.map((product) => ({
                              product_number: product.product_number,
                              product_name: product.product_name,
                              specification: product.specification,
                              quantity: product.quantity,
                              image: product.image,
                              price: product.price != null ? Number(product.price) : null,
                          }))
                        : defaultForm.products,
                })
            })
            .catch(() => onError('Не удалось загрузить заказ'))
            .finally(() => setIsLoadingOrder(false))
    }, [open, isEdit, orderId, getShopOrder, onError])

    const updateField = <K extends keyof IShopOrderStorePayload>(key: K, value: IShopOrderStorePayload[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        if (!form.consignee_name.trim()) {
            onError('Укажите имя получателя')
            return
        }

        if (!form.products?.[0]?.product_name?.trim()) {
            onError('Укажите название товара')
            return
        }

        const salesAmount = Number(form.sales_amount)
        const purchaseAmount = Number(form.purchase_amount ?? 0)

        if (Number.isNaN(salesAmount) || salesAmount < 0) {
            onError('Укажите корректную сумму продаж')
            return
        }

        const payload: IShopOrderStorePayload = {
            ...form,
            consignee_name: form.consignee_name.trim(),
            sales_amount: salesAmount,
            purchase_amount: purchaseAmount,
            profit: salesAmount - purchaseAmount,
        }

        try {
            if (isEdit && orderId != null) {
                const response = await updateShopOrder({ id: orderId, ...payload }).unwrap()
                onSuccess(response.message || 'Заказ изменён')
            } else {
                const response = await createShopOrder(payload).unwrap()
                onSuccess(response.message || 'Заказ создан')
            }
            onClose()
        } catch (err: unknown) {
            onError(getErrorMessage(err, isEdit ? 'Не удалось изменить заказ' : 'Не удалось создать заказ'))
        }
    }

    return (
        <ModalSample
            title={isEdit ? 'Редактировать заказ' : 'Создать заказ'}
            toggleModal={open}
            onCloseModal={onClose}
            style={{ width: 'min(52rem, calc(100vw - 1.5rem))' }}
        >
            <div className={styles.modalBody}>
                <PageLoader active={isLoadingOrder || isSaving} />
                <div className={styles.orderForm}>
                    <div className={styles.formGrid}>
                        <label className={styles.formField}>
                            <span>Имя получателя *</span>
                            <input
                                type='text'
                                value={form.consignee_name}
                                onChange={(event) => updateField('consignee_name', event.target.value)}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Email</span>
                            <input
                                type='email'
                                value={form.consignee_email ?? ''}
                                onChange={(event) => updateField('consignee_email', event.target.value)}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Телефон</span>
                            <input
                                type='text'
                                value={form.consignee_phone ?? ''}
                                onChange={(event) => updateField('consignee_phone', event.target.value)}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Сумма продаж *</span>
                            <input
                                type='number'
                                min={0}
                                step='0.01'
                                value={form.sales_amount}
                                onChange={(event) => updateField('sales_amount', Number(event.target.value))}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Сумма покупки</span>
                            <input
                                type='number'
                                min={0}
                                step='0.01'
                                value={form.purchase_amount ?? 0}
                                onChange={(event) => updateField('purchase_amount', Number(event.target.value))}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Метод оплаты</span>
                            <input
                                type='text'
                                value={form.payment_method ?? ''}
                                onChange={(event) => updateField('payment_method', event.target.value)}
                            />
                        </label>
                        <label className={styles.formField}>
                            <span>Статус оплаты</span>
                            <select
                                value={form.payment_status}
                                onChange={(event) => updateField('payment_status', event.target.value)}
                            >
                                {paymentStatuses.map((status) => (
                                    <option
                                        value={status}
                                        key={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.formField}>
                            <span>Статус покупки</span>
                            <select
                                value={form.purchase_status}
                                onChange={(event) => updateField('purchase_status', event.target.value)}
                            >
                                {purchaseStatuses.map((status) => (
                                    <option
                                        value={status}
                                        key={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.formField}>
                            <span>Статус логистики</span>
                            <select
                                value={form.logistics_status}
                                onChange={(event) => updateField('logistics_status', event.target.value)}
                            >
                                {logisticsStatuses.map((status) => (
                                    <option
                                        value={status}
                                        key={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <section className={styles.modalBlock}>
                        <h3>Товар</h3>
                        <div className={styles.formProductBlock}>
                            <div className={styles.formGrid}>
                                <label className={styles.formField}>
                                <span>Номер товара</span>
                                <input
                                    type='text'
                                    value={form.products?.[0]?.product_number ?? ''}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            products: [
                                                {
                                                    ...(prev.products?.[0] ?? defaultForm.products![0]),
                                                    product_number: event.target.value,
                                                },
                                            ],
                                        }))
                                    }
                                />
                            </label>
                            <label className={styles.formField}>
                                <span>Название товара *</span>
                                <input
                                    type='text'
                                    value={form.products?.[0]?.product_name ?? ''}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            products: [
                                                {
                                                    ...(prev.products?.[0] ?? defaultForm.products![0]),
                                                    product_name: event.target.value,
                                                },
                                            ],
                                        }))
                                    }
                                />
                            </label>
                            <label className={styles.formField}>
                                <span>Количество</span>
                                <input
                                    type='number'
                                    min={1}
                                    value={form.products?.[0]?.quantity ?? 1}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            products: [
                                                {
                                                    ...(prev.products?.[0] ?? defaultForm.products![0]),
                                                    quantity: Number(event.target.value),
                                                },
                                            ],
                                        }))
                                    }
                                />
                            </label>
                            <label className={styles.formField}>
                                <span>Цена</span>
                                <input
                                    type='number'
                                    min={0}
                                    step='0.01'
                                    value={form.products?.[0]?.price ?? 0}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            products: [
                                                {
                                                    ...(prev.products?.[0] ?? defaultForm.products![0]),
                                                    price: Number(event.target.value),
                                                },
                                            ],
                                        }))
                                    }
                                />
                            </label>
                            </div>
                        </div>
                    </section>

                    <div className={styles.filterActions}>
                        <button
                            className={styles.primaryButton}
                            type='button'
                            disabled={isSaving || isLoadingOrder}
                            onClick={handleSubmit}
                        >
                            {isEdit ? 'Сохранить' : 'Создать'}
                        </button>
                        <button
                            className={styles.secondaryButton}
                            type='button'
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </ModalSample>
    )
}

function getErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}
