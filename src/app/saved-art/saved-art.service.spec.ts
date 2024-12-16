import { TestBed } from "@angular/core/testing";

import { SavedArtService } from "./saved-art.service";

describe("SavedArtService", () => {
    let service: SavedArtService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SavedArtService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
