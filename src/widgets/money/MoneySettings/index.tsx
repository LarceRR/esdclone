import { SettingsModal } from '@/shared/ui/SettingsModal'
import styles from './MoneySettings.module.css'
import { Button } from '@mui/material'
import { useState } from 'react'
import { CashboxesTable } from '@/entities/money/settings/CashboxesTable'
import AddCashbox from '@/features/money/settings/AddCashbox'
import { OnlineCashbox } from '@/features/money/settings/OnlineCashbox'
import { ArticleTable } from '@/entities/money/settings/ArticlesTable'
import AddCategory from '@/features/money/settings/articles/AddCategory'
import AddArticle from '@/features/money/settings/articles/AddArticle'

const tabSections: string[] = ['Кассы', 'Онлайн-касса', 'Статьи ДДС']

const Tabs = ({ enabledSection, setSection }: { enabledSection: string; setSection: (section: string) => void }) => {
    return (
        <div className={styles.tabs}>
            {tabSections.map((section) => (
                <Button
                    key={section}
                    size={'medium'}
                    variant={'outlined'}
                    disabled={enabledSection === section}
                    onClick={() => setSection(section)}
                >
                    {section}
                </Button>
            ))}
        </div>
    )
}

export const MoneySettings = () => {
    const [enabledSection, setEnabledSection] = useState<string>(tabSections[0])
    const onSelectSection = (section: string) => setEnabledSection(section)
    return (
        <SettingsModal>
            <Tabs
                setSection={onSelectSection}
                enabledSection={enabledSection}
            />
            {enabledSection === tabSections[0] && (
                <div className={styles.section}>
                    <AddCashbox />
                    <CashboxesTable />
                </div>
            )}
            {enabledSection === tabSections[1] && (
                <div className={styles.section}>
                    <OnlineCashbox />
                </div>
            )}
            {enabledSection === tabSections[2] && (
                <div className={styles.section}>
                    <div className={styles.actions}>
                        <AddCategory />
                        <AddArticle />
                    </div>
                    <ArticleTable />
                </div>
            )}
        </SettingsModal>
    )
}
