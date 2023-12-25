import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { getUserProducts, getUserProductsFailure, getUserProductsSuccess } from "./userproducts.actions";
import { userProductsStateInterface } from "./userProductsInterface";

const initialState:userProductsStateInterface = AppInitialState.userProducts

export const userProductsReducers = createReducer(initialState,
    on(getUserProducts,(state)=>({...state,process:true,success:false,failure:false,message:null,products : []})),
    on(getUserProductsSuccess,(state,actions)=>({...state,process:false,success:true,failure:false,message:actions.message,products : actions.products})),
    on(getUserProductsFailure,(state,actions)=>({...state,process:false,success:false,failure:true,message:actions.error,products : []}))
    )