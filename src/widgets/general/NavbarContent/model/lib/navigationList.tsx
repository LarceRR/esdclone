import { ESection, INavigationList } from '../types'
import { ELinks } from '@/shared/constants/appLinks.ts'
import OrderIcon from '@public/icons/order-icon.svg'
import HomeIcon from '@public/icons/home-icon.svg'
import MoneyIcon from '@public/icons/money-icon.svg'

export const navigationList: INavigationList[] = [
    {
        path: ELinks.WORK_ORDERS,
        title: 'Заказ-наряды',
        icon: <OrderIcon />,
        section: ESection.Categories,
    },
    {
        path: ELinks.DASHBOARD,
        title: 'Дэшборд',
        icon: <HomeIcon />,
    },
    {
        path: ELinks.MONEY_LIST,
        title: 'Деньги',
        icon: <MoneyIcon />,
    },
    // {
    //     path: ELinks.STOCK_GOODS_LIST,
    //     title: 'Склад',
    //     icon: <StockIcon />,
    // },
]
