import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Make sure this matches your frontend User model
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = `${environment.apiUrl}/AccountApi`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser = this._currentUser.asObservable();

  constructor(private http: HttpClient) {
  // 🚨 Always start logged out
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('fullname');
  localStorage.removeItem('email');

  this._currentUser.next(null);
}



  // Call this after login or register
  setCurrentUser(user: User) {
    this._currentUser.next(user);
    // Save in localStorage for persistence
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('fullname', user.fullName);
    localStorage.setItem('email', user.email);
    localStorage.setItem('role', user.role);  }


register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }




  /** Login user and store JWT */
  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
    tap(res => {
      // Save JWT token
      localStorage.setItem('token', res.token);

      // Save full user info
      const loggedInUser: User = {
        id: res.userId,
        fullName: res.fullName,  // use fullName from backend
        email: res.email,
        role: res.role
      };
      this.setCurrentUser(loggedInUser); // updates header immediately
    })
  );
}


  /** Logout user */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullname');
    localStorage.removeItem('email');
    this.loggedIn.next(false);
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  /** Get user role */
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Helper to check token existence */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Get current user profile */
  getProfile(): Observable<User> {
    const userId = localStorage.getItem('userId');
    return this.http.get<User>(`${this.apiUrl}/profile/${userId}`);
  }

  /** Update user profile */
  updateProfile(updatedUser: Partial<User>): Observable<User> {
    const userId = localStorage.getItem('userId');
    return this.http.put<User>(`${this.apiUrl}/profile/${userId}`, updatedUser);
  }

  /** Get all users */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAll`);
  }

  /** Update a user */
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, userData);
  }

  /** Add a new user */
  addUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, userData);
  }
   /** Delete a user */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
