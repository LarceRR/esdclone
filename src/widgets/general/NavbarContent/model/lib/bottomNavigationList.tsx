import { ESection, INavigationList } from '../types'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { SpeedIcon } from '@/shared/ui/icons/SpeedIcon.tsx'
import { GroupRoundedIcon } from '@/shared/ui/icons/GroupRoundedIcon.tsx'
import { GroupsRoundedIcon } from '@/shared/ui/icons/GroupsRoundedIcon.tsx'
import ArticleIcon from '@mui/icons-material/Article'
import ViewListRoundedIcon from '@/shared/ui/icons/ViewListRoundedIcon'
import CategoryRoundedIcon from '@/shared/ui/icons/CategoryRoundedIcon'

export const bottomNavigationList: INavigationList[] = [
    {
        path: ELinks.DASHBOARD,
        title: 'Дэшборд',
        icon: <SpeedIcon color='currentColor' />,
    },
    {
        path: ELinks.PRODUCT_HOLD,
        title: 'Товары',
        icon: <ViewListRoundedIcon color='currentColor' />,
        section: ESection.Product,
    },
    {
        path: ELinks.CATEGORIES,
        title: 'Категории',
        icon: <CategoryRoundedIcon color='currentColor' />,
        section: ESection.Categories,
    },
    {
        path: ELinks.USERS_LIST,
        title: 'Пользователи',
        icon: <GroupRoundedIcon />,
        section: ESection.User,
    },
    {
        path: ELinks.GROUPS_LIST,
        title: 'Группы',
        icon: <GroupsRoundedIcon />,
        section: ESection.Group,
    },
    {
        path: ELinks.INFORMATION_PAGES,
        title: 'Страницы',
        icon: <ArticleIcon />,
    },
]
