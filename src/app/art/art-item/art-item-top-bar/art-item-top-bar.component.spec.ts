import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtItemTopBarComponent } from "./art-item-top-bar.component";

describe("ArtItemTopBarComponent", () => {
    let component: ArtItemTopBarComponent;
    let fixture: ComponentFixture<ArtItemTopBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtItemTopBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtItemTopBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
