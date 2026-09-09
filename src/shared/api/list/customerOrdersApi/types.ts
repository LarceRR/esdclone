export interface ICustomerOrderList {
    data: ICustomerOrder[]
}
export interface ICustomerOrder extends ICustomerOrderAction {
    id: number
    created_at: string
    update_at: string
}
export interface ICustomerOrderAction {
    name: string
    phone: string
    discount_card: string
    car_id: number
    description: string
    sum: number
    status: string
}
