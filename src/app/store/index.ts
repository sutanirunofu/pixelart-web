import { isDevMode } from "@angular/core";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { ArtEffects } from "@root/art/art.effects";

import { ART_NODE, artReducer, ArtState } from "../art/art.reducer";
import { AuthEffects } from "../auth/auth.effects";
import { AUTH_NODE, authReducer, AuthState } from "../auth/auth.reducer";
import { SAVED_ART_NODE, savedArtReducer, SavedArtState } from "../saved-art/saved-art.reducer";
import { USER_NODE, userReducer, UserState } from "../user/user.reducer";

export interface IState {
    [AUTH_NODE]: AuthState;
    [USER_NODE]: UserState;
    [ART_NODE]: ArtState;
    [SAVED_ART_NODE]: SavedArtState;
}

export const reducers: ActionReducerMap<IState> = {
    [AUTH_NODE]: authReducer,
    [USER_NODE]: userReducer,
    [ART_NODE]: artReducer,
    [SAVED_ART_NODE]: savedArtReducer,
};

export const metaReducers: MetaReducer<IState>[] = !isDevMode() ? [] : [];

export const effects = [AuthEffects, ArtEffects];
