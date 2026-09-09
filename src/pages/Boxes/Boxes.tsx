import React, { memo } from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import BoxesListModule from '@/widgets/BoxesListModule'

const Boxes: React.FC = memo(() => {
    return (
        <LayoutContent>
            <BoxesListModule />
        </LayoutContent>
    )
})
export default Boxes
