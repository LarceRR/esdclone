import React, { memo } from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import { InformationPagesModule } from '@/widgets/InformationPagesModule'

const InformationPages: React.FC = memo(() => {
    return (
        <LayoutContent>
            <InformationPagesModule />
        </LayoutContent>
    )
})

export default InformationPages
