export const validateEmail = {
    required: 'Обязательно для заполнения',
    validate: (value: string) => {
        if (
            !value
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                )
        ) {
            return 'Неправильный формат почты'
        }
        return true
    },
}
export const validatePhoneNumber = {
    required: 'Обязательно для заполнения',
    validate: (value: string) => {
        if (value.match(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/)) {
            return 'Неправильный формат телефона'
        }
        return true
    },
}
export const validateName = {
    required: 'Обязательно для заполнения',
    validate: (value: string) => {
        if (value.length < 2) {
            return 'Введите правильный формат имени'
        }
        return true
    },
}
