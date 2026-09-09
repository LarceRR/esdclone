import { createTheme } from '@mui/material'

export const theme = (isSmallScreen: boolean) => {
    const sizeTextField = isSmallScreen ? 'small' : 'medium'
    const sizeCheckbox = isSmallScreen ? 'small' : 'medium'
    const sizeButton = isSmallScreen ? 'medium' : 'large'
    return createTheme({
        palette: {
            primary: {
                main: '#f47139',
                light: '#fdc7b1',
                dark: '#db5f2a',
            },
            secondary: {
                main: '#D1E2F5',
            },
            error: {
                main: '#DB2828',
            },
            info: {
                main: '#0288D1',
            },
            success: {
                main: '#23da66',
            },
        },
        transitions: {
            duration: {
                short: 300,
            },
        },
        components: {
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                    size: sizeButton,
                },
                styleOverrides: {
                    root: {
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        textTransform: 'none',
                    },
                    contained: {
                        color: '#fff',
                    },
                    sizeLarge: {
                        padding: '0.75rem 2rem',
                    },
                },
            },
            MuiTextField: {
                defaultProps: {
                    size: sizeTextField,
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: '0.5rem',
                    },
                },
                // defaultProps: {
                //     size: sizeTextField
                // }
            },
            MuiCheckbox: {
                defaultProps: {
                    size: sizeCheckbox,
                },
            },
            MuiTable: {
                defaultProps: {
                    size: 'small',
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        fontSize: '0.8125rem',
                        lineHeight: 1.35,
                        padding: theme.spacing(0.625, 1),
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.75rem',
                            padding: theme.spacing(0.5, 0.75),
                        },
                    }),
                    head: ({ theme }) => ({
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.75rem',
                        },
                    }),
                },
            },
            MuiTablePagination: {
                styleOverrides: {
                    root: {
                        fontSize: '0.8125rem',
                    },
                    toolbar: {
                        minHeight: 44,
                        paddingLeft: 8,
                        paddingRight: 8,
                    },
                    selectLabel: {
                        fontSize: '0.8125rem',
                    },
                    displayedRows: {
                        fontSize: '0.8125rem',
                    },
                },
            },
            MuiTableSortLabel: {
                styleOverrides: {
                    icon: {
                        fontSize: '1rem',
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        borderRadius: theme.spacing(1.5),
                        margin: theme.spacing(2),
                        maxHeight: `calc(100% - ${theme.spacing(4)})`,
                        [theme.breakpoints.down('md')]: {
                            margin: theme.spacing(1.25),
                            maxWidth: `calc(100% - ${theme.spacing(2.5)})`,
                            width: '100%',
                            maxHeight: `calc(100% - ${theme.spacing(2.5)})`,
                        },
                    }),
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        fontSize: '1.125rem',
                        padding: theme.spacing(2, 2, 1),
                        [theme.breakpoints.down('md')]: {
                            fontSize: '1rem',
                            padding: theme.spacing(1.5, 1.5, 0.5),
                        },
                    }),
                },
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        padding: theme.spacing(1, 2, 2),
                        [theme.breakpoints.down('md')]: {
                            padding: theme.spacing(1, 1.5, 1.5),
                        },
                    }),
                },
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        flexWrap: 'wrap',
                        gap: theme.spacing(0.75),
                        padding: theme.spacing(2),
                        [theme.breakpoints.down('md')]: {
                            padding: theme.spacing(1.25, 1.5, 1.5),
                        },
                    }),
                },
            },
        },
        typography: {
            fontFamily: 'Nunito Sans',
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 420,
                md: 768,
                lg: 1280,
                xl: 1920,
            },
        },
    })
}
