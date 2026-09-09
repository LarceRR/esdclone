import React, { memo } from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import { InformationPageEditorModule } from '@/widgets/InformationPageEditorModule'

const InformationPageCreate: React.FC = memo(() => {
    return (
        <LayoutContent>
            <InformationPageEditorModule />
        </LayoutContent>
    )
})

export default InformationPageCreate
