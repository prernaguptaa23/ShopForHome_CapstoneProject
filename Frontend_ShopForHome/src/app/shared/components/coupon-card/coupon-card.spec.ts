import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCardComponent } from './coupon-card';

describe('CouponCard', () => {
  let component: CouponCardComponent;
  let fixture: ComponentFixture<CouponCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
