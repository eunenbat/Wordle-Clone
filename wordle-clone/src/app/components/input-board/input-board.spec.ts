import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoard } from './input-board';

describe('InputBoard', () => {
  let component: InputBoard;
  let fixture: ComponentFixture<InputBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
