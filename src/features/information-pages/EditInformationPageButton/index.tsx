import { IconButton } from '@mui/material'
import EditIcon from '@public/icons/edit-icon.svg'
import { useNavigate } from 'react-router-dom'

interface EditInformationPageButtonProps {
    id: number
}

export const EditInformationPageButton = ({ id }: EditInformationPageButtonProps) => {
    const navigate = useNavigate()

    return (
        <IconButton
            size='large'
            onClick={() => navigate(`/information-pages/${id}/edit`)}
            aria-label='Редактировать страницу'
        >
            <EditIcon />
        </IconButton>
    )
}
