import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProductsserviceService } from "src/app/services/productsservice/productsservice.service";
import { getProductsSummary, getProductsSummaryFailure, getProductsSummarySuccess } from "./productsSummary.action";

@Injectable()

export class productsSummaryEffect{

    constructor(private actions$:Actions,private productService : ProductsserviceService){

    }

    productsSummaryEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(getProductsSummary),
        switchMap(()=>this.productService.getProductsSummary().pipe(
            map((res)=>getProductsSummarySuccess({productsSummary:res.products})),
            catchError(error=>of(getProductsSummaryFailure({error:error.message})))
        ))
        )
    ))

}