import { useState, MouseEvent } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { RemoveOrder } from '@/entities/sales/OrdersTable/RemoveOrder.tsx'

export const MoreActions = ({ id }: { id: number }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    console.log(id)

    return (
        <>
            <IconButton
                aria-label='more actions'
                aria-controls={open ? 'order-actions-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleOpen}
                size='medium'
            >
                <MoreVertIcon fontSize='small' />
            </IconButton>

            <Menu
                id='order-actions-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem>
                    <RemoveOrder
                        handleCloseList={handleClose}
                        id={id}
                    />
                </MenuItem>
            </Menu>
        </>
    )
}
