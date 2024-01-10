import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
import * as productActions from './products.action';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';

@Injectable()
export class ProductsEffect {
    constructor(
        private actions$: Actions,
        private productService: ProductsserviceService
    ) { }

    getProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(productActions.getProducts),
            switchMap((payload: { page: number }) => {
                return this.productService.getProducts(payload.page)
                    .pipe(
                        map((products) => productActions.getProductsSuccess({ message: products.message, products: products.products, productsAvailable: products.productsAvailable })),
                        catchError((error) => of(productActions.getProductsFailure({ error: error.message })))
                    );
            })
        ), { dispatch: true }
    )

    filterProducts$ = createEffect(() => (
        this.actions$.pipe(
            ofType(productActions.filterProducts),
            switchMap((filters) => this.productService.filterProducts(filters.filters).pipe(take(1))
                .pipe(
                    map((products) => productActions.filterProductsSuccess({ message: products.message, products: products.products, productsAvailable: products.productsAvailable })),
                    catchError((error) => of(productActions.filterProductsFailure({ error: error.message })))
                )
            )
        )
    )
    )

    resetProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(productActions.clearFilter),
            switchMap(() => {
                return this.productService.getProducts(1)
                    .pipe(
                        map((products) => productActions.getProductsSuccess({ message: products.message, products: products.products, productsAvailable: products.productsAvailable })),
                        catchError((error) => of(productActions.getProductsFailure({ error: error.message })))
                    );
            })
        ), { dispatch: true }
    )

}
