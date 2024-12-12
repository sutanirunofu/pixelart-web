import { createAction, props } from "@ngrx/store";

import { User } from "./user.model";

export const findUserByJWT = createAction("[User API] Find By JWT");
export const findUserByJWTSuccess = createAction("[User API] Find By JWT Success", props<{ user: User }>());
export const findUserByJWTFailure = createAction("[User API] Find By JWT Failure");

export const setUser = createAction("[User API] Set User", props<{ user: User }>());
export const resetUser = createAction("[User API] Reset User");
