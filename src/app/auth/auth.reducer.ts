import { createReducer, on } from "@ngrx/store";

import * as authActions from "./auth.actions";

export const AUTH_NODE = "auth";

export interface AuthState {
    authorized: boolean;
    pending: boolean;
}

export const initialState: AuthState = {
    authorized: false,
    pending: false,
};

export const authReducer = createReducer(
    initialState,
    on(authActions.authorize, (state) => ({ ...state, pending: true })),
    on(authActions.authorizeSuccess, (state) => ({ ...state, authorized: true, pending: false })),
    on(authActions.authorizeFailure, (state) => ({ ...state, authorized: false, pending: false })),

    on(authActions.updateAccessToken, (state) => ({ ...state, pending: true })),
    on(authActions.updateAccessTokenSuccess, (state) => ({ ...state, pending: false })),
    on(authActions.updateAccessTokenFailure, (state) => ({ ...state, pending: false })),

    on(authActions.login, (state) => ({ ...state, pending: true })),
    on(authActions.loginSuccess, (state) => ({
        ...state,
        authorized: true,
        pending: false,
    })),
    on(authActions.loginFailure, (state) => ({
        ...state,
        authorized: false,
        pending: false,
    })),

    on(authActions.signup, (state) => ({ ...state, pending: true })),
    on(authActions.signupSuccess, (state) => ({ ...state, pending: false })),
    on(authActions.signupFailure, (state) => ({ ...state, pending: false })),
    on(authActions.logout, (state) => ({ ...state, pending: true })),
    on(authActions.logoutSuccess, (state) => ({ ...state, authorized: false, pending: false })),
    on(authActions.logoutFailure, (state) => ({ ...state, authorized: false, pending: false })),
);
