import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AppsIcon from '@mui/icons-material/Apps'
import SettingsIcon from '@mui/icons-material/Settings'
import { SpeedIcon } from '@/shared/ui/icons/SpeedIcon.tsx'
import { ListAltRoundedIcon } from '@/shared/ui/icons/ListAltRoundedIcon.tsx'
import { FinancialReportIcon } from '@/shared/ui/icons/FinancialReportIcon.tsx'
import { TextAdRoundedIcon } from '@/shared/ui/icons/TextAdRoundedIcon.tsx'
import { ShoppingBagIcon } from '@/shared/ui/icons/ShoppingBagIcon.tsx'
import { BorderAllRoundedIcon } from '@/shared/ui/icons/BorderAllRoundedIcon.tsx'
import { BarChart4BarsRoundedIcon } from '@/shared/ui/icons/BarChart4BarsRoundedIcon.tsx'
import { ShoppingBagOutlineIcon } from '@/shared/ui/icons/ShoppingBagOutlineIcon.tsx'
import { ErrorCircleRoundedIcon } from '@/shared/ui/icons/ErrorCircleRoundedIcon.tsx'
import { AndroidMessagesOutlineIcon } from '@/shared/ui/icons/AndroidMessagesOutlineIcon.tsx'
import { HomeRoundedIcon } from '@/shared/ui/icons/HomeRoundedIcon.tsx'
import { DownloadRoundedIcon } from '@/shared/ui/icons/DownloadRoundedIcon.tsx'
import { CategoryRoundedIcon } from '@/shared/ui/icons/CategoryRoundedIcon.tsx'
import { Flag2RoundedIcon } from '@/shared/ui/icons/Flag2RoundedIcon.tsx'
import { DeliveryTruckSpeedOutlineRoundedIcon } from '@/shared/ui/icons/DeliveryTruckSpeedOutlineRoundedIcon.tsx'
import { NestClockFarsightAnalogOutlineRoundedIcon } from '@/shared/ui/icons/NestClockFarsightAnalogOutlineRoundedIcon.tsx'
import { SalesLevelOutlineRoundedIcon } from '@/shared/ui/icons/SalesLevelOutlineRoundedIcon.tsx'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { ESection } from '../types'
import { bottomNavigationList } from '@/widgets/general/NavbarContent/model/lib/bottomNavigationList.tsx'
import type { SidebarAccordionDef, SidebarLeaf } from '@/widgets/general/NavbarContent/model/types/sidebarNav.ts'

export const sidebarTopLeaves: SidebarLeaf[] = [
    { path: ELinks.DASHBOARD, title: 'Дэшборд', icon: <SpeedIcon /> },
    { path: ELinks.SALES_LIST, title: 'Магазин заказ', icon: <ListAltRoundedIcon /> },
    { path: ELinks.FINANCIAL_REPORT, title: 'Финансовый отчёт', icon: <FinancialReportIcon /> },
    { path: ELinks.MONEY_LIST, title: 'Мой бумажник', icon: <AccountBalanceWalletIcon /> },
    { path: ELinks.RECORD_FUND, title: 'Фонд записи', icon: <TextAdRoundedIcon /> },
]

const productManagementChildren: SidebarLeaf[] = [
    {
        path: ELinks.PRODUCT_HOLD,
        title: 'Хранение продуктов',
        icon: <ShoppingBagOutlineIcon />,
        section: ESection.Product,
    },
    {
        path: ELinks.CATEGORIES,
        title: 'Категории товаров',
        icon: <CategoryRoundedIcon />,
        section: ESection.Categories,
    },
    { path: ELinks.PRODUCT_RETURN_REQUEST, title: 'Запросы на возврат', icon: <ErrorCircleRoundedIcon /> },
    { path: ELinks.PRODUCT_OVERVIEW, title: 'Обзор продукта', icon: <AndroidMessagesOutlineIcon /> },
    { path: ELinks.PRODUCT_WAREHOUSE, title: 'Склад продуктов', icon: <HomeRoundedIcon /> },
    { path: ELinks.PRODUCT_IMPORT, title: 'Импорт товаров', icon: <DownloadRoundedIcon /> },
]

const otherChildren: SidebarLeaf[] = [
    { path: ELinks.SETTINGS, title: 'Настройки магазина', icon: <SettingsIcon /> },
    { path: ELinks.BUSINESS_LEAGUE, title: 'Бизнес-лига', icon: <Flag2RoundedIcon /> },
]

const marketingChildren: SidebarLeaf[] = [
    { path: ELinks.MARKETING_SHOP_EXPRESS, title: 'Магазин экспресс', icon: <DeliveryTruckSpeedOutlineRoundedIcon /> },
    { path: ELinks.MARKETING_PURCHASE_HISTORY, title: 'История покупок', icon: <NestClockFarsightAnalogOutlineRoundedIcon /> },
    { path: ELinks.MARKETING_SELLER_LEVEL, title: 'Уровень продавца', icon: <SalesLevelOutlineRoundedIcon /> },
]

export const sidebarAccordions: SidebarAccordionDef[] = [
    {
        id: 'product-management',
        title: 'Управление продуктом',
        icon: <ShoppingBagIcon />,
        children: productManagementChildren,
    },
    {
        id: 'other',
        title: 'Другие',
        icon: <BorderAllRoundedIcon />,
        children: otherChildren,
    },
    {
        id: 'marketing',
        title: 'Маркетинговые инструменты',
        icon: <BarChart4BarsRoundedIcon />,
        children: marketingChildren,
    },
    {
        id: 'administration',
        title: 'Администрирование',
        icon: <AppsIcon />,
        children: bottomNavigationList
            .filter((item) => item.path !== ELinks.DASHBOARD && item.path !== ELinks.CATEGORIES)
            .map((item) => ({
                path: item.path,
                title: item.title,
                icon: item.icon,
                section: item.section,
            })),
    },
]
