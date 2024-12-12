import { createReducer, on } from '@ngrx/store';

import * as savedArtActions from './saved-art.actions';
import { SavedArt } from './saved-art.model';

export const SAVED_ART_NODE = 'saved_art';

export interface SavedArtState {
  savedArts: SavedArt[];
  pending: boolean;
}

export const initialState: SavedArtState = {
  savedArts: [],
  pending: false,
};

export const savedArtReducer = createReducer(
  initialState,
  on(savedArtActions.findAllSavedArts, (state) => ({
    ...state,
    pending: true,
  })),
  on(savedArtActions.findAllSavedArtsSuccess, (state, { savedArts }) => ({
    ...state,
    savedArts,
    pending: false,
  })),
  on(savedArtActions.findAllSavedArtsFailure, (state) => ({
    ...state,
    pending: false,
  }))
);
