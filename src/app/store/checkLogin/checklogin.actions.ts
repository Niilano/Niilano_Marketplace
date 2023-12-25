import { createAction, props } from "@ngrx/store";

export const checkLogin = createAction("[check user logged in]")

export const checkLoginSuccess = createAction("[check user logged in] success",props<{profile:any}>())

export const checkLoginError = createAction("[check user logged in] Error",props<{error:string}>())