import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { register, registerFailure, registerSuccess } from "./register.action";
import { registrationDetails } from "./registrationDetails";

@Injectable()
export class registerEffects{

    constructor(private actions$:Actions,private authService:AuthService){

    }

    registerEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(register),
        switchMap((payload:{registrationDetails:registrationDetails})=>this.authService.register(payload.registrationDetails).pipe(
            map((res)=>registerSuccess({message:res.message})),
            catchError(error=>of(registerFailure({message:error.message})))
        ))
        )
    ))

}
// switchMap((payload:{email:string,password:string})=>this.authService.login({email:payload.email,password:payload.password}).pipe(
//     map((res)=>loginSuccess({access_token:res.token,message:res.message})),
//     catchError(error=>of(loginFailure({message:error.message})))
// ))