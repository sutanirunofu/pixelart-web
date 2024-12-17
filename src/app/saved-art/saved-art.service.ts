import { HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HttpService } from "@root/shared/services/http.service";
import { catchError, first, map, Observable } from "rxjs";

import { CreateSavedArtDTO } from "./create-saved-art.dto";
import { SavedArt } from "./saved-art.model";
import { UpdateSavedArtDTO } from "./update-saved-art.dto";

@Injectable({
    providedIn: "root",
})
export class SavedArtService {
    private readonly SAVED_ARTS_BASE_PATH = "/api/v1/saved_arts";

    private readonly http = inject(HttpService);

    public findAll(): Observable<SavedArt[]> {
        return this.http.get<SavedArt[]>(this.SAVED_ARTS_BASE_PATH).pipe(
            first(),
            map((response: HttpResponse<SavedArt[]>) => {
                if (!response.body) throw Error("[Saved Arts API] Find All: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }),
        );
    }

    public findByArtId(id: string): Observable<SavedArt> {
        return this.http.get<SavedArt>(`${this.SAVED_ARTS_BASE_PATH}/${id}`).pipe(
            first(),
            map((response: HttpResponse<SavedArt>) => {
                if (!response.body) throw Error("[Saved Arts API] Find By Id: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }),
        );
    }

    public saveByArtId(id: string, dto: CreateSavedArtDTO): void {
        this.http
            .post<UpdateSavedArtDTO, never>(`${this.SAVED_ARTS_BASE_PATH}/${id}`, dto)
            .pipe(
                first(),
                map(() => {
                    console.log("SavedPost has been created successful: ");
                }),
                catchError((err) => {
                    console.error(err);
                    throw err;
                }),
            )
            .subscribe();
    }

    public updateByArtId(id: string, dto: UpdateSavedArtDTO): Observable<SavedArt> {
        return this.http.patch<UpdateSavedArtDTO, SavedArt>(`${this.SAVED_ARTS_BASE_PATH}/${id}`, dto).pipe(
            first(),
            map((response: HttpResponse<SavedArt>) => {
                if (!response.body) throw Error("[Saved Arts API] Update By Id: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }),
        );
    }
}
