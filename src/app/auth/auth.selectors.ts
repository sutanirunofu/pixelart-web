import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_NODE, AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_NODE);

export const selectAuthorized = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.authorized
);

export const selectAuthPending = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.pending
);

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState): AuthState => state
);
