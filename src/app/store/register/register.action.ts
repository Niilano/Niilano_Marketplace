import { createAction, props } from "@ngrx/store";
import { registrationDetails } from "./registrationDetails";

export const register = createAction("[register]",props<{registrationDetails:registrationDetails}>())

export const registerSuccess = createAction("[register] successful",props<{message:string}>())

export const registerFailure = createAction("[register] failure",props<{message:string}>())

export const resetRegistrationStateValues = createAction("[register] reset")