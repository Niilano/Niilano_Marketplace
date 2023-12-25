import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { clearFilter, filterProducts, filterProductsFailure, filterProductsSuccess, getProducts, getProductsFailure, getProductsSuccess } from "./products.action";
import { productsState } from "./productsState";

const initialState:productsState = AppInitialState.products

export const productsReducers = createReducer(initialState,
    on(getProducts,(state)=>({...state,process:true,success:false,failure:false,products:[],message:'',filter:false,productsAvailable:0})),
    on(getProductsSuccess,(state,action:any)=>{
        return {...state,process:false,success:true,failure:false,products:action.products,message:action.message,filter:false,productsAvailable:action.productsAvailable}
    }),
    on(getProductsFailure,(state,action)=>({...state,process:false,success:false,failure:true,products:[],message:action.error,filter:false,productsAvailable:0})),
    on(filterProducts,(state)=>({...state,process:true,success:false,failure:false,products:[],filter:true,productsAvailable:0})),
    on(filterProductsSuccess,(state,action)=>({...state,process:false,success:true,failure:false,products:action.products,message:action.message,filter:true,productsAvailable:action.productsAvailable})),
    on(filterProductsFailure,(state,action)=>({...state,process:false,success:false,failure:true,products:[],message:action.error,filter:false,productsAvailable:0})),
    on(clearFilter,(state)=>({...state,process:true,success:false,failure:false,products:[],filter:false,productsAvailable:0,message:''}))

    )