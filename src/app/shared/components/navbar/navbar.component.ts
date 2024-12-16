import { NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
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

    public isShow = false;
    public whitePagesList = [/^(\/)$/, /^(\/user)$/, /^(\/arts)$/, /^(\/saved-arts)$/];
    public currentPage = "";

    public ngOnInit(): void {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            this.currentPage = event.url;
            this.isShow = this.whitePagesList.filter((page) => page.test(this.currentPage)).length > 0;
        });
    }
}
