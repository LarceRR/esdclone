const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const validatePhoneNumber = {
    required: 'Обязательно для заполнения',
    validate: (value: string) => {
        const digits = digitsOnly(value)
        // 10–11 цифр: и мобильный РФ (9… / 7…), и тестовые логины вроде 1234567890
        if (digits.length < 10 || digits.length > 11) {
            return 'Неправильный формат телефона'
        }
        return true
    },
}
export const validatePassword = {
    required: 'Обязательно для заполнения',
    validate: (value: string) => {
        if (value.length < 4) {
            return 'Минимальная длина пароля 4 символов'
        }
        return true
    },
}

export const validateEmail = {
    required: 'Обязательно для заполнения',
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Некорректный email',
    },
}
