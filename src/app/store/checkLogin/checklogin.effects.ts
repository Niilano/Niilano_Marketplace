import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { UserprofileService } from "src/app/services/userprofile/userprofile.service";
import { checkLogin, checkLoginError, checkLoginSuccess } from "./checklogin.actions";

@Injectable()

export class checkLoginEffect{

    constructor(private actions$:Actions,private profileService : UserprofileService){

    }

    checkLoginEffect$ = createEffect(()=>(
        this.actions$.pipe(ofType(checkLogin),
        switchMap(()=>this.profileService.myProfile().pipe(
            map((res)=>checkLoginSuccess({profile:res.profile})),
            catchError((error)=>of(checkLoginError({error:error})))
        ))
        )
    ))

}