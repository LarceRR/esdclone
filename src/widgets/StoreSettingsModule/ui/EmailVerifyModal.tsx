import { useEffect, useState } from 'react'
import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../StoreSettingsModule.module.css'

interface EmailVerifyModalProps {
    open: boolean
    initialEmail: string
    isSending: boolean
    isVerifying: boolean
    onClose: () => void
    onSendCode: (email: string) => Promise<void>
    onVerify: (email: string, code: string) => Promise<void>
}

export const EmailVerifyModal = ({
    open,
    initialEmail,
    isSending,
    isVerifying,
    onClose,
    onSendCode,
    onVerify,
}: EmailVerifyModalProps) => {
    const [step, setStep] = useState<'email' | 'code'>('email')
    const [email, setEmail] = useState(initialEmail)

    useEffect(() => {
        if (!open) return
        setStep('email')
        setEmail(initialEmail)
    }, [open, initialEmail])

    const handleClose = () => {
        setStep('email')
        setEmail(initialEmail)
        onClose()
    }

    return (
        <ModalSample
            toggleModal={open}
            onCloseModal={handleClose}
            title='Подтверждение email'
        >
            <div className={styles.modalBody}>
                {step === 'email' ? (
                    <>
                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Email</span>
                            <input
                                className={styles.input}
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='example@mail.ru'
                            />
                        </label>
                        <p className={styles.modalHint}>
                            Код подтверждения появится в консоли браузера (режим разработки).
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                type='button'
                                className={styles.modalSecondaryButton}
                                onClick={handleClose}
                            >
                                Отмена
                            </button>
                            <button
                                type='button'
                                className={styles.modalPrimaryButton}
                                disabled={isSending || !email.trim()}
                                onClick={async () => {
                                    await onSendCode(email.trim())
                                    setStep('code')
                                }}
                            >
                                Отправить код
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className={styles.modalHint}>Код отправлен для: {email}</p>
                        <label className={styles.field}>
                            <span className={styles.fieldLabel}>Код из 6 цифр</span>
                            <input
                                className={styles.input}
                                type='text'
                                inputMode='numeric'
                                maxLength={6}
                                id='email-verify-code-input'
                                placeholder='000000'
                            />
                        </label>
                        <div className={styles.modalActions}>
                            <button
                                type='button'
                                className={styles.modalSecondaryButton}
                                onClick={() => setStep('email')}
                            >
                                Назад
                            </button>
                            <button
                                type='button'
                                className={styles.modalPrimaryButton}
                                disabled={isVerifying}
                                onClick={async () => {
                                    const input = document.getElementById(
                                        'email-verify-code-input',
                                    ) as HTMLInputElement | null
                                    await onVerify(email.trim(), input?.value ?? '')
                                }}
                            >
                                Подтвердить
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ModalSample>
    )
}
