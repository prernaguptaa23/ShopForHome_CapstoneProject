import { Component, OnInit } from '@angular/core';
import { AccountService , User} from '../../../core/services/account';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [CommonModule, RouterModule, FormsModule,]
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  cartCount: number = 0;
  wishlistCount: number = 0;
  categories: string[] = ['Furniture', 'Decor', 'Lighting'];
  loginData = { email: '', password: '' };
  registerData = { fullName: '', email: '', password: '' };

  constructor(
    private accountService: AccountService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count; // ✅ update live
    });
  // Subscribe to currentUser so header updates immediately
  this.accountService.currentUser.subscribe(user => {
        console.log('Header currentUser:', user);  // <-- add this
    this.currentUser = user;
  });
      this.cartService.updateCartCount();
  this.wishlistService.wishlistCount.subscribe(count => this.wishlistCount = count);

  // wishlist sync
  this.wishlistService.wishlistCount.subscribe(count => this.wishlistCount = count);

  // 🔑 ensure wishlist loads at app start
  this.wishlistService.getWishlist().subscribe();
}

  login() {
  this.accountService.login({
  email: this.loginData.email,
  password: this.loginData.password
}).subscribe({
  next: (res: any) => {
    // Map backend response properly
    const loggedInUser: User = {
      id: res.userId,
      fullName: res.fullName,  // match User interface
      email: res.email,
      role: res.role,
      createdAt: '', // optional
  updatedAt: ''  // optional
    };

    // Update BehaviorSubject so header updates immediately
    this.accountService.setCurrentUser(loggedInUser);

    // Save in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    localStorage.setItem('token', res.token);

    alert('Login successful');
    this.router.navigate(['/']);  // redirect home
  },
  error: err => alert(err.error || 'Login failed')
});

}



register() {
  this.accountService.register({
    fullName: this.registerData.fullName,
    email: this.registerData.email,
    password: this.registerData.password
  }).subscribe({
    next: (res: any) => {
      const newUser: User = {
        id: res.userId,
        fullName: this.registerData.fullName,
        email: this.registerData.email,
        role: res.role
      };

      // ✅ Update service to notify header
      this.accountService.setCurrentUser(newUser);

      alert('Registration successful. You are now logged in!');
      this.registerData = { fullName: '', email: '', password: '' };
      this.router.navigate(['/']);  // redirect to home
    },
    error: err => alert(err.error || 'Registration failed')
  });
}

logout() {
  localStorage.removeItem('currentUser');
  this.currentUser = null;
  this.router.navigate(['/']);
}


  searchProducts(query: string) {
    if (query && query.trim() !== '') {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }

  checkLogin(action: 'cart' | 'wishlist') {
    if (!this.currentUser) {
      alert('Please login or register first!');
      this.router.navigate(['/account/login']);
    } else {
      this.router.navigate([`/${action}`]);
    }
  }
}
