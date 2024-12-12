import { createAction, props } from '@ngrx/store';

import { SavedArt } from './saved-art.model';

export const findAllSavedArts = createAction('[SavedArt API] Find All');
export const findAllSavedArtsSuccess = createAction(
  '[SavedArt API] Find All',
  props<{ savedArts: SavedArt[] }>()
);
export const findAllSavedArtsFailure = createAction('[SavedArt API] Find All');
