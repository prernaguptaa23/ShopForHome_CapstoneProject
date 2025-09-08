import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService, User } from '../../../core/services/account';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  // Getter for easy access to form controls
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const formData = this.registerForm.value;

    this.accountService.register(formData).subscribe({
      next: (response: any) => {
        console.log('Registration success', response);

        // Create user object
        const newUser: User = {
          id: response.userId,
          fullName: formData.fullName,
          email: formData.email,
          role: response.role
        };

        // Save in localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('token', response.token);  // If your API returns token
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId.toString());

        // ✅ Update the service BehaviorSubject so header updates
        this.accountService.setCurrentUser(newUser);

        // Navigate to home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}
