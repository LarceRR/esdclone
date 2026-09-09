import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { SMS_LIST_API, SMS_UPDATE_API } from '@/shared/constants/apiLinks.ts'
import { ISMS, ISMSList } from '@/shared/api/list/smsApi/types.ts'

export const smsApi = createApi({
    reducerPath: 'smsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getSMSList: build.query<ISMS[], void>({
            query: () => ({
                url: SMS_LIST_API,
                method: 'GET',
            }),
        }),
        updateSMS: build.mutation<ISMSList, ISMS>({
            query: (data) => ({
                url: SMS_UPDATE_API,
                method: 'POST',
                body: data,
            }),
        }),
    }),
})
