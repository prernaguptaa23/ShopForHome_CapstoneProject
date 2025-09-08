import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, User } from '../../../core/services/account';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = ''; 
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    const formData = this.loginForm.value;
    this.loading = true;

    // Only login, no creation
    this.accountService.login(formData).subscribe({
      next: (res: any) => {
        console.log('Login success', res);

        // Build user object
        const loggedInUser: User = {
          id: res.userId,
          fullName: res.fullName || '', // fetched from backend if available
          email: res.email,
          role: res.role
        };

        // Save in localStorage
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());

        // Update BehaviorSubject for header
        this.accountService.setCurrentUser(loggedInUser);

        // Navigate to home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
  
}
