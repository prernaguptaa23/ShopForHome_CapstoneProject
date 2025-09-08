import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../../models/cart.model';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  templateUrl: './cart-items.html',
  styleUrls: ['./cart-items.css'],
  imports: [CurrencyPipe, CommonModule,]
})
export class CartItemsComponent {
  @Input() items: CartItem[] = [];
  @Output() updateItem = new EventEmitter<CartItem>();
  @Output() removeItem = new EventEmitter<number>();

  increaseQuantity(item: CartItem) {
    item.quantity += 1;
    this.updateItem.emit(item);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateItem.emit(item);
    }
  }

  removeFromCart(itemId: number) {
    this.removeItem.emit(itemId);
  }

  onUpdate(item: CartItem, newQuantity: number) {
  if (newQuantity > 0) {
    this.updateItem.emit({ ...item, quantity: newQuantity });
  }
}


  onRemove(itemId: number) {
    this.removeItem.emit(itemId);
  }
}
