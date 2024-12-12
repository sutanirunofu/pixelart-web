import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Art } from "@root/art/art.model";

import { RenderArt } from "./render-art.model";

@Component({
    selector: "pixelart-art",
    standalone: true,
    imports: [NgStyle],
    templateUrl: "./art.component.html",
    styleUrl: "./art.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtComponent implements OnInit {
    private colorCache: Record<number, string> = {};

    @Input({ required: true }) public art: Art = { id: "", title: "", map: [], colors: [], publicationDate: new Date() };
    public renderArt: RenderArt = { title: "", data: [], publicationDate: new Date() };

    public ngOnInit(): void {
        const renderArtData: string[][] = [];

        this.art.map.forEach((row) => {
            const renderArtRow: string[] = [];

            row.forEach((pixel) => {
                renderArtRow.push(this.getColor(this.art.colors[pixel - 1]));
            });

            renderArtData.push(renderArtRow);
        });

        this.renderArt.title = this.art.title;
        this.renderArt.data = renderArtData;
        this.renderArt.publicationDate = this.art.publicationDate;
    }

    private getColor(num: number): string {
        if (this.colorCache[num]) {
            return this.colorCache[num];
        }

        const hex = num.toString(16);
        const color = `#${hex.padStart(6, "0")}`;
        this.colorCache[num] = color;
        return color;
    }
}
