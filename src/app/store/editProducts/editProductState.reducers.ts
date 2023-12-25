import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitialState";
import { editProduct, editProductFailure, editProductSuccess, resetEditProductStateValues } from "./editProductState.actions";
import { editProductStateInterface } from "./editProductStateInterface";

const initialState: editProductStateInterface = AppInitialState.editProduct

export const editProductReducers = createReducer(initialState,
    on(editProduct, (state) => ({ ...state, process: true, success: false, failure: false })),
    on(editProductSuccess, (state, action) => ({ ...state, process: false, success: true, failure: false, message: action.message })),
    on(editProductFailure, (state, action) => ({ ...state, process: false, success: false, failure: true, message: action.error }))
    ,
    on(resetEditProductStateValues, (state, action) => ({ ...state, process: false, success: false, failure: false }))
)