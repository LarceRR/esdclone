import type { ICategory } from '@/shared/api/types'

/** Начальный набор для демо иерархии категорий. */
export const mockCategoriesSeed: ICategory[] = [
    { id: 1, title: 'Автозапчасти', parent_id: null, products_count: 0 },
    { id: 2, title: 'Двигатель и трансмиссия', parent_id: 1, products_count: 48 },
    { id: 3, title: 'Ходовая часть', parent_id: 1, products_count: 62 },
    { id: 4, title: 'Масляные фильтры', parent_id: 2, products_count: 19 },
    { id: 5, title: 'Масла и жидкости', parent_id: null, products_count: 0 },
    { id: 6, title: 'Моторные масла', parent_id: 5, products_count: 34 },
    { id: 7, title: 'Технические жидкости', parent_id: 5, products_count: 27 },
    { id: 8, title: 'Шины и диски', parent_id: null, products_count: 0 },
    { id: 9, title: 'Летние шины', parent_id: 8, products_count: 41 },
    { id: 10, title: 'Зимние шины', parent_id: 8, products_count: 38 },
    { id: 11, title: 'Автохимия и уход', parent_id: null, products_count: 0 },
    { id: 12, title: 'Уход за кузовом', parent_id: 11, products_count: 22 },
    { id: 13, title: 'Аксессуары для салона', parent_id: 11, products_count: 31 },
    { id: 14, title: 'Электроника', parent_id: null, products_count: 0 },
    { id: 15, title: 'Автозвук', parent_id: 14, products_count: 16 },
]
