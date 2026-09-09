import { IGroupUpdate } from '@/shared/api/types'

export const initialData: IGroupUpdate = {
    id: 0,
    name: '',
    rules: {
        Product: {
            DeleteController: false,
            ListController: false,
            ShowController: false,
            StoreController: false,
            UpdateController: false,
        },
        Group: {
            DeleteController: false,
            ListController: false,
            ShowController: false,
            StoreController: false,
            UpdateController: false,
        },
        Category: {
            DeleteController: false,
            ListController: false,
            ShowController: false,
            StoreController: false,
            UpdateController: false,
        },
        User: {
            DeleteController: false,
            ListController: false,
            ShowController: false,
            StoreController: false,
            UpdateController: false,
        },
    },
}
