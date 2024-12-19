import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SavedArt } from "@root/saved-art/saved-art.model";
import { SavedArtService } from "@root/saved-art/saved-art.service";
import { ArtSavedArt } from "@root/shared/components/art/art-saved-art.interface";

import { ArtComponent } from "../shared/components/art/art.component";
import { Art } from "./art.model";
import { ArtService } from "./art.service";

@Component({
    selector: "pixelart-art-page",
    standalone: true,
    imports: [CommonModule, ArtComponent, RouterModule],
    templateUrl: "./art-page.component.html",
    styleUrl: "./art-page.component.scss",
})
export class ArtPageComponent implements OnInit {
    private readonly artService = inject(ArtService);
    private readonly savedArtService = inject(SavedArtService);

    public arts: ArtSavedArt[] = [];

    public ngOnInit(): void {
        this.artService.findAll().subscribe((arts) => {
            this.savedArtService.findAll().subscribe((savedArts) => {
                const newArts: ArtSavedArt[] = arts.reduce((acc: ArtSavedArt[], cur: Art) => {
                    const savedArt: SavedArt | undefined = savedArts.find((s) => s.art.id === cur.id);

                    if (!savedArt) {
                        const saved: Art = JSON.parse(JSON.stringify(cur));
                        saved.map = [];
                        return [...acc, { savedArt: saved, art: cur }];
                    }

                    savedArt.art.map = savedArt.map;
                    return [...acc, { savedArt: savedArt.art, art: cur }];
                }, []);

                this.arts = newArts;
            });
        });
    }
}
