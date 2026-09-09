import { createApi } from '@reduxjs/toolkit/query/react'
import { BUSINESS_LEAGUE_FRIENDS_API, BUSINESS_LEAGUE_SUMMARY_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    BusinessLeagueFriendLevel,
    IApiResponse,
    IBusinessLeagueFriend,
    IBusinessLeagueSummary,
} from './types.ts'

export const businessLeagueApi = createApi({
    reducerPath: 'businessLeagueApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['BusinessLeague'],
    endpoints: (build) => ({
        getBusinessLeagueSummary: build.query<IApiResponse<IBusinessLeagueSummary>, void>({
            query: () => ({
                url: BUSINESS_LEAGUE_SUMMARY_API,
                method: 'GET',
            }),
            providesTags: ['BusinessLeague'],
        }),
        getBusinessLeagueFriends: build.query<IApiResponse<IBusinessLeagueFriend[]>, BusinessLeagueFriendLevel>({
            query: (level) => ({
                url: BUSINESS_LEAGUE_FRIENDS_API,
                method: 'GET',
                params: { level },
            }),
            providesTags: ['BusinessLeague'],
        }),
    }),
})

export const { useGetBusinessLeagueSummaryQuery, useGetBusinessLeagueFriendsQuery } = businessLeagueApi
