import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { first } from "rxjs";

import * as authActions from "../auth.actions";
import { selectAuthorized, selectAuthPending } from "../auth.selectors";

@Component({
    selector: "pixelart-login-page",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./login-page.component.html",
    styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly router = inject(Router);

    public pending$ = this.store.select(selectAuthPending);
    private readonly authorized$ = this.store.select(selectAuthorized);

    public ngOnInit(): void {
        this.authorized$.subscribe((authorized) => {
            if (authorized) {
                this.router.navigate(["/arts"]);
            }
        });
    }

    public login(event: SubmitEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        const username = formData.get("username")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        let isLoginStart = false;

        this.pending$.subscribe((pending) => {
            if (isLoginStart && !pending) {
                this.authorized$.pipe(first()).subscribe((authorized) => {
                    if (authorized) {
                        this.router.navigate(["/arts"]);
                    }
                });
            } else if (!isLoginStart && pending) {
                isLoginStart = true;
            }
        });

        this.store.dispatch(authActions.login({ username, password }));
    }
}
