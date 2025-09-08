import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementComponent } from './coupon-management';

describe('CouponManagement', () => {
  let component: CouponManagementComponent;
  let fixture: ComponentFixture<CouponManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
