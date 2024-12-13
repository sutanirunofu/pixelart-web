import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { ArtComponent } from "../shared/components/art/art.component";
import { findAllArts } from "./art.actions";
import { selectArts } from "./art.selectors";
import { first } from "rxjs";

@Component({
    selector: "pixelart-art-page",
    standalone: true,
    imports: [CommonModule, ArtComponent],
    templateUrl: "./art-page.component.html",
    styleUrl: "./art-page.component.scss",
})
export class ArtPageComponent implements OnInit {
    private readonly store = inject(Store);

    public arts$ = this.store.select(selectArts);

    public ngOnInit(): void {
        this.arts$.pipe(first()).subscribe(arts => {
            if (arts.length === 0) {
                this.store.dispatch(findAllArts());
            }
        })
        
    }
}
