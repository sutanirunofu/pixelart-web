import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { authorize } from "./auth/auth.actions";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    private readonly store = inject(Store);

    ngOnInit(): void {
        this.store.dispatch(authorize());
    }
}
