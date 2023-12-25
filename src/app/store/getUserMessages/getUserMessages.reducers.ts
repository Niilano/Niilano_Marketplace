import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { getUserMessagesInterface } from "./getUserMessages.interface";
import { getUserMessages, getUserMessagesFail, getUserMessagesSuccess } from "./userMessages.action";

const initialState: getUserMessagesInterface = AppInitialState.getUserMessages

export const getuserMessagesReducers = createReducer(initialState,
    on(getUserMessages, (state) => ({ ...state, process: true, success: false, fail: false, message: null, userMessages: [],totalUnreadMesages:0 })),
    on(getUserMessagesSuccess, (state, action) => ({ ...state, process: false, success: true, fail: false, message: action.message, userMessages: action.usersMessages,totalUnreadMesages:action.totalUnreadMessages })),
    on(getUserMessagesFail, (state, action) => ({ ...state, process: false, success: false, fail: true, message: action.error, userMessages: [] }))
)