import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbfViewerComponent } from './dbf-viewer.component';

describe('DbfViewerComponent', () => {
  let component: DbfViewerComponent;
  let fixture: ComponentFixture<DbfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbfViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
