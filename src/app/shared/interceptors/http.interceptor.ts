import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { map, Observable, retry, timeout } from "rxjs";
import { LocalStorageService } from "../services/local-storage.service";
import { PixelartConstants } from "../utils/constants";

export class HttpInterceptor implements HttpInterceptor {
    private readonly localStorageService = inject(LocalStorageService);

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.localStorageService.get(PixelartConstants.LOCAL_STORAGE.ACCESS_TOKEN);

        if (accessToken) {
            request.headers.append("Authorization", `Bearer ${accessToken}`);
        }

        return next.handle(request).pipe(timeout(10_000), retry(3)).pipe(map(this.handleNewAccessToken));
    }

    private handleNewAccessToken = <T>(response: HttpEvent<T>): HttpEvent<T> => {
        if (response instanceof HttpResponse) {
            if (response.headers.has("Authorization")) {
                const auth = response.headers.get("Authorization");

                console.log(auth);

                if (auth) {
                    const accessToken = auth.split(" ")[1];
                    this.localStorageService.set(PixelartConstants.LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
                }
            }

            console.log(response);
        }

        return response;
    };
}
