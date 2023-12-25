import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { endLoading, startLoading } from "./loading.action";
import { loadingStateInterface } from "./loadingStateInterface";

const initialState:loadingStateInterface = AppInitialState.loading

export const loadingReducers = createReducer(initialState,
    on(startLoading,(state)=>({...state,isLoading:true})),
    on(endLoading,(state)=>({...state,isLoading:false}))
    )