import { inject, Injectable } from "@angular/core";
import { HttpService } from "@root/shared/services/http.service";
import { Art } from "./art.model";
import { first, map, Observable, reduce } from "rxjs";
import { HttpResponse } from "@angular/common/http";

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
        );
    }
}
