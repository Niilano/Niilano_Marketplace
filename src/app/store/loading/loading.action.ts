import { createAction } from "@ngrx/store";

export const startLoading = createAction('[Loading] Start')

export const endLoading = createAction('[Loading] ends')