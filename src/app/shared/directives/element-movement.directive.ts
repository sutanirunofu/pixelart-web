import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: "[pixelartElementMovement]",
    standalone: true,
})
export class ElementMovementDirective {
    private isDragging = false;
    private startX = 0;
    private startY = 0;
    private initialX = 0;
    private initialY = 0;

    constructor(private el: ElementRef) {}

    @HostListener("mousedown", ["$event"])
    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.initialX = this.el.nativeElement.offsetLeft;
        this.initialY = this.el.nativeElement.offsetTop;

        // Prevent text selection
        event.preventDefault();
    }

    @HostListener("document:mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
        if (this.isDragging) {
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;
            this.el.nativeElement.style.left = `${this.initialX + dx}px`;
            this.el.nativeElement.style.top = `${this.initialY + dy}px`;
        }
    }

    @HostListener("document:mouseup")
    onMouseUp() {
        this.isDragging = false;
    }

    @HostListener("document:mouseleave")
    onMouseLeave() {
        this.isDragging = false;
    }

    // Touch events for mobile devices
    @HostListener("touchstart", ["$event"])
    onTouchStart(event: TouchEvent) {
        if (event.touches.length !== 2) return;

        this.isDragging = true;
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.initialX = this.el.nativeElement.offsetLeft;
        this.initialY = this.el.nativeElement.offsetTop;

        // Prevent default touch behavior
        event.preventDefault();
    }

    @HostListener("document:touchmove", ["$event"])
    onTouchMove(event: TouchEvent) {
        if (this.isDragging) {
            const dx = event.touches[0].clientX - this.startX;
            const dy = event.touches[0].clientY - this.startY;
            this.el.nativeElement.style.left = `${this.initialX + dx}px`;
            this.el.nativeElement.style.top = `${this.initialY + dy}px`;
        }
    }

    @HostListener("document:touchend")
    onTouchEnd() {
        this.isDragging = false;
    }
}
