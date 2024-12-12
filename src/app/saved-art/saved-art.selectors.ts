import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SavedArt } from './saved-art.model';
import { SAVED_ART_NODE, SavedArtState } from './saved-art.reducer';

export const selectSavedArtState =
  createFeatureSelector<SavedArtState>(SAVED_ART_NODE);

export const selectSavedArts = createSelector(
  selectSavedArtState,
  (state: SavedArtState): SavedArt[] => state.savedArts
);

export const selectSavedArtPending = createSelector(
  selectSavedArtState,
  (state: SavedArtState): boolean => state.pending
);

export const selectSavedArt = createSelector(
  selectSavedArtState,
  (state: SavedArtState): SavedArtState => state
);
