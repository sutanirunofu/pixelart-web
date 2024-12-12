import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtPageComponent } from './art-page.component';

describe('ArtPageComponent', () => {
  let component: ArtPageComponent;
  let fixture: ComponentFixture<ArtPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
