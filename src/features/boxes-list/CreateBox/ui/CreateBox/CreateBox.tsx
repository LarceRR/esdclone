import { memo, useCallback, useState } from 'react'
import { Button } from '@mui/material'
import { Form } from '../Form/Form.tsx'
import { ModalSample } from '@/shared/ui/ModalSample'

export const CreateBox = memo(({ stylesButton }: { stylesButton?: React.CSSProperties }) => {
    const [toggleCreateModal, setToggleCreateModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleCreateModal(true), [])
    const onCloseModal = useCallback(() => setToggleCreateModal(false), [])

    return (
        <>
            <Button
                sx={{ ...stylesButton }}
                size={'medium'}
                variant={'contained'}
                onClick={onOpenModal}
            >
                Добавить бокс
            </Button>
            <ModalSample
                toggleModal={toggleCreateModal}
                onCloseModal={onCloseModal}
                title={'Добавить пост'}
            >
                <Form onClose={onCloseModal} />
            </ModalSample>
        </>
    )
})
