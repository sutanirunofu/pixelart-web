import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SavedArtPageComponent } from "./saved-art-page.component";

describe("SavedArtPageComponent", () => {
    let component: SavedArtPageComponent;
    let fixture: ComponentFixture<SavedArtPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SavedArtPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SavedArtPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
