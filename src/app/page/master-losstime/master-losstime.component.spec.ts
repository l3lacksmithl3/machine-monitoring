import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLosstimeComponent } from './master-losstime.component';

describe('MasterLosstimeComponent', () => {
  let component: MasterLosstimeComponent;
  let fixture: ComponentFixture<MasterLosstimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterLosstimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterLosstimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
