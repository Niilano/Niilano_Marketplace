import { createAction, props } from "@ngrx/store";

export const getProduct = createAction("[Product] get single product", props<{ productID: Number ,details:string}>())

export const getProductSuccess = createAction("[Product] get single product successful", props<{ message: string, product: [] }>())

export const getProductFailure = createAction("[Product] get single product failed", props<{ error: string }>())