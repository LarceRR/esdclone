export interface ICarListResponse {
    message?: string
    data: ICar[]
}
export interface ICar extends ICarAction {
    id: number
}
export interface ICarAction {
    brand: string
    model: string
}
