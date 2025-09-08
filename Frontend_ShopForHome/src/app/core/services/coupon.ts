import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Coupon } from '../../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiUrl = `${environment.apiUrl}/CouponsApi`;

  constructor(private http: HttpClient) { }

  /** Add a new coupon */
addCoupon(coupon: Coupon): Observable<Coupon> {
  return this.http.post<Coupon>(`${this.apiUrl}/add`, coupon);
}

/** Update an existing coupon */
updateCoupon(id: number, coupon: Coupon): Observable<Coupon> {
  return this.http.put<Coupon>(`${this.apiUrl}/update/${id}`, coupon);
}

/** Delete a coupon */
deleteCoupon(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
}

  /** Get all coupons */
  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/getAll`);
  }

  /** Get coupon by code */
  getCouponByCode(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/getByCode/${code}`);
  }

  /** Assign coupon to a user */
  assignCouponToUser(couponId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assign`, { couponId, userId });
  }

  /** Validate coupon for a user */
  validateCoupon(userId: number, code: string): Observable<{ valid: boolean, discount: number }> {
    return this.http.post<{ valid: boolean, discount: number }>(`${this.apiUrl}/validate`, { userId, code });
  }
}
