import { createAction, props } from "@ngrx/store";

export const getUserProducts = createAction("[Get User Products]")

export const getUserProductsSuccess = createAction("[Get User Products] success",props<{message:string,products:[]}>())

export const getUserProductsFailure = createAction("[Get User Products] failure",props<{error:string}>())