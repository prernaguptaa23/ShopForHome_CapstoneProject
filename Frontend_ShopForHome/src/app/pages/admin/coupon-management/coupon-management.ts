import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CouponService } from '../../../core/services/coupon';
import { Coupon } from '../../../models/coupon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-management',
  standalone: true,
  templateUrl: './coupon-management.html',
  styleUrls: ['./coupon-management.css'],
  imports: [ FormsModule , ReactiveFormsModule, CommonModule]
})
export class CouponManagementComponent implements OnInit {
  coupons: Coupon[] = [];
  couponForm: FormGroup;
  editMode = false;
  selectedCouponId: number | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private couponService: CouponService) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      expiryDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCoupons();
  }

  get f() { return this.couponForm.controls; }

  loadCoupons() {
    this.couponService.getAllCoupons().subscribe({
      next: res => this.coupons = res,
      error: () => this.errorMessage = 'Failed to load coupons.'
    });
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.couponForm.invalid) return;

    const couponData = this.couponForm.value;

    if (this.editMode && this.selectedCouponId) {
      this.couponService.updateCoupon(this.selectedCouponId, couponData).subscribe({
        next: () => {
          this.successMessage = 'Coupon updated successfully!';
          this.loadCoupons();
          this.cancelEdit();
        },
        error: () => this.errorMessage = 'Failed to update coupon.'
      });
    } else {
      this.couponService.addCoupon(couponData).subscribe({
        next: () => {
          this.successMessage = 'Coupon added successfully!';
          this.loadCoupons();
          this.couponForm.reset();
        },
        error: () => this.errorMessage = 'Failed to add coupon.'
      });
    }
  }

  editCoupon(coupon: Coupon) {
    this.editMode = true;
    this.selectedCouponId = coupon.id;
    this.couponForm.patchValue({
      code: coupon.code,
      discount: coupon.discountPercentage,
      expiryDate: coupon.expiryDate.split('T')[0] // format for date input
    });
  }

  deleteCoupon(couponId: number) {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.couponService.deleteCoupon(couponId).subscribe({
        next: () => this.loadCoupons(),
        error: () => this.errorMessage = 'Failed to delete coupon.'
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedCouponId = null;
    this.couponForm.reset();
  }
}
