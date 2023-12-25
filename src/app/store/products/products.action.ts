import { createAction, props } from "@ngrx/store";

export const getProducts = createAction("[Products] get Products", props<{ page: number }>())

export const getProductsSuccess = createAction("[Products] get Products success", props<{ message: string, products: [], productsAvailable: number }>())

export const getProductsFailure = createAction("[Products] get Products Failed", props<{ error: string }>())

export const filterProducts = createAction(
  "[Products] filter Products",
  props<{ filters: {} }>()
);

export const filterProductsSuccess = createAction(
  "[Products] filter Products success",
  props<{ message: string, products: [], productsAvailable: number }>()
);

export const filterProductsFailure = createAction(
  "[Products] filter Products failure",
  props<{ error: string }>()
);

export const clearFilter = createAction(
  "[Products] clear filter"
);