import { createAction, props } from "@ngrx/store";

import { LoginDTO } from "./login/login.dto";
import { SignupDTO } from "./signup/signup.dto";

export const authorize = createAction("[Auth API] Authorize");
export const authorizeSuccess = createAction("[Auth API] Authorize Success");
export const authorizeFailure = createAction("[Auth API] Authorize Failure");

export const updateAccessToken = createAction("[Auth API] Update Access Token");
export const updateAccessTokenSuccess = createAction("[Auth API] Update Access Token Success");
export const updateAccessTokenFailure = createAction("[Auth API] Update Access Token Failure");

export const login = createAction("[Auth API] Login", props<LoginDTO>());
export const loginSuccess = createAction("[Auth API] Login Success");
export const loginFailure = createAction("[Auth API] Login Failure");

export const signup = createAction("[Auth API] Signup", props<SignupDTO>());
export const signupSuccess = createAction("[Auth API] Signup Success");
export const signupFailure = createAction("[Auth API] Signup Failure");

export const logout = createAction("[Auth API] Logout");
export const logoutSuccess = createAction("[Auth API] Logout Success");
export const logoutFailure = createAction("[Auth API] Logout Failure");
