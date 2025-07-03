import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { OrderService} from '../../services/order.service';
import { ShippingDetailsService, ShippingDetails } from '../../services/shipping-details.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { ProductsService } from '../../services/products.service';
import { Order, SingleOrder } from '../../interfaces/order.interface';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatListModule
  ],
})
export class OrderComponent implements OnInit {
  userId: number | null = null;
  shippingDetails: ShippingDetails[] = [];
  selectedShippingId: number | null = null;
  orderResult: Order | null = null;
  isLoading = false;
  products: any[] = []; // Holds all products

  singleOrder: SingleOrder = {
    productId: null,
    quantity: 1,
    shippingDetailsId: null
  };

  constructor(
    private orderService: OrderService,
    private shippingDetailsService: ShippingDetailsService,
    private authService: AuthService,
    private productsService: ProductsService 
  ) { }

  ngOnInit(): void {
    // Get userId from localStorage (set during decodeToken)
    const userIdStr = localStorage.getItem('userId');
    this.userId = userIdStr ? +userIdStr : null;

    if (!this.userId) {
      alert('User not logged in. Please login first.');
      return;
    }

    // Load shipping details for this user only
    this.loadShippingDetailsByUserId(this.userId);
    this.loadProducts(); // <-- Load product list
  }

  loadShippingDetailsByUserId(userId: number): void {
    this.shippingDetailsService.getShippingDetailsByUserId(userId).subscribe({
      next: (details) => {
        this.shippingDetails = details;
      },
      error: (err) => {
        console.error('Error loading shipping details:', err);
        alert('Failed to load shipping addresses.');
      }
    });
  }
    loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        alert('Could not load products.');
      }
    });
  }

placeOrder(): void {
  if (!this.selectedShippingId) {
    alert('Please select a shipping address.');
    return;
  }

  console.log('Placing order for userId:', this.userId, 'with shippingDetailsId:', this.selectedShippingId);

  this.isLoading = true;

  this.orderService.placeCartOrder(this.selectedShippingId).subscribe({
    next: (order) => {
      this.orderResult = order;
      alert('Order placed successfully!');
    },
    error: (err) => {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
  placeSingleOrder(): void {
    if (!this.singleOrder.productId || !this.singleOrder.shippingDetailsId || this.singleOrder.quantity < 1) {
      alert('Please select a product, shipping address, and a valid quantity.');
      return;
    }

    this.isLoading = true;
    this.orderService.placeSingleProductOrder(this.singleOrder)
      .subscribe({
        next: (order) => {
          this.orderResult = order;
          alert('Single product order placed successfully!');
          this.resetSingleOrderForm();
        },
        error: (err) => {
          console.error('Error placing single order:', err);
          alert('Failed to place single order. Try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private resetSingleOrderForm(): void {
    this.singleOrder = {
      productId: null,
      quantity: 1,
      shippingDetailsId: null
    };
  }


  logout(): void {
    this.authService.logout();
  }
}
