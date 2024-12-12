import { NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter } from "rxjs";

@Component({
    selector: "pixelart-navbar",
    standalone: true,
    imports: [RouterModule, NgClass],
    templateUrl: "./navbar.component.html",
    styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit {
    private readonly router = inject(Router);

    public currentPage = "login";

    public ngOnInit(): void {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            this.currentPage = event.url.split("/")[1];
        });
    }
}
