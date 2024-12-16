import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtItemBottomBarComponent } from "./art-item-bottom-bar.component";

describe("ArtItemBottomBarComponent", () => {
    let component: ArtItemBottomBarComponent;
    let fixture: ComponentFixture<ArtItemBottomBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtItemBottomBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtItemBottomBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
