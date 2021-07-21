import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChangesComponent } from './add-changes.component';

describe('AddChangesComponent', () => {
  let component: AddChangesComponent;
  let fixture: ComponentFixture<AddChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
