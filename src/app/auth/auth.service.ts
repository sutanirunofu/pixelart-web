import { HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HttpService } from "@root/shared/services/http.service";
import { LocalStorageService } from "@root/shared/services/local-storage.service";
import { User } from "@root/user/user.model";
import { catchError, EMPTY, first, map, Observable, of } from "rxjs";

import { PIXEL_CONSTANTS } from "../shared/utils/constants";
import { LoginDTO } from "./login/login.dto";
import { AccessTokens, LoginSuccessRTO } from "./login/login-success.rto";
import { SignupDTO } from "./signup/signup.dto";
import { SignupSuccessRTO } from "./signup/signup-success.rto";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly AUTH_BASE_PATH = "/api/v1/auth";

    private readonly http = inject(HttpService);
    private readonly localStorageService = inject(LocalStorageService);

    public authorize(): Observable<User> {
        return this.http.get<User>(this.AUTH_BASE_PATH + "/me").pipe(
            first(),
            map((response: HttpResponse<User>) => {
                if (!response.body) throw Error("[Auth API] Authorize: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
        );
    }

    public signup(signupDTO: SignupDTO): Observable<SignupSuccessRTO> {
        return this.http.post<SignupDTO, SignupSuccessRTO>(this.AUTH_BASE_PATH + "/signup", signupDTO).pipe(
            first(),
            map((response: HttpResponse<SignupSuccessRTO>) => {
                if (!response.body) throw Error("[Auth API] Signup: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
        );
    }

    public login(loginDTO: LoginDTO): Observable<LoginSuccessRTO> {
        return this.http.post<LoginDTO, LoginSuccessRTO>(this.AUTH_BASE_PATH + "/login", loginDTO).pipe(
            first(),
            map((response: HttpResponse<LoginSuccessRTO>) => {
                if (!response.body) throw Error("[Auth API] Login: Body not found!");
                return response.body;
            }),
            catchError((err) => {
                console.error(err);
                return EMPTY;
            }),
        );
    }

    public logout(): Observable<never> {
        this.localStorageService.remove(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN);
        this.localStorageService.remove(PIXEL_CONSTANTS.LOCAL_STORAGE.REFRESH_TOKEN);

        return EMPTY;
    }

    public updateAccessToken(): Observable<boolean> {
        const refreshToken = this.localStorageService.get(PIXEL_CONSTANTS.LOCAL_STORAGE.REFRESH_TOKEN);

        if (!refreshToken) return of(false);

        return this.http
            .post<object, { accessToken: string }>(
                this.AUTH_BASE_PATH + "/update_access_token",
                {},
                {
                    Authorization: `Bearer ${refreshToken}`,
                },
            )
            .pipe(
                first(),
                map((response: HttpResponse<{ accessToken: string }>) => {
                    if (!response.body) throw Error("[Auth API] Update Access Token: Body not found!");
                    this.localStorageService.set(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN, response.body.accessToken);
                    return true;
                }),
            );
    }

    public setTokens(tokens: AccessTokens): void {
        this.localStorageService.set(PIXEL_CONSTANTS.LOCAL_STORAGE.ACCESS_TOKEN, tokens.accessToken);
        this.localStorageService.set(PIXEL_CONSTANTS.LOCAL_STORAGE.REFRESH_TOKEN, tokens.refreshToken);
    }
}
