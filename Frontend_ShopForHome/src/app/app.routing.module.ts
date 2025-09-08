import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/account/login/login';
import { RegisterComponent } from './pages/account/register/register';
import { ProductListComponent } from './pages/products/product-list/product-list';
import { ProductDetailsComponent } from './pages/product-details/product-details';
import { WishlistItemsComponent } from './pages/wishlist/wishlist-items/wishlist-items';
import { OrderHistoryComponent } from './pages/orders/order-history/order-history';
import { UserManagementComponent } from './pages/admin/user-management/user-management';
import { ProductManagementComponent } from './pages/admin/product-management/product-management';
import { StockAlertsComponent } from './pages/admin/stock-alerts/stock-alerts';
import { AboutComponent } from './pages/about/about';
import { CartComponent } from './pages/cart/cart';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  //{ path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistItemsComponent },
  //{ path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderHistoryComponent },
  //{ path: 'admin', component: DashboardComponent },
  { path: 'admin/users', component: UserManagementComponent },
  { path: 'admin/products', component: ProductManagementComponent },
  { path: 'admin/stock', component: StockAlertsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
