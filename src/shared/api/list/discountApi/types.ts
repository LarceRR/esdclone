export interface IDiscountList {
    data: IDiscount[]
}
export interface IDiscount extends IDiscountAction {
    id: number
    created_at: string
    update_at: string
}
export interface IDiscountAction {
    title: string
    type: string
    discount_work: string
    discount_product: string
}
