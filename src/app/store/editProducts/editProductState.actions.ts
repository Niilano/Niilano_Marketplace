import { createAction, props } from "@ngrx/store";

export const editProduct = createAction("[Edit Product] edit",props<{formData:FormData}>())

export const editProductSuccess = createAction("[Edit Product] Success",props<{message:string}>())

export const editProductFailure = createAction("[Edit Product] Failed",props<{error:string}>())

export const resetEditProductStateValues = createAction("[Edit Product] reset")