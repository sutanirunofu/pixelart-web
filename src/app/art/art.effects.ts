import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, first, map, of } from "rxjs";

import * as artActions from "./art.actions";
import { Art } from "./art.model";
import { ArtService } from "./art.service";

@Injectable()
export class ArtEffects {
    private readonly actions$ = inject(Actions);
    private readonly artService = inject(ArtService);

    findAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(artActions.findAllArts),
            exhaustMap(() =>
                this.artService.findAll().pipe(
                    first(),
                    map((arts: Art[]) => artActions.findAllArtsSuccess({ arts })),
                    catchError(() => of(artActions.findAllArtsFailure())),
                ),
            ),
        ),
    );
}
