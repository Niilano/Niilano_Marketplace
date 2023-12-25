import { createAction, props } from "@ngrx/store";

export const login = createAction("[login]",props<{email:string,password:string}>())

export const loginSuccess = createAction("[login success]", props<{message:string}>())

export const loginFailure = createAction("[login failure]", props<{message:string}>())

export const logout = createAction("[logout]")