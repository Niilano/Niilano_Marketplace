import { createAction, props } from '@ngrx/store';

// Action to initiate the products summary request
export const getProductsSummary = createAction('[Products Summary] Get Products Summary');

// Action dispatched when the products summary request is successful
export const getProductsSummarySuccess = createAction(
  '[Products Summary] Get Products Summary Success',
  props<{ productsSummary: any }>()
);

// Action dispatched when the products summary request fails
export const getProductsSummaryFailure = createAction(
  '[Products Summary] Get Products Summary Failure',
  props<{ error: any }>()
);
