/** Только при ширине окна меньше 768px: два блока по flex:1, без переноса, отступ между ними 14px */
export const tableToolbarSplitRowSx = {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'flexWrap': 'nowrap',
    'minWidth': 0,
    'width': '100%',
    'overflowX': 'auto',
    'gap': '12px',
    '& > .toolbarSearch': {
        flex: '1 1 0',
        minWidth: 0,
    },
    '& > .toolbarSlot': {
        flex: '0 0 auto',
    },
    '@media (max-width: 767px)': {
        'gap': '14px',
        'columnGap': '14px',
    },
}

/** Select категории: фикс. minWidth с 768px и выше; ниже 768 — ведёт себя как колонка в split-row */
export const tableToolbarCategorySelectSx = {
    'minWidth': 200,
    '@media (max-width: 767px)': {
        minWidth: 0,
        width: '100%',
        maxWidth: '100%',
    },
}

/**
 * Унифицированный toolbar таблиц: поиск растягивается на всю доступную ширину,
 * справа — слот для action-кнопок (Создать …). Одна строка на всех ширинах (как на десктопе).
 */
export const tableToolbarRowSx = {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '12px',
    'flexWrap': 'nowrap',
    'width': '100%',
    'minWidth': 0,
    'overflowX': 'auto',
    '& > .toolbarSearch': {
        flex: '1 1 240px',
        minWidth: 0,
    },
    '& > .toolbarSlot': {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
}

/** Поиск внутри унифицированного toolbar — занимает всё доступное место */
export const tableToolbarSearchSx = {
    'width': '100%',
    '& .MuiOutlinedInput-root': { width: '100%' },
}
