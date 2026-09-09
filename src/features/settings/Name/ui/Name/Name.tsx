import React, { memo } from 'react'
import { SettingField } from '@/shared/ui/SettingField'

export const Name: React.FC = memo(() => {
    const initialValue = 123

    const onChange = (value: string | number) => console.log(value)

    return (
        <SettingField
            label={'Имя'}
            initialValue={initialValue}
            onChangeField={onChange}
            textFieldType={'number'}
            isLoading={false}
        />
    )
})
