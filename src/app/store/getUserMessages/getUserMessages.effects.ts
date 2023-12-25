import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { UserMessagesService } from "src/app/services/userMessages/user-messages.service";
import { getUserMessages,getUserMessagesFail,getUserMessagesSuccess } from "./userMessages.action";

@Injectable()

export class getUserMessagesEffects{

    constructor(private actions$:Actions,private userMessagesService : UserMessagesService){

    }

    getUserMessagesEffects$ = createEffect(()=>(
        this.actions$.pipe(ofType(getUserMessages),
        switchMap(()=>this.userMessagesService.getUserMessages().pipe(
            map((res)=>getUserMessagesSuccess({message:res.message,usersMessages:res.usersMessages,totalUnreadMessages:res.totalUnreadMessages})),
            catchError(error=>of(getUserMessagesFail({error:error.message})))
        ))
        )
    ))

}