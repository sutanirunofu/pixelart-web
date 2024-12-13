import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { PIXEL_CONSTANTS } from "../utils/constants";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: "root",
})
export class HttpService {
    private readonly API_PORT = "8080";

    private readonly httpClient = inject(HttpClient);
    private readonly localStorageService = inject(LocalStorageService);

    private readonly defaultHeaders = (headers?: any): HttpHeaders =>
        new HttpHeaders({
            Authorization: this.getAuthorization(),
            ...headers,
        });

    public get<T>(url: string, headers?: any): Observable<HttpResponse<T>> {
        return this.httpClient.get<T>(this.getAPIOrigin() + url, { observe: "response", headers: this.defaultHeaders(headers) });
    }

    public post<T, K>(url: string, data: T, headers?: any): Observable<HttpResponse<K>> {
        return this.httpClient.post<K>(this.getAPIOrigin() + url, data, { observe: "response", headers: this.defaultHeaders(headers) });
    }

    public put<T, K>(url: string, data: T, headers?: any): Observable<HttpResponse<K>> {
        return this.httpClient.put<K>(this.getAPIOrigin() + url, data, { observe: "response", headers: this.defaultHeaders(headers) });
    }

    public patch<T, K>(url: string, data: T, headers?: any): Observable<HttpResponse<K>> {
        return this.httpClient.patch<K>(this.getAPIOrigin() + url, data, { observe: "response", headers: this.defaultHeaders(headers) });
    }

    public delete<T>(url: string, headers?: any): Observable<HttpResponse<T>> {
        return this.httpClient.delete<T>(this.getAPIOrigin() + url, { observe: "response", headers: this.defaultHeaders(headers) });
    }

    /* ---------- PRIVATE ---------- */

    private getAPIOrigin(): string {
        if (typeof location === "undefined") return "http://localhost:8081";
        return `${location.protocol}//${location.hostname}:${this.API_PORT}`;
        // return "https://pixelart-api.onrender.com";
    }

    private getAuthorization(): string {
        const accessToken = this.localStorageService.get(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN);
        if (!accessToken) return "";
        return `Bearer ${accessToken}`;
    }
}
