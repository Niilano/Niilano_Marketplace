import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProductsserviceService } from "src/app/services/productsservice/productsservice.service";
import { listProduct, listProductFailure, listProductSuccess } from "./list.actions";

@Injectable()

export class listProductEffect{

    constructor(private actions$:Actions,private productService : ProductsserviceService){

    }

    listProductEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(listProduct),
        switchMap((payload:{formData:FormData})=>this.productService.listProduct(payload.formData).pipe(
            map((res)=>listProductSuccess({message:res.message,productID:res.productID})),
            catchError(error=>of(listProductFailure({error:error.message})))
        ))
        )
    ))

}