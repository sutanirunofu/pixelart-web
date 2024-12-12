import { createAction, props } from "@ngrx/store";

import { Art } from "./art.model";

export const findAllArts = createAction("[Art API] Find All");
export const findAllArtsSuccess = createAction("[Art API] Find All Success", props<{ arts: Art[] }>());
export const findAllArtsFailure = createAction("[Art API] Find All Failure");
