import { NgClass, NgStyle } from "@angular/common";
import { Component, HostListener, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { SavedArtService } from "@root/saved-art/saved-art.service";
import { ElementMovementDirective } from "@root/shared/directives/element-movement.directive";
import { catchError, EMPTY } from "rxjs";

import { ArtService } from "../art.service";
import { ArtItemBottomBarComponent } from "./art-item-bottom-bar/art-item-bottom-bar.component";
import { ArtItemTopBarComponent } from "./art-item-top-bar/art-item-top-bar.component";
import { Color } from "./color.mode";
import { Pixel } from "./pixel.model";

@Component({
    selector: "pixelart-art-item-page",
    standalone: true,
    imports: [NgStyle, NgClass, RouterModule, ArtItemTopBarComponent, ArtItemBottomBarComponent, ElementMovementDirective],
    templateUrl: "./art-item-page.component.html",
    styleUrl: "./art-item-page.component.scss",
})
export class ArtItemPageComponent implements OnInit {
    public pixelMap: Pixel[][] = [];
    public colors: Color[] = [];
    public activeColor = 0;
    public isComplete = false;
    public hasChanges = false;
    public isSimple = false;

    public zoom = 1;
    public lastScale = 1;

    public readonly PIXEL_SIZE = 30;

    private readonly ZOOM_STEP = 0.1;
    private readonly ZOOM_MAX = 3;
    private ZOOM_MIN = 0.5;
    private readonly SAVE_PIXEL_COUNT = 5;

    private initialDistance: number | null = null;

    private isSaved = false;
    private currentArtId?: string;
    private paintedPixelsCount = 0;
    private colorCache: Record<number, string> = {};

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly savedArtService = inject(SavedArtService);
    private readonly artService = inject(ArtService);

    public ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.currentArtId = params.get("id")?.toString();
            if (!this.currentArtId) return;
            this.loadSavedArt(this.currentArtId);
        });
    }

    @HostListener("window:beforeunload")
    public beforeUnload() {
        this.save();
    }

    public onWheel(event: WheelEvent) {
        event.preventDefault();

        if (event.deltaY < 0 && this.zoom <= this.ZOOM_MAX) {
            this.zoom += this.ZOOM_STEP;
        } else if (this.zoom >= this.ZOOM_MIN) {
            this.zoom -= this.ZOOM_STEP;
        }

        this.isSimple = this.zoom > this.ZOOM_MIN + 0.1;
    }

    onTouchStart(event: TouchEvent) {
        if (event.touches.length !== 2) return;
        this.initialDistance = this.getDistance(event.touches[0], event.touches[1]);
    }

    onTouchMove(event: TouchEvent) {
        if (event.touches.length !== 2 || this.initialDistance === null) return;

        const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
        const nextZoom = this.lastScale * (currentDistance / this.initialDistance);

        if (nextZoom <= this.ZOOM_MAX && nextZoom >= this.ZOOM_MIN) {
            this.zoom = nextZoom;
        }

        this.isSimple = this.zoom > this.ZOOM_MIN + 0.4;
    }

    onTouchEnd() {
        this.lastScale = this.zoom;
        this.initialDistance = null;
    }

    public paint(event: Event, row: number, column: number): void {
        event.stopPropagation();

        if (this.isSaved === false && this.currentArtId !== undefined) {
            this.savedArtService.saveByArtId(this.currentArtId, { map: [], isComplete: false }).subscribe(() => {
                this.isSaved = true;
            });
        }

        if (this.isComplete) return;

        this.hasChanges = true;

        const pixel: Pixel = this.pixelMap[row][column];
        this.paintedPixelsCount++;

        if (this.paintedPixelsCount >= this.SAVE_PIXEL_COUNT) {
            this.save();
            this.paintedPixelsCount = 0;
        }

        pixel.painted = {
            num: this.activeColor + 1,
            color: this.colors[this.activeColor].value,
            isCorrect: pixel.num === this.activeColor + 1,
        };

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

    public back(): void {
        this.save();
        this.router.navigate(["/arts"]);
    }

    public getTextColor(color: string): string {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const brightness = r * 0.299 + g * 0.587 + b * 0.114;
        return brightness > 186 ? "#101010" : "#ffffff";
    }

    private loadSavedArt(artId: string) {
        this.savedArtService
            .findByArtId(artId)
            .pipe(
                catchError(() => {
                    this.loadArt(artId);

                    if (!this.currentArtId) {
                        console.error("Art id not found!");
                    }

                    return EMPTY;
                }),
            )
            .subscribe((savedArt) => {
                this.isSaved = true;

                this.loadPixelMap(savedArt.art.map ?? [], savedArt.art.colors);

                savedArt.map.forEach((row, y) => {
                    row.forEach((col, x) => {
                        if (col === 0) return;

                        this.pixelMap[y][x].painted = {
                            num: col,
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
        this.colors = colors.map((n) => ({ value: this.getColor(n), isComplete: false }));
        const pixelMap: Pixel[][] = [];

        map.forEach((row) => {
            const pixelRow: Pixel[] = [];

            row.forEach((num) => {
                if (num < 1) return;

                const color = this.getColor(colors[num - 1]);
                const textColor = this.getTextColor(color);

                const pixel: Pixel = {
                    num,
                    color,
                    textColor,
                };
                pixelRow.push(pixel);
            });

            pixelMap.push(pixelRow);
        });

        this.pixelMap = pixelMap;

        this.initZoom();
        this.checkArtComplete();
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
        setTimeout(() => {
            const isComplete = this.pixelMap.every((row) => {
                return row.every((pixel) => pixel.painted?.isCorrect);
            });

            if (isComplete) {
                this.save();
                this.isComplete = true;

                this.zoom = this.ZOOM_MIN;
            }

            for (let i = 0; i < this.colors.length; i++) {
                this.checkColorComplete(i);
            }
        });
    }

    private initZoom() {
        if (this.pixelMap.length < 1) return;
        const width = this.pixelMap[0].length;
        this.ZOOM_MIN = 12 / width;
        this.zoom = this.ZOOM_MIN;
    }

    private getDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private save() {
        if (!this.currentArtId) {
            console.error("Art id not found!");
            return;
        }

        const map: number[][] = this.pixelMap.map((row) => row.map((p) => (p.painted !== undefined ? p.painted.num : 0)));

        this.savedArtService.updateByArtId(this.currentArtId, { map, isComplete: this.isComplete }).subscribe();
    }
}
