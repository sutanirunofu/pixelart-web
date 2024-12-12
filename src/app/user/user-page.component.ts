import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectUserFirstname, selectUserUsername } from "./user.selectors";
import { CommonModule } from "@angular/common";
import { selectAuthorized } from "@root/auth/auth.selectors";
import * as authActions from "@root/auth/auth.actions";
import { Router } from "@angular/router";

@Component({
    selector: "pixelart-user-page",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./user-page.component.html",
    styleUrl: "./user-page.component.scss",
})
export class UserPageComponent {
    private readonly store = inject(Store);
    private readonly router = inject(Router);

    public authorized$ = this.store.select(selectAuthorized);
    public username$ = this.store.select(selectUserUsername);
    public firstname$ = this.store.select(selectUserFirstname);

    public login() {
        this.router.navigate(["/login"]);
    }

    public logout() {
        const confirmed = confirm("Вы уверены, что хотите выйти из аккаунта?");
        if (!confirmed) return;
        this.store.dispatch(authActions.logout());
        this.router.navigate(["/login"]);
    }
}
