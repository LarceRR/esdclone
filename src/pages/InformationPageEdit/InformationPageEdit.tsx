import React, { memo } from 'react'
import { useParams } from 'react-router-dom'
import LayoutContent from '@/widgets/general/LayoutContent'
import { InformationPageEditorModule } from '@/widgets/InformationPageEditorModule'

const InformationPageEdit: React.FC = memo(() => {
    const { id } = useParams()
    const pageId = Number(id)

    return (
        <LayoutContent>
            <InformationPageEditorModule pageId={Number.isFinite(pageId) ? pageId : 0} />
        </LayoutContent>
    )
})

export default InformationPageEdit
