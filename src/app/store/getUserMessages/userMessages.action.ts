import { createAction, props } from "@ngrx/store";

export const getUserMessages = createAction("[get user messages]")

export const getUserMessagesSuccess = createAction("[get user messages] succcess",props<{message:string,usersMessages:[],totalUnreadMessages:number}>())

export const getUserMessagesFail = createAction("[get user messages] fail",props<{error:string}>())