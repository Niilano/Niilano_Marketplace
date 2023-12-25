import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { register, registerFailure, registerSuccess, resetRegistrationStateValues } from "./register.action";
import { registerState } from "./registerState";

const initialState:registerState = AppInitialState.register

export const registerReducers = createReducer(initialState,
    on(register,(state)=>({...state,registering:true,registered:false,registrationFail:false,registrationSuccess:false,message:null})),
    on(registerSuccess,(state,action)=>({...state,registering:false,registered:true,registrationFail:false,registrationSuccess:false,message:action.message})),
    on(registerFailure,(state,action)=>({...state,registering:false,registered:false,registrationFail:true,registrationSuccess:false,message:action.message})),
    on(resetRegistrationStateValues,(state)=>({...state,registering:false,registered:false,registrationFail:false,registrationSuccess:false,message:null}))
)