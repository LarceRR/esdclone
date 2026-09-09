import styles from './TableSample.module.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { memo } from 'react'
import React from 'react'

interface IColumn {
    id: string
    label: string
    minWidth?: number
    align?: string
    format?: (value: number) => string
}

interface ITable {
    children: React.ReactNode
    columnsTable: IColumn[]
    stylesTableContainer?: React.CSSProperties
}

export const TableSample = memo(({ children, columnsTable, stylesTableContainer }: ITable) => {
    return (
        <TableContainer sx={{ width: '100%', maxHeight: '90vh', ...stylesTableContainer }}>
            <Table
                stickyHeader
                size='small'
                aria-label='sticky table'
            >
                <TableHead>
                    <TableRow>
                        {columnsTable.map((column, index) => (
                            <TableCell
                                sx={{
                                    background: 'var(--primary-color)',
                                    py: 0.75,
                                    px: 1,
                                    ...(column.minWidth != null ? { maxWidth: column.minWidth } : {}),
                                }}
                                key={index}
                            >
                                <span className={styles.label}>{column.label}</span>
                            </TableCell>
                        ))}
                        <TableCell
                            align={'right'}
                            sx={{
                                background: 'var(--primary-color)',
                                py: 0.75,
                                px: 1,
                                minWidth: 64,
                                color: 'var(--text-color-light)',
                            }}
                        >
                            Управление
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    )
})
