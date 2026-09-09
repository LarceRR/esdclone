import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useGetPublicContentPageQuery } from '@/shared/api'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import styles from './ContentPagePublicModule.module.css'

function getErrorCode(error: unknown): number | null {
    if (!error || typeof error !== 'object') return null

    if ('data' in error) {
        const data = (error as { data?: { code?: number } }).data
        if (typeof data?.code === 'number') return data.code
    }

    if ('status' in error && typeof (error as { status?: number }).status === 'number') {
        return (error as { status: number }).status
    }

    return null
}

export const ContentPagePublicModule = () => {
    const { shopSlug = '', slug = '' } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { data, isLoading, isError, error } = useGetPublicContentPageQuery(
        { shopSlug, slug },
        { skip: !shopSlug || !slug },
    )

    const page = data?.data

    useEffect(() => {
        if (!page) return

        const metaTitle = page.seo.metaTitle || page.title
        document.title = metaTitle

        const description = page.seo.metaDescription
        if (description) {
            let meta = document.querySelector('meta[name="description"]')
            if (!meta) {
                meta = document.createElement('meta')
                meta.setAttribute('name', 'description')
                document.head.appendChild(meta)
            }
            meta.setAttribute('content', description)
        }

        if (page.seo.noIndex) {
            let robots = document.querySelector('meta[name="robots"]')
            if (!robots) {
                robots = document.createElement('meta')
                robots.setAttribute('name', 'robots')
                document.head.appendChild(robots)
            }
            robots.setAttribute('content', 'noindex, nofollow')
        }
    }, [page])

    useEffect(() => {
        if (!isError) return

        const code = getErrorCode(error)
        if (code === 401) {
            navigate(`${ELinks.SIGN_IN}?returnUrl=${encodeURIComponent(location.pathname)}`)
        }
    }, [error, isError, location.pathname, navigate])

    if (isLoading) {
        return (
            <Box className={styles.state}>
                <LoaderTable />
            </Box>
        )
    }

    if (isError || !page) {
        return (
            <Box className={styles.state}>
                <Typography variant='h6'>Страница не найдена или недоступна</Typography>
            </Box>
        )
    }

    return (
        <div className={styles.contentPage}>
            <article className={styles.container}>
                <Typography
                    component='h1'
                    variant='h4'
                    className={styles.title}
                >
                    {page.title}
                </Typography>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: page.contentHtml }}
                />
            </article>
        </div>
    )
}
