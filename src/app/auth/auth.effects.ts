import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "./auth.service";
import * as authActions from "./auth.actions";
import { catchError, exhaustMap, first, map, of } from "rxjs";
import { LoginDTO } from "./login/login.dto";
import { LoginSuccessRTO } from "./login/login-success.rto";
import { Store } from "@ngrx/store";
import * as userActions from "../user/user.actions";
import { SignupDTO } from "./signup/signup.dto";
import { SignupSuccessRTO } from "./signup/signup-success.rto";
import { User } from "@root/user/user.model";

@Injectable()
export class AuthEffects {
    private readonly actions$ = inject(Actions);
    private readonly authService = inject(AuthService);
    private readonly store = inject(Store);

    private authorizeAttempts = 0;

    authorize$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.authorize),
            exhaustMap(() => {
                this.authorizeAttempts++;

                if (this.authorizeAttempts > 3) {
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
                        console.log(signupSuccessRTO.message);
                        alert("Успешная регистрация"); // TODO: update to toast
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
