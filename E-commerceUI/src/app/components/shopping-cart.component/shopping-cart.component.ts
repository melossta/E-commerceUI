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
import { ProductsService,Product} from '../../services/products.service';

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
  
  products: Product[] = [];
  showProducts = false;
  quantities: { [key: number]: number } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private shoppingCartService: ShoppingCartService , private authService: AuthService , private productsService: ProductsService) { }

  ngOnInit(): void { }

  // loadCart() {
  //   if (this.userId === null) {
  //     alert('Please enter a user ID.');
  //     return;
  //   }
  //   if (this.userId)

  //   this.shoppingCartService.getCartByUserId(this.userId).subscribe({
  //     next: (cart) => {
  //       this.cartItems = cart.cartItems;
  //       this.dataSource.data = this.cartItems;
  //       this.dataSource.paginator = this.paginator;
  //     },
  //     error: (err) => {
  //       alert('Error loading cart.');
  //       console.error(err);
  //     }
  //   });
  // }
  loadCart() {
  if (this.userId === null || this.userId === undefined) {
    alert('Please enter a user ID.');
    return;
  }

  this.shoppingCartService.getCartByUserId(this.userId).subscribe({
    next: (cart) => {
      this.cartItems = cart.cartItems;
      this.dataSource.data = this.cartItems;
      this.dataSource.paginator = this.paginator;
    },
    error: (err) => {
      if (err.status === 404) {
        alert(err.error); // this will show "User not found" or "Cart not found"
      } else {
        alert('An unexpected error occurred.');
      }
      console.error(err);
    }
  });
}

toggleShowProducts() {
    this.showProducts = !this.showProducts;

    if (this.showProducts && this.products.length === 0) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        // Initialize all quantities to 1
        this.products.forEach(p => this.quantities[p.productId] = 1);
      },
      error: (err) => {
        alert('Error loading products');
        console.error(err);
      }
    });
  }

  addToCart(productId: number) {
    const quantity = this.quantities[productId];
    if (!quantity || quantity <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }

    this.shoppingCartService.addToCart(productId, quantity).subscribe({
      next: () => {
        alert(`Added product ${productId} with quantity ${quantity} to cart.`);
      },
      error: (err) => {
        alert('Error adding product to cart.');
        console.error(err);
      }
    });
  }
  


  removeFromCart(cartItemId: number) {
    if (!confirm('Are you sure you want to remove this item?')) return;

    this.shoppingCartService.removeFromCart(cartItemId).subscribe({
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

    this.shoppingCartService.clearCart(this.userId).subscribe({
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
    goToOrder() {
    window.location.href = '/order'; // Redirect to order page
  }
}
