import { createFeatureSelector, createSelector } from '@ngrx/store';

import { User } from './user.model';
import { USER_NODE, UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>(USER_NODE);

export const selectUserPending = createSelector(
  selectUserState,
  (state: UserState): boolean => state.pending
);

export const selectUser = createSelector(
  selectUserState,
  (state: UserState): User => state.user
);

export const selectUserId = createSelector(
  selectUserState,
  (state: UserState): string => state.user.id
);

export const selectUserUsername = createSelector(
  selectUserState,
  (state: UserState): string => state.user.username
);

export const selectUserFirstname = createSelector(
  selectUserState,
  (state: UserState): string => state.user.firstname
);

export const selectUserRegistrationDate = createSelector(
  selectUserState,
  (state: UserState): Date => state.user.registrationDate
);

export const selectUserSt = createSelector(
  selectUserState,
  (state: UserState): UserState => state
);
