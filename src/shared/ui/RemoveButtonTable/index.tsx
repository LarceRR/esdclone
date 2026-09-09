import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CartIcon from '@public/icons/cart-icon.svg'
import styles from './removeButton.module.css'

interface IProps {
    onClose: () => void
    onOpen: () => void
    handleRemove: () => void
    toggle: boolean
    isLoading: boolean
    disabled?: boolean
    isIcon?: {
        active: boolean
        text?: string
    }
}

export const RemoveButtonTable = (props: IProps) => {
    const { onClose, onOpen, handleRemove, isIcon, toggle, isLoading, disabled } = props
    return (
        <>
            {isIcon?.active ? (
                <Box
                    onClick={onOpen}
                    sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'red' }}
                >
                    <CartIcon />
                    {isIcon?.text ? isIcon?.text : ''}
                </Box>
            ) : (
                <IconButton
                    className={styles.iconButton}
                    disabled={disabled || false}
                    size={'large'}
                    onClick={onOpen}
                >
                    <CartIcon />
                </IconButton>
            )}
            <Dialog
                open={toggle}
                onClose={onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>Вы подтверждаете удаление?</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {`После нажатия на кнопку "Подтвердить удаление" элемент будет удален.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant={'outlined'}
                        color={'error'}
                        size={'medium'}
                        onClick={onClose}
                    >
                        Отменить
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        size={'medium'}
                        variant={'contained'}
                        color={'error'}
                        onClick={handleRemove}
                    >
                        Подтвердить удаление
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
