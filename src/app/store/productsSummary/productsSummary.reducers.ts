import { createReducer, on } from '@ngrx/store';
import * as ProductsSummaryActions from './productsSummary.action';
import { AppInitialState } from '../AppInitialState';
import { getProductsSummaryInterface } from './productsSummaryInterface';

export const initialState: getProductsSummaryInterface = AppInitialState.getProductsSummary

export const productsSummaryReducer = createReducer(
  initialState,

  // Action to initiate the products summary request
  on(ProductsSummaryActions.getProductsSummary, (state) => ({
    ...state,
    loading: true,
    success: false,
    failed: false
  })),

  // Action dispatched when the products summary request is successful
  on(ProductsSummaryActions.getProductsSummarySuccess, (state, { productsSummary }) => ({
    ...state,
    data: productsSummary,
    loading: false,
    success : true,
    failed: false
  })),

  // Action dispatched when the products summary request fails
  on(ProductsSummaryActions.getProductsSummaryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    message : error,
    failed : true
  }))
);
