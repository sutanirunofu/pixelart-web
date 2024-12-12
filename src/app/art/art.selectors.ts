import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Art } from './art.model';
import { ART_NODE, ArtState } from './art.reducer';

export const selectArtState = createFeatureSelector<ArtState>(ART_NODE);

export const selectArts = createSelector(
  selectArtState,
  (state: ArtState): Art[] => state.arts
);

export const selectArtPending = createSelector(
  selectArtState,
  (state: ArtState): boolean => state.pending
);

export const selectArt = createSelector(
  selectArtState,
  (state: ArtState): ArtState => state
);
