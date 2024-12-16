import { NgClass, NgStyle } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SavedArtService } from "@root/saved-art/saved-art.service";
import { catchError, EMPTY } from "rxjs";

import { ArtService } from "../art.service";
import { ArtItemBottomBarComponent } from "./art-item-bottom-bar/art-item-bottom-bar.component";
import { ArtItemTopBarComponent } from "./art-item-top-bar/art-item-top-bar.component";
import { Color } from "./color.mode";
import { Pixel } from "./pixel.model";

@Component({
    selector: "pixelart-art-item-page",
    standalone: true,
    imports: [NgStyle, NgClass, RouterModule, ArtItemTopBarComponent, ArtItemBottomBarComponent],
    templateUrl: "./art-item-page.component.html",
    styleUrl: "./art-item-page.component.scss",
})
export class ArtItemPageComponent implements OnInit {
    public pixelMap: Pixel[][] = [];
    public colors: Color[] = [];
    public activeColor = 0;
    public isComplete = false;

    private colorCache: Record<number, string> = {};
    private readonly route = inject(ActivatedRoute);
    private readonly savedArtService = inject(SavedArtService);
    private readonly artService = inject(ArtService);

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = params.get("id")?.toString();
            if (!id) return;
            this.loadSavedArt(id);
        });
    }

    public paint(row: number, column: number): void {
        if (this.isComplete) return;

        const pixel = this.pixelMap[row][column];

        if (pixel.painted !== undefined) {
            if (this.activeColor + 1 === pixel.painted.num) {
                pixel.painted = undefined;
                return;
            }
        }

        pixel.painted = {
            num: this.activeColor,
            color: this.colors[this.activeColor].value,
            isCorrect: pixel.num === this.activeColor + 1,
        };

        this.checkColorComplete(this.activeColor);
        this.checkArtComplete();
    }

    public setActiveColor(value: number): void {
        this.activeColor = value;
    }

    private loadSavedArt(artId: string) {
        this.savedArtService
            .findByArtId(artId)
            .pipe(
                catchError(() => {
                    this.loadArt(artId);
                    return EMPTY;
                }),
            )
            .subscribe((savedArt) => {
                this.loadPixelMap(savedArt.map, savedArt.art.colors);
            });
    }

    private loadArt(artId: string) {
        this.artService.findById(artId).subscribe((art) => {
            this.loadPixelMap(art.map, art.colors);
        });
    }

    private loadPixelMap(map: number[][], colors: number[]) {
        this.colors = colors.map((n) => ({ value: this.getColor(n), isComplete: false }));
        const pixelMap: Pixel[][] = [];

        map.forEach((row) => {
            const pixelRow: Pixel[] = [];

            row.forEach((num) => {
                const color = this.getColor(colors[num - 1]);

                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const brightness = r * 0.299 + g * 0.587 + b * 0.114;

                const pixel: Pixel = {
                    num,
                    color,
                    textColor: brightness > 186 ? "#101010" : "#ffffff",
                };
                pixelRow.push(pixel);
            });

            pixelMap.push(pixelRow);
        });

        this.pixelMap = pixelMap;
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

    private checkColorComplete(colorNumber: number): void {
        const oneColorMap = this.pixelMap.map((row) => row.filter((pixel) => pixel.num === colorNumber + 1));
        const isComplete = oneColorMap.every((row) => row.every((pixel) => pixel.painted?.isCorrect));

        if (!isComplete || this.activeColor >= this.colors.length - 1) return;

        this.colors[colorNumber].isComplete = true;
        this.activeColor++;
    }

    private checkArtComplete(): void {
        const isComplete = this.pixelMap.every((row) => row.every((pixel) => pixel.painted?.isCorrect));
        if (isComplete) {
            this.isComplete = true;

            setTimeout(() => {
                alert("Рисунок полностью разукрашен!");
            }, 200);
        }
    }
}
