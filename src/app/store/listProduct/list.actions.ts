import { createAction, props } from "@ngrx/store";

export const listProduct = createAction("[List Product] list",props<{formData:FormData}>())

export const listProductSuccess = createAction("[List Product] Success",props<{message:string,productID:number}>())

export const listProductFailure = createAction("[List Product] Failed",props<{error:string}>())

export const listProductComplete = createAction("[List Product] Complete") 