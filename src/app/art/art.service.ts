import { HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HttpService } from "@root/shared/services/http.service";
import { catchError, EMPTY, first, map, Observable } from "rxjs";

import { Art } from "./art.model";

@Injectable({
    providedIn: "root",
})
export class ArtService {
    private readonly ARTS_BASE_PATH = "/api/v1/arts";

    private readonly http = inject(HttpService);

    public findAll(): Observable<Art[]> {
        return this.http.get<Art[]>(this.ARTS_BASE_PATH).pipe(
            first(),
            map((response: HttpResponse<Art[]>) => {
                if (!response.body) throw Error("[Arts API] Find All: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
        );
    }

    public findById(id: string): Observable<Art> {
        return this.http.get<Art>(`${this.ARTS_BASE_PATH}/${id}`).pipe(
            first(),
            map((response: HttpResponse<Art>) => {
                if (!response.body) throw Error("[Arts API] Find By Id: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
        );
    }
}
