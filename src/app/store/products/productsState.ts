export interface productsState{
    process : Boolean,
    success : Boolean,
    failure : Boolean,
    products : any[],
    message : any,
    filter:Boolean,
    productsAvailable : number
}