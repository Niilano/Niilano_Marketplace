import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProductsserviceService } from "src/app/services/productsservice/productsservice.service";
import { editProduct, editProductFailure, editProductSuccess } from "./editProductState.actions";

@Injectable()

export class editProductEffect{

    constructor(private actions$:Actions,private productService : ProductsserviceService){

    }

    editProductEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(editProduct),
        switchMap((payload:{formData:FormData})=>this.productService.editProduct(payload.formData).pipe(
            map((res)=>editProductSuccess({message:res.message})),
            catchError(error=>of(editProductFailure({error:error.message})))
        ))
        )
    ))

}