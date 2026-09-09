import React from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import styles from './SkeletonTable.module.css'

export interface ColumnSkeletonDef {
    key: string
    width?: string | number
    variant?: 'text' | 'rectangular' | 'circular'
    skeletonWidth?: string | number
    skeletonHeight?: string | number
}

export interface TableSkeletonProps {
    columns: ColumnSkeletonDef[]
    rowCount?: number
}

export const SkeletonTable: React.FC<TableSkeletonProps> = ({ columns, rowCount = 3 }) => {
    const headerCells = columns
    const rows = Array.from({ length: rowCount })

    return (
        <div className={styles.tableContainer}>
            <Skeleton
                width={'100%'}
                height={'95px'}
            />
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        {headerCells.map(({ key, width, skeletonWidth = '60%', skeletonHeight = 20, variant = 'text' }) => (
                            <TableCell
                                key={key}
                                className={styles.skeletonCell}
                                style={{ width }}
                            >
                                <Skeleton
                                    variant={variant}
                                    width={skeletonWidth}
                                    height={skeletonHeight}
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {headerCells.map(({ key, width, skeletonWidth = '80%', skeletonHeight = 20, variant = 'text' }) => (
                                <TableCell
                                    key={key}
                                    className={styles.skeletonCell}
                                    style={{ width }}
                                >
                                    <Skeleton
                                        variant={variant}
                                        width={skeletonWidth}
                                        height={skeletonHeight}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
