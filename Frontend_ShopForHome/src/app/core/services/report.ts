import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${environment.apiUrl}/ReportsApi`;

  constructor(private http: HttpClient) { }

  /** Get overall sales report */
  getSalesReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales`);
  }

  /** Get sales report by product */
  getProductSalesReport(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${productId}`);
  }

  /** Get sales report by date range */
  getSalesReportByDate(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/salesByDate?start=${startDate}&end=${endDate}`);
  }
}
