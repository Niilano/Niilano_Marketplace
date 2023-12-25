import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
import * as productActions from './product.actions';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';

@Injectable()
export class ProductEffect {
    constructor(
        private actions$: Actions,
        private productService: ProductsserviceService
    ) { }

    getProduct$ = createEffect(()=>
        this.actions$.pipe(
            ofType(productActions.getProduct),
            switchMap((payload:{productID:Number,details:string}) => {
                return this.productService.getProduct(payload.productID,payload.details)
                    .pipe(
                        map((product) => productActions.getProductSuccess({message:product.message,product:product.product})),
                        catchError((error) => of(productActions.getProductFailure({error:error.message})))
                    );
            })
        ),{dispatch: true}
    )

}
