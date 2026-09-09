import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, ListItemButton, Tooltip } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { NavLink, useLocation } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { isSidebarNavLinkActive } from '@/shared/lib/nav/navLinkActive.ts'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import type { IUserData } from '@/shared/types/auth'
import { canAccessNavSection } from '@/widgets/general/NavbarContent/model/lib/filterVisibleBottomNavItems.ts'
import { sidebarAccordions, sidebarTopLeaves } from '@/widgets/general/NavbarContent/model/lib/sidebarMenuConfig.tsx'
import type { SidebarAccordionDef, SidebarLeaf } from '@/widgets/general/NavbarContent/model/types/sidebarNav.ts'
import styles from './SidebarNav.module.css'

function pathMatches(pathname: string, linkPath: string): boolean {
    return isSidebarNavLinkActive(pathname, linkPath as ELinks)
}

function filterLeaves(user: IUserData, leaves: SidebarLeaf[]): SidebarLeaf[] {
    return leaves.filter((leaf) => canAccessNavSection(user, leaf.section))
}

function filterAccordions(user: IUserData, defs: SidebarAccordionDef[]): SidebarAccordionDef[] {
    return defs
        .map((acc) => ({ ...acc, children: filterLeaves(user, acc.children) }))
        .filter((acc) => acc.children.length > 0)
}

const ROW_RADIUS = '8px'
const HOVER_BG = '#f471391a'
const ACTIVE_BG = '#f4713940'

interface SidebarNavProps {
    toggled: boolean
    onLeafNavigate?: () => void
}

interface LeafRowProps {
    leaf: SidebarLeaf
    active: boolean
    toggled: boolean
    onClick?: () => void
}

const FlatLeafRow: React.FC<LeafRowProps> = ({ leaf, active, toggled, onClick }) => {
    const inner = (
        <NavLink
            to={leaf.path}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={[
                styles.flatLink,
                active && styles.flatLinkActive,
                !toggled && styles.flatLinkIconOnly,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <span
                className={styles.iconBox}
                aria-hidden='true'
            >
                {leaf.icon}
            </span>
            {toggled && <span className={styles.label}>{leaf.title}</span>}
        </NavLink>
    )
    if (toggled) return inner
    return (
        <Tooltip
            title={leaf.title}
            placement='right'
            arrow
        >
            {inner}
        </Tooltip>
    )
}

export const SidebarNav: React.FC<SidebarNavProps> = memo(({ toggled, onLeafNavigate }) => {
    const { pathname } = useLocation()
    const { userData, removeUser } = useAuth()

    const [expandedId, setExpandedId] = useState<string | false>(false)

    const onAccordionChange = useCallback(
        (id: string) => (_: React.SyntheticEvent, expanded: boolean) => {
            setExpandedId(expanded ? id : false)
        },
        [],
    )

    if (!userData) {
        removeUser()
        return null
    }

    const top = useMemo(() => filterLeaves(userData, sidebarTopLeaves), [userData])
    const accordions = useMemo(() => filterAccordions(userData, sidebarAccordions), [userData])

    useEffect(() => {
        const hit = accordions.find((a) => a.children.some((c) => pathMatches(pathname, c.path)))
        if (hit) setExpandedId(hit.id)
    }, [pathname, accordions])

    const onLinkClick = useCallback(() => {
        onLeafNavigate?.()
    }, [onLeafNavigate])

    return (
        <nav
            className={styles.root}
            aria-label='Основное меню'
        >
            {top.map((leaf) => (
                <FlatLeafRow
                    key={leaf.path}
                    leaf={leaf}
                    active={pathMatches(pathname, leaf.path)}
                    toggled={toggled}
                    onClick={onLinkClick}
                />
            ))}

            {accordions.map((acc) => (
                <Accordion
                    key={acc.id}
                    disableGutters
                    elevation={0}
                    square
                    expanded={expandedId === acc.id}
                    onChange={onAccordionChange(acc.id)}
                    sx={{
                        'background': 'transparent',
                        'border': 'none',
                        'borderRadius': ROW_RADIUS,
                        '&::before': { display: 'none' },
                        '&.Mui-expanded': { margin: 0 },
                    }}
                >
                    <Tooltip
                        title={!toggled ? acc.title : ''}
                        placement='right'
                        disableHoverListener={toggled}
                        arrow
                    >
                        <AccordionSummary
                            expandIcon={toggled ? <ExpandMoreIcon sx={{ color: 'var(--primary-color)' }} /> : null}
                            aria-controls={`${acc.id}-panel`}
                            id={`${acc.id}-header`}
                            sx={{
                                'minHeight': 44,
                                'padding': toggled ? '0 0.5rem' : '0',
                                'borderRadius': ROW_RADIUS,
                                'color': 'var(--text-color)',
                                'transition': 'background-color 0.15s ease, color 0.15s ease',
                                '&:hover': { backgroundColor: HOVER_BG },
                                '&.Mui-expanded': { minHeight: 44 },
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    flexShrink: 0,
                                    color: 'var(--primary-color)',
                                },
                                '& .MuiAccordionSummary-content': {
                                    margin: '0.35rem 2px',
                                    minWidth: 0,
                                    alignItems: 'center',
                                    gap: '0.65rem',
                                    justifyContent: toggled ? 'flex-start' : 'center',
                                },
                                '&.Mui-expanded .MuiAccordionSummary-content': { margin: '0.35rem 2px' },
                            }}
                        >
                            <span
                                className={styles.iconBox}
                                aria-hidden='true'
                            >
                                {acc.icon}
                            </span>
                            {toggled && <span className={styles.label}>{acc.title}</span>}
                        </AccordionSummary>
                    </Tooltip>
                    <AccordionDetails sx={{ padding: '0 0 0.35rem 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {acc.children.map((leaf) => {
                            const active = pathMatches(pathname, leaf.path)
                            return (
                                <Tooltip
                                    key={leaf.path}
                                    title={!toggled ? leaf.title : ''}
                                    placement='right'
                                    disableHoverListener={toggled}
                                    arrow
                                >
                                    <ListItemButton
                                        component={NavLink}
                                        to={leaf.path}
                                        selected={active}
                                        onClick={onLinkClick}
                                        dense
                                        sx={{
                                            'minHeight': 40,
                                            'paddingLeft': toggled ? '1.5rem' : '0.5rem',
                                            'paddingRight': '0.5rem',
                                            'borderRadius': ROW_RADIUS,
                                            'color': 'var(--text-color)',
                                            'gap': '0.65rem',
                                            'justifyContent': toggled ? 'flex-start' : 'center',
                                            'transition': 'background-color 0.15s ease, color 0.15s ease',
                                            '&:hover': { backgroundColor: HOVER_BG },
                                            '&.Mui-selected': {
                                                backgroundColor: ACTIVE_BG,
                                                color: 'var(--primary-color)',
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: ACTIVE_BG,
                                            },
                                        }}
                                    >
                                        <span
                                            className={styles.iconBox}
                                            aria-hidden='true'
                                        >
                                            {leaf.icon}
                                        </span>
                                        {toggled && <span className={styles.label}>{leaf.title}</span>}
                                    </ListItemButton>
                                </Tooltip>
                            )
                        })}
                    </AccordionDetails>
                </Accordion>
            ))}
        </nav>
    )
})
