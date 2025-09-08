import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  imports: [ FormsModule , CommonModule , ReactiveFormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  editMode = false;
  selectedUserId: number | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  get f() { return this.userForm.controls; }

 loadUsers() {
  this.accountService.getAllUsers().subscribe({
    next: (res: any) => {
      // Map API response to your User model
      this.users = res.map((u: any) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        password: u.password,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }));
    },
    error: (err: any) => this.errorMessage = 'Failed to load users.'
  });
}



  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) return;

    const userData: Partial<User> = {
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      password: this.userForm.value.password
    };

    if (this.editMode && this.selectedUserId) {
      this.accountService.updateUser(this.selectedUserId, userData).subscribe({
        next: () => {
          this.successMessage = 'User updated successfully!';
          this.loadUsers();
          this.userForm.reset();
          this.editMode = false;
          this.selectedUserId = null;
        },
        error: () => this.errorMessage = 'Failed to update user.'
      });
    } else {
      this.accountService.addUser(userData).subscribe({
        next: () => {
          this.successMessage = 'User added successfully!';
          this.loadUsers();
          this.userForm.reset();
        },
        error: () => this.errorMessage = 'Failed to add user.'
      });
    }
  }

  editUser(user: User) {
    this.editMode = true;
    this.selectedUserId = user.id;
this.userForm.patchValue({
  fullName: user.fullName,
  email: user.email
});
  }

  cancelEdit() {
  this.editMode = false;
  this.selectedUserId = null;
  this.userForm.reset();
  this.submitted = false;
}

deleteUser(userId: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.accountService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.successMessage = 'User deleted successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to delete user.';
      }
    });
  }
}
}
