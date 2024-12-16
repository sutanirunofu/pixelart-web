import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtItemPageComponent } from "./art-item-page.component";

describe("ArtItemComponent", () => {
    let component: ArtItemPageComponent;
    let fixture: ComponentFixture<ArtItemPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtItemPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtItemPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
