import { Component, OnInit } from '@angular/core';
import { ShoppingCartService, CartItem } from '../../services/shopping-cart.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule]
})
export class ShoppingCartComponent implements OnInit {
  userId: number | null = null;
  productId: number | null = null;
  quantity: number | null = null;

  cartItems: CartItem[] = [];
  displayedColumns = ['productName', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<CartItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ShoppingCartService: ShoppingCartService , private authService: AuthService) { }

  ngOnInit(): void { }

  loadCart() {
    if (this.userId === null) {
      alert('Please enter a user ID.');
      return;
    }

    this.ShoppingCartService.getCartByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cartItems = cart.cartItems;
        this.dataSource.data = this.cartItems;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        alert('Error loading cart.');
        console.error(err);
      }
    });
  }

  // addToCart() {
  //   if (this.productId === null || this.quantity === null) {
  //     alert('All fields are required.');
  //     return;
  //   }

  //   this.ShoppingCartService.addToCart(this.productId, this.quantity).subscribe({
  //     next: () => {
  //       alert('Product added to cart.');
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       alert('Error adding product to cart.');
  //       console.error(err);
  //     }
  //   });
  // }
  addToCart() {
  if (this.productId === null || this.quantity === null || this.quantity <= 0) {
    alert('All fields are required and quantity must be greater than zero.');
    return;
  }

  this.ShoppingCartService.addToCart(this.productId, this.quantity).subscribe({
    next: () => {
      alert('Product added to cart.');
      this.loadCart();
    },
    error: (err) => {
      alert('Error adding product to cart.');
      console.error(err);
    }
  });
}


  removeFromCart(cartItemId: number) {
    if (!confirm('Are you sure you want to remove this item?')) return;

    this.ShoppingCartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        alert('Item removed from cart.');
        this.loadCart();
      },
      error: (err) => {
        alert('Error removing item from cart.');
        console.error(err);
      }
    });
  }

  clearCart() {
    if (this.userId === null) {
      alert('Please enter a user ID.');
      return;
    }

    if (!confirm('Are you sure you want to clear the cart?')) return;

    this.ShoppingCartService.clearCart(this.userId).subscribe({
      next: () => {
        alert('Cart cleared.');
        this.cartItems = [];
        this.dataSource.data = [];
      },
      error: (err) => {
        alert('Error clearing cart.');
        console.error(err);
      }
    });
  }
  logout() {
    this.authService.logout();
    alert('You have been logged out.');
  }
}
