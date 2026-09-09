import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type PageTitleContextValue = {
    title: string | null
    titleNode: ReactNode | null
    setTitle: (t: string | null) => void
    setTitleNode: (n: ReactNode | null) => void
}

const PageTitleContext = createContext<PageTitleContextValue | null>(null)

export function PageTitleProvider({ children }: { children: ReactNode }) {
    const [title, setTitleState] = useState<string | null>(null)
    const [titleNode, setTitleNodeState] = useState<ReactNode | null>(null)

    const setTitle = (t: string | null) => {
        setTitleState(t)
        setTitleNodeState(null)
    }

    const setTitleNode = (n: ReactNode | null) => {
        setTitleNodeState(n)
        setTitleState(null)
    }

    const value = useMemo(() => ({ title, titleNode, setTitle, setTitleNode }), [title, titleNode])

    return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>
}

function usePageTitleContext(): PageTitleContextValue {
    const v = useContext(PageTitleContext)
    if (!v) {
        throw new Error('PageTitle: провайдер не найден (оберните контент в PageTitleProvider)')
    }
    return v
}

export { usePageTitleContext }

/** Текущий заголовок для слота в лейауте. */
export function usePageTitleDisplay(): string | null {
    return usePageTitleContext().title
}

/**
 * Задаёт заголовок страницы между юзер-баром и контентом.
 * При размонтировании сбрасывает заголовок.
 */
export function useSetPageTitle(title: string | null | undefined) {
    const { setTitle } = usePageTitleContext()
    useEffect(() => {
        if (title == null || title === '') {
            setTitle(null)
        } else {
            setTitle(title)
        }
        return () => {
            setTitle(null)
        }
    }, [title, setTitle])
}

/**
 * Задаёт кастомный заголовок (например, с интерактивным элементом внутри).
 * При размонтировании сбрасывает заголовок.
 */
export function useSetPageTitleNode(node: ReactNode | null | undefined) {
    const { setTitleNode } = usePageTitleContext()
    useEffect(() => {
        if (node == null) {
            setTitleNode(null)
        } else {
            setTitleNode(node)
        }
        return () => {
            setTitleNode(null)
        }
    }, [node, setTitleNode])
}
