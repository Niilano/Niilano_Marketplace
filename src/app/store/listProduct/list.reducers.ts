import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { listProduct, listProductComplete, listProductFailure, listProductSuccess } from "./list.actions";
import { listProductStateInterface } from "./list.state";

const initialState:listProductStateInterface = AppInitialState.addProduct

export const listProductReducers = createReducer(initialState,
    on(listProduct,(state)=>({...state,process:true,success:false,failure:false})),
    on(listProductSuccess,(state,action)=>({...state,process:false,success:true,failure:false,message:action.message,productID:action.productID})),
    on(listProductFailure,(state,action)=>({...state,process:false,success:false,failure:true,message:action.error})),
    on(listProductComplete,(state)=>({...state,process:false,success:false,failure:false}))
    )