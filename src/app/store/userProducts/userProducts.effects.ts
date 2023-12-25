import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
import * as userProductActions from './userproducts.actions';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';

@Injectable()
export class userProductsEffects {
    constructor(
        private actions$: Actions,
        private productService: ProductsserviceService
    ) { }

    userProducts$ = createEffect(()=>
        this.actions$.pipe(
            ofType(userProductActions.getUserProducts),
            switchMap(() => {
                return this.productService.getUserProducts()
                    .pipe(
                        map((products) => userProductActions.getUserProductsSuccess({message:products.message,products:products.products})),
                        catchError((error) => of(userProductActions.getUserProductsFailure({error:error.message})))
                    );
            })
        ),{dispatch: true}
    )

}
