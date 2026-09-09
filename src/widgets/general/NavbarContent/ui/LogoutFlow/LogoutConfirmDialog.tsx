import React, { memo } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export interface LogoutConfirmDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = memo(({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>Вы действительно хотите выйти?</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    {`После нажатия на кнопку "Подтвердить" вы совершите выход из системы. Вы подтверждаете действие?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant={'outlined'}
                    color={'primary'}
                    size={'medium'}
                    onClick={onClose}
                >
                    Отменить
                </Button>
                <Button
                    size={'medium'}
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => void Promise.resolve(onConfirm())}
                >
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    )
})
