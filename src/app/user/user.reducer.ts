import { createReducer, on } from "@ngrx/store";

import * as userActions from "./user.actions";
import { User } from "./user.model";

export const USER_NODE = "user";

export interface UserState {
    user: User;
    pending: boolean;
}

export const defaultUser: User = {
    id: "",
    username: "pixelart",
    firstname: "PixelArt",
    registrationDate: new Date(),
};

export const initialState: UserState = {
    user: defaultUser,
    pending: false,
};

export const userReducer = createReducer(
    initialState,
    on(userActions.findUserByJWT, (state) => ({ ...state, pending: true })),
    on(userActions.findUserByJWTSuccess, (state, { user }) => ({
        ...state,
        user,
        pending: false,
    })),
    on(userActions.findUserByJWTFailure, (state) => ({
        ...state,
        pending: false,
    })),
    on(userActions.setUser, (state, { user }) => ({ ...state, user })),
    on(userActions.resetUser, (state) => ({ ...state, user: defaultUser })),
);
