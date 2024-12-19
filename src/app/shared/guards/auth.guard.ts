import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectAuthorized } from "@root/auth/auth.selectors";
import { map } from "rxjs";

export const authGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);
    const authorized$ = store.select(selectAuthorized);

    return authorized$.pipe(
        map((authorized) => {
            if (!authorized) {
                router.navigate(["/login"]);
            }

            return authorized;
        }),
    );
};
