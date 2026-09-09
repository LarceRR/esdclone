import { useNavigate } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'

export const CreateInformationPage = () => {
    const navigate = useNavigate()

    return (
        <CreatePlusTrigger
            label='Создать страницу'
            onClick={() => navigate(ELinks.INFORMATION_PAGE_CREATE)}
        />
    )
}
