import { NgClass, NgStyle } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Color } from "../color.mode";

@Component({
    selector: "pixelart-art-item-bottom-bar",
    standalone: true,
    imports: [NgStyle, NgClass],
    templateUrl: "./art-item-bottom-bar.component.html",
    styleUrl: "./art-item-bottom-bar.component.scss",
})
export class ArtItemBottomBarComponent {
    @Input() isComplete = false;
    @Input() colors: Color[] = [];
    @Input() activeColor = 0;
    @Output() changeColor = new EventEmitter<number>();

    public setActiveColor(value: number): void {
        if (this.isComplete) return;
        this.changeColor.emit(value);
    }

    public getTextColor(color: string): string {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const brightness = r * 0.299 + g * 0.587 + b * 0.114;

        return brightness > 186 ? "#101010" : "#ffffff";
    }
}
