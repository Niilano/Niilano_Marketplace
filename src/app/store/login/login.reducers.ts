import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { login, loginFailure, loginSuccess, logout } from "./login.action";
import { LoginStateInterface } from "./LoginState";

const initialState:LoginStateInterface = AppInitialState.login

export const loginReducers = createReducer(initialState,
    on(login,(state)=>({...state,isLogedIn:false,isLogingIn:true,isLogingInFailure:false,message:null})),
    on(loginSuccess,(state,action)=>({...state,isLogedIn:true,isLogingIn:false,isLogingInFailure:false,message:action.message})),
    on(loginFailure,(state,action)=>({...state,isLogedIn:false,isLogingIn:false,isLogingInFailure:true,message:action.message})),
    on(logout,(state)=>({...state,isLogedIn:false,isLogingIn:false,isLogingInFailure:false,message:null}))
)