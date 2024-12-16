import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { User } from "@root/user/user.model";
import { catchError, exhaustMap, first, map, of } from "rxjs";

import * as userActions from "../user/user.actions";
import * as authActions from "./auth.actions";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./login/login.dto";
import { LoginSuccessRTO } from "./login/login-success.rto";
import { SignupDTO } from "./signup/signup.dto";
import { SignupSuccessRTO } from "./signup/signup-success.rto";

@Injectable()
export class AuthEffects {
    private readonly actions$ = inject(Actions);
    private readonly authService = inject(AuthService);
    private readonly store = inject(Store);
    private readonly router = inject(Router);

    private readonly MAX_AUTHORIZE_ATTEMPTS = 3;
    private authorizeAttempts = 0;

    authorize$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.authorize),
            exhaustMap(() => {
                this.authorizeAttempts++;

                if (this.authorizeAttempts > this.MAX_AUTHORIZE_ATTEMPTS) {
                    return of(authActions.authorizeFailure());
                }

                return this.authService.authorize().pipe(
                    first(),
                    map((user: User) => {
                        this.authorizeAttempts = 0;
                        this.store.dispatch(userActions.setUser({ user }));
                        return authActions.authorizeSuccess();
                    }),
                    catchError(() => {
                        this.store.dispatch(authActions.updateAccessToken());
                        return of(authActions.authorizeFailure());
                    }),
                );
            }),
        ),
    );

    updateAccessToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.updateAccessToken),
            exhaustMap(() =>
                this.authService.updateAccessToken().pipe(
                    first(),
                    map((success) => {
                        if (success) {
                            this.store.dispatch(authActions.authorize());
                            return authActions.updateAccessTokenSuccess();
                        }
                        return authActions.updateAccessTokenFailure();
                    }),
                    catchError(() => of(authActions.updateAccessTokenFailure())),
                ),
            ),
        ),
    );

    signup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.signup),
            exhaustMap((signupDTO: SignupDTO) =>
                this.authService.signup(signupDTO).pipe(
                    first(),
                    map((signupSuccessRTO: SignupSuccessRTO) => {
                        console.log("message: ", signupSuccessRTO.message);
                        alert("Успешная регистрация"); // TODO: update to toast
                        this.router.navigate(["/login"]);
                        return authActions.signupSuccess();
                    }),
                    catchError(() => of(authActions.signupFailure())),
                ),
            ),
        ),
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.login),
            exhaustMap((loginDto: LoginDTO) =>
                this.authService.login(loginDto).pipe(
                    first(),
                    map((loginSuccessRTO: LoginSuccessRTO) => {
                        this.authService.setTokens(loginSuccessRTO.tokens);
                        this.store.dispatch(userActions.setUser({ user: loginSuccessRTO.user }));
                        alert("Успешный вход"); // TODO: update to toast
                        return authActions.loginSuccess();
                    }),
                    catchError(() => of(authActions.loginFailure())),
                ),
            ),
        ),
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.logout),
            map(() => {
                this.authService.logout();
                this.store.dispatch(userActions.resetUser());
                return authActions.logoutSuccess();
            }),
            catchError(() => of(authActions.logoutFailure())),
        ),
    );
}
