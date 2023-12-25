import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { checkLogin, checkLoginError, checkLoginSuccess } from "./checklogin.actions";
import { checkLoginInterface } from "./checklogininterface";

const initialState:checkLoginInterface = AppInitialState.checkLogin

export const checkLoginReducers = createReducer(initialState,
    on(checkLogin,(state: any)=>({...state,process:true,loggedIn:false,profile:null})),
    on(checkLoginSuccess,(state: any,action)=>({...state,process:false,loggedIn:true,profile:action.profile})),
    on(checkLoginError,(state: any)=>({...state,process:false,loggedIn:false,profile:null}))
    )