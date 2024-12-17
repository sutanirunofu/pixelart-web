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

    private currentArtId?: string;
    private paintedPixelsCount = 0;
    private colorCache: Record<number, string> = {};
    private readonly route = inject(ActivatedRoute);
    private readonly savedArtService = inject(SavedArtService);
    private readonly artService = inject(ArtService);

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.currentArtId = params.get("id")?.toString();
            if (!this.currentArtId) return;
            this.loadSavedArt(this.currentArtId);
        });
    }

    public paint(row: number, column: number): void {
        if (this.isComplete) return;

        const pixel = this.pixelMap[row][column];
        this.paintedPixelsCount++;

        if (this.paintedPixelsCount >= 10) {
            this.save();
            this.paintedPixelsCount = 0;
        }

        if (pixel.painted !== undefined && pixel.painted.isCorrect) {
            pixel.painted = undefined;
            return;
        }

        pixel.painted = {
            num: this.activeColor,
            color: this.colors[this.activeColor].value,
            isCorrect: pixel.num === this.activeColor + 1,
        };

        for (let i = 0; i < this.colors.length; i++) {
            this.checkColorComplete(i);
        }

        const isComplete = this.checkColorComplete(this.activeColor);

        if (isComplete) {
            for (let i = 0; i < this.colors.length; i++) {
                const isColorComplete = this.checkColorComplete(i);

                if (!isColorComplete) {
                    this.activeColor = i;
                    break;
                }
            }
        }

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

                    if (!this.currentArtId) {
                        console.error("Art id not found!");
                        return EMPTY;
                    }

                    this.savedArtService.saveByArtId(this.currentArtId, { map: [], isComplete: false });

                    return EMPTY;
                }),
            )
            .subscribe((savedArt) => {
                this.loadPixelMap(savedArt.art.map ?? [], savedArt.art.colors);

                savedArt.map.forEach((row, y) => {
                    row.forEach((col, x) => {
                        // console.log(this.pixelMap[y][x].num, col);

                        this.pixelMap[y][x].painted = {
                            num: col + 1,
                            color: this.getColor(savedArt.art.colors[col - 1]),
                            isCorrect: this.pixelMap[y][x].num === col,
                        };
                    });
                });
            });
    }

    private loadArt(artId: string) {
        this.artService.findById(artId).subscribe((art) => {
            this.loadPixelMap(art.map, art.colors);
        });
    }

    private loadPixelMap(map: number[][], colors: number[]) {
        console.log(map, colors);
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
        if (num === undefined) {
            return "transparent";
        }

        if (this.colorCache[num]) {
            return this.colorCache[num];
        }

        const hex = num.toString(16);
        const color = `#${hex.padStart(6, "0")}`;
        this.colorCache[num] = color;
        return color;
    }

    private checkColorComplete(colorNumber: number): boolean {
        const oneColorMap = this.pixelMap.map((row) => row.filter((pixel) => pixel.num === colorNumber + 1));
        const isComplete = oneColorMap.every((row) => row.every((pixel) => pixel.painted?.isCorrect));

        if (!isComplete) {
            this.colors[colorNumber].isComplete = false;
            return false;
        }

        this.colors[colorNumber].isComplete = true;

        return true;
    }

    private checkArtComplete(): void {
        const isComplete = this.pixelMap.every((row) => row.every((pixel) => pixel.painted?.isCorrect));
        if (isComplete) {
            this.save();
            this.isComplete = true;

            setTimeout(() => {
                alert("Рисунок полностью разукрашен!");
            }, 200);
        }
    }

    private save() {
        if (!this.currentArtId) {
            console.error("Art id not found!");
            return;
        }

        const map: number[][] = this.pixelMap.map((row) => row.map((p) => (p.painted?.isCorrect ? p.num : 0)));
        this.savedArtService.updateByArtId(this.currentArtId, { map, isComplete: this.isComplete }).subscribe();
    }
}
