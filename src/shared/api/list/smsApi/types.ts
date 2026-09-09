export interface ISMSList {
    data: ISMS[]
}
export interface ISMS {
    'id': number
    'title': string
    'message': string
    '1h': boolean
    '2h': boolean
    '1d': boolean
    '2d': boolean
    '1w': boolean
    '2w': boolean
    '1m': boolean
    '2m': boolean
    'on': boolean
    'off': boolean
    'in_order': boolean
    'project_id': number
}
