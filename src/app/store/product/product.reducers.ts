import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { getProduct, getProductFailure, getProductSuccess } from "./product.actions";
import { productState } from "./productState";

const initialState:productState = AppInitialState.product

export const productReducers = createReducer(initialState,
    on(getProduct,(state)=>({...state,process:true,success:false,failure:false,message:null,product:[]})),
    on(getProductSuccess,(state,action)=>({...state,process:false,success:true,failure:false,message:action.message,product:action.product})),
    on(getProductFailure,(state,action)=>({...state,process:false,success:false,failure:true,message:action.error,product:[]}))
    )