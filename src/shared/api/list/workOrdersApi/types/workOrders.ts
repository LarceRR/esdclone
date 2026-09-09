export interface IDataWorkOrderApi {
    box_id: any
    id: number
    date_start_work: string | Date
    date_end_work: string | Date
    counterparty: string
    cars: string
    sum: number
    payed: number
    status: string
    comments: string
    box: number | string | null
}
export interface IWorkOrdersRequest {
    data: IDataWorkOrderApi[]
}

export interface IDataUpdateWorkOrderApi {
    id: number
    date_start_work: string | Date | null
    date_end_work: string | Date | null
    counterparty?: string
    cars?: string
    sum?: number
    payed?: number
    status?: string
    comments?: string
    box?: number | string | null
}
