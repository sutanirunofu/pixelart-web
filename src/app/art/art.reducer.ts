import { createReducer, on } from '@ngrx/store';

import * as artActions from './art.actions';
import { Art } from './art.model';

export const ART_NODE = 'art';

export interface ArtState {
  arts: Art[];
  pending: boolean;
}

export const initialState: ArtState = {
  arts: [],
  pending: false,
};

export const artReducer = createReducer(
  initialState,
  on(artActions.findAllArts, (state) => ({ ...state, pending: true })),
  on(artActions.findAllArtsSuccess, (state, { arts }) => ({
    ...state,
    arts,
    pending: false,
  })),
  on(artActions.findAllArtsFailure, (state) => ({ ...state, pending: false }))
);
