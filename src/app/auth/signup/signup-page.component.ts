import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { first } from "rxjs";

import * as authActions from "../auth.actions";
import { selectAuthorized, selectAuthPending } from "../auth.selectors";

@Component({
    selector: "pixelart-signup-page",
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: "./signup-page.component.html",
    styleUrl: "./signup-page.component.scss",
})
export class SignupPageComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly router = inject(Router);

    public readonly pending$ = this.store.select(selectAuthPending);
    private readonly authorized$ = this.store.select(selectAuthorized);

    public ngOnInit(): void {
        this.authorized$.subscribe((authorized) => {
            if (authorized) {
                this.router.navigate(["/arts"]);
            }
        });
    }

    public signup(event: SubmitEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        const firstname = formData.get("firstname")?.toString() ?? "";
        const username = formData.get("username")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const confirmPassword = formData.get("confirm_password")?.toString() ?? "";

        // TODO: update to toast
        if (!username.trim()) {
            alert("Имя не должно быть пустым");
            return;
        }

        if (!username.trim()) {
            alert("Никнейм не должен быть пустым");
            return;
        }

        if (!password.trim()) {
            alert("Пароль не должен быть пустым");
            return;
        }

        if (password !== confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        let isSignupStart = false;

        this.pending$.subscribe((pending) => {
            if (isSignupStart && !pending) {
                this.authorized$.pipe(first()).subscribe((authorized) => {
                    if (authorized) {
                        this.router.navigate(["/login"]);
                    }
                });
            } else if (!isSignupStart && pending) {
                isSignupStart = true;
            }
        });

        this.store.dispatch(authActions.signup({ firstname, username, password }));
    }
}
