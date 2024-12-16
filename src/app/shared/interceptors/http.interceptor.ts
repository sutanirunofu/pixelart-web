import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { map, Observable } from "rxjs";

import { LocalStorageService } from "../services/local-storage.service";
import { PIXEL_CONSTANTS } from "../utils/constants";

export class HttpInterceptor implements HttpInterceptor {
    private readonly localStorageService = inject(LocalStorageService);

    private readonly RETRY_COUNT = 3;
    private readonly RETRY_DELAY = 2000;

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = this.localStorageService.get(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN);

        if (accessToken) {
            request.headers.append("Authorization", `Bearer ${accessToken}`);
        }

        return next.handle(request).pipe(map(this.handleNewAccessToken));
    }

    private handleNewAccessToken = <T>(response: HttpEvent<T>): HttpEvent<T> => {
        if (response instanceof HttpResponse) {
            if (response.headers.has("Authorization")) {
                const auth = response.headers.get("Authorization");

                if (auth) {
                    const accessToken = auth.split(" ")[1];
                    this.localStorageService.set(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
                }
            }
        }

        return response;
    };
}
