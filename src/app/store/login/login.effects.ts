import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { login, loginFailure, loginSuccess } from "./login.action";

@Injectable()

export class loginEffects{

    constructor(private actions$:Actions,private authService : AuthService){

    }

    loginEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(login),
        switchMap((payload:{email:string,password:string})=>this.authService.login({email:payload.email,password:payload.password}).pipe(
            map((res)=>loginSuccess({message:res.message})),
            catchError(error=>of(loginFailure({message:error.message})))
        ))
        )
    ))

}