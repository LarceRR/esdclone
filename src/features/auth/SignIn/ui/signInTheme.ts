export const SIGN_IN_ACCENT_COLOR = '#F47139'
export const SIGN_IN_ACCENT_HOVER_COLOR = '#DB5F2A'

export const signInTextFieldSx = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#fff',
    },
    '& input': {
        backgroundColor: 'transparent',
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #fff inset',
        WebkitTextFillColor: 'var(--text-color)',
    },
    '& label.Mui-focused': {
        color: SIGN_IN_ACCENT_COLOR,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: SIGN_IN_ACCENT_COLOR,
    },
}

export const signInButtonSx = {
    backgroundColor: SIGN_IN_ACCENT_COLOR,
    '&:hover': {
        backgroundColor: SIGN_IN_ACCENT_HOVER_COLOR,
    },
}
