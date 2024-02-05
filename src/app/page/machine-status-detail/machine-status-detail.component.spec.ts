import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStatusDetailComponent } from './machine-status-detail.component';

describe('MachineStatusDetailComponent', () => {
  let component: MachineStatusDetailComponent;
  let fixture: ComponentFixture<MachineStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineStatusDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
