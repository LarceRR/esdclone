export interface ISalesResponseList {
    message: string
    code: number
    data: ISale[]
}
export interface IOfferResponseList {
    message: string
    code: number
    data: IOffer[]
}
export interface ISale extends IOfferAction {
    id: number
    created_at: string
}

export interface IOffer extends IOfferAction {
    id: number
    created_at: string
}

// export interface ISaleCreateRequest {
//     name: string
//     OEM: string
//     store: string
//     quantity: number
//     price: number
//     sum: number
//     counterparty: string
//     description: string
//     number: number
// }
export interface IOfferAction {
    name_1: string
    surname_1: string
    avatar_1: File

    name_2: string
    surname_2: string
    avatar_2: File
    captain_1: number
    captain_2: number

    team_name: string
    region: string
    email: string
    phone: string

    ship_model: string
    engine_type: string
    camera: string
    net: string
}
