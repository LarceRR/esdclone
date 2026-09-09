import type { ICategory } from '@/shared/api/types'

export type CategoryTreeNode = ICategory & {
    children: CategoryTreeNode[]
}

export type FlatCategoryRow = ICategory & {
    depth: number
    parentTitle: string | null
}

export const normalizeCategory = (raw: Record<string, unknown>): ICategory => {
    const parentRaw = raw.parent_id ?? raw.parentId ?? raw.category_parent_id
    let parent_id: number | null = null
    if (parentRaw !== undefined && parentRaw !== null && parentRaw !== '' && Number(parentRaw) !== 0) {
        parent_id = Number(parentRaw)
    }

    const productsRaw = raw.products_count ?? raw.productsCount ?? raw.goods_count
    const products_count =
        productsRaw !== undefined && productsRaw !== null && productsRaw !== ''
            ? Number(productsRaw)
            : 0

    return {
        id: Number(raw.id),
        title: String(raw.title ?? raw.name ?? ''),
        parent_id,
        products_count: Number.isFinite(products_count) ? products_count : 0,
    }
}

/** Сумма товаров в категории и во всех её подкатегориях. */
export const getCategoryProductsCountTotal = (categoryId: number, items: ICategory[]): number => {
    const own = items.find((item) => item.id === categoryId)?.products_count ?? 0
    return items
        .filter((item) => item.parent_id === categoryId)
        .reduce((sum, child) => sum + getCategoryProductsCountTotal(child.id, items), own)
}

export const buildCategoryTree = (items: ICategory[]): CategoryTreeNode[] => {
    const byId = new Map<number, CategoryTreeNode>()
    const roots: CategoryTreeNode[] = []

    items.forEach((item) => {
        byId.set(item.id, { ...item, children: [] })
    })

    byId.forEach((node) => {
        if (node.parent_id != null && byId.has(node.parent_id)) {
            byId.get(node.parent_id)!.children.push(node)
        } else {
            roots.push(node)
        }
    })

    const sortNodes = (nodes: CategoryTreeNode[]) => {
        nodes.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
        nodes.forEach((child) => sortNodes(child.children))
    }
    sortNodes(roots)

    return roots
}

export const flattenCategoryTree = (
    nodes: CategoryTreeNode[],
    parentTitle: string | null = null,
    depth = 0,
): FlatCategoryRow[] =>
    nodes.flatMap((node) => {
        const { children, ...category } = node
        return [
            { ...category, depth, parentTitle },
            ...flattenCategoryTree(children, node.title, depth + 1),
        ]
    })

export const getDescendantIds = (items: ICategory[], rootId: number): Set<number> => {
    const ids = new Set<number>()
    const collect = (parentId: number) => {
        items.forEach((item) => {
            if (item.parent_id === parentId) {
                ids.add(item.id)
                collect(item.id)
            }
        })
    }
    collect(rootId)
    return ids
}

export const getParentSelectOptions = (
    items: ICategory[],
    excludeId?: number,
): { id: number | null; label: string; depth: number }[] => {
    const excluded = new Set<number>()
    if (excludeId != null) {
        excluded.add(excludeId)
        getDescendantIds(items, excludeId).forEach((id) => excluded.add(id))
    }

    const tree = buildCategoryTree(items.filter((item) => !excluded.has(item.id)))

    const flatten = (nodes: CategoryTreeNode[], depth: number): { id: number | null; label: string; depth: number }[] =>
        nodes.flatMap((node) => [
            { id: node.id, label: node.title, depth },
            ...flatten(node.children, depth + 1),
        ])

    return [{ id: null, label: 'Корневая категория', depth: 0 }, ...flatten(tree, 0)]
}

export const findCategoryTitle = (items: ICategory[], id: number | null | undefined): string | null => {
    if (id == null) return null
    return items.find((item) => item.id === id)?.title ?? null
}

/** Опции для выбора категории товара (с отступом для подкатегорий). */
export const getCategorySelectOptions = (items: ICategory[]) =>
    flattenCategoryTree(buildCategoryTree(items)).map((row) => ({
        id: row.id,
        label: row.title,
        depth: row.depth,
    }))
