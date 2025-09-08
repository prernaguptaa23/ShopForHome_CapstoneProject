import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  get f() { return this.profileForm.controls; }

  loadUser() {
    this.accountService.getProfile().subscribe({
      next: (apiUser) => {
        // map API user to your frontend User model
        this.user = {
          id: apiUser.id,
          fullName: apiUser.fullName,  // map name -> fullname
          email: apiUser.email,
          role: apiUser.role,
          createdAt: '',           // optional if API doesn’t send
          updatedAt: ''
        };
        this.profileForm.patchValue({
          fullName: this.user.fullName,
          email: this.user.email
        });
      },
      error: (err: any) => this.errorMessage = 'Failed to load profile.'
    });
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) return;

    const updatedUser: Partial<User> = {
      fullName: this.profileForm.value.fullName,
      password: this.profileForm.value.password ? this.profileForm.value.password : undefined
    };

    this.accountService.updateProfile(updatedUser).subscribe({
      next: (res: any) => this.successMessage = 'Profile updated successfully!',
      error: (err: any) => this.errorMessage = 'Failed to update profile.'
    });
  }
}