import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ArtSavedArt } from "@root/shared/components/art/art-saved-art.interface";

import { ArtComponent } from "../shared/components/art/art.component";
import { SavedArt } from "./saved-art.model";
import { SavedArtService } from "./saved-art.service";

@Component({
    selector: "pixelart-saved-art-page",
    standalone: true,
    imports: [ArtComponent, RouterModule],
    templateUrl: "./saved-art-page.component.html",
    styleUrl: "./saved-art-page.component.scss",
})
export class SavedArtPageComponent implements OnInit {
    private readonly savedArtService = inject(SavedArtService);

    public arts: ArtSavedArt[] = [];

    public ngOnInit(): void {
        this.savedArtService.findAll().subscribe((arts) => {
            const newArts: ArtSavedArt[] = arts.reduce((acc: ArtSavedArt[], cur: SavedArt) => {
                const savedArt: SavedArt = JSON.parse(JSON.stringify(cur));
                savedArt.art.map = savedArt.map;
                return [...acc, { savedArt: savedArt.art, art: cur.art }];
            }, []);
            this.arts = newArts;
        });
    }
}
