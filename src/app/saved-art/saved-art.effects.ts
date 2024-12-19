import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, first, map, of } from "rxjs";

import * as savedArtActions from "./saved-art.actions";
import { SavedArt } from "./saved-art.model";
import { SavedArtService } from "./saved-art.service";

@Injectable()
export class ArtEffects {
    private readonly actions$ = inject(Actions);
    private readonly savedArtService = inject(SavedArtService);

    findAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(savedArtActions.findAllSavedArts),
            exhaustMap(() =>
                this.savedArtService.findAll().pipe(
                    first(),
                    map((savedArts: SavedArt[]) => savedArtActions.findAllSavedArtsSuccess({ savedArts })),
                    catchError(() => of(savedArtActions.findAllSavedArtsFailure())),
                ),
            ),
        ),
    );
}
