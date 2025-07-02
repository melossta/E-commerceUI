// import { Component, OnInit } from '@angular/core';
// import { OrderService, Order } from '../../services/order.service';
// import { ShippingDetailsService, ShippingDetails } from '../../services/shipping-details.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatListModule } from '@angular/material/list';
// import { AuthService } from '../../services/auth-service';
// @Component({
//   selector: 'app-order',
//   templateUrl: './order.component.html',
//   imports: [
//     FormsModule,
//     CommonModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatListModule
//   ],  
//   styleUrls: ['./order.component.scss']
// })
// export class OrderComponent implements OnInit {
//   shippingDetails: ShippingDetails[] = [];
//   selectedShippingId: number | null = null;
//   orderResult: Order | null = null;
//   isLoading = false;

//   constructor(
//     private orderService: OrderService,
//     private shippingDetailsService: ShippingDetailsService, 
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
    
//   }

//   loadShippingDetails(): void {
//     this.shippingDetailsService.getAllShippingDetails().subscribe({
//       next: (data) => {
//         this.shippingDetails = data;
//       },
//       error: (err) => {
//         console.error('Error loading shipping details:', err);
//       }
//     });
//   }

//   placeOrder(): void {
//     if (!this.selectedShippingId) {
//       alert('Please select a shipping address before placing the order.');
//       return;
//     }

//     this.isLoading = true;

//     this.orderService.placeCartOrder(this.selectedShippingId).subscribe({
//       next: (order) => {
//         this.orderResult = order;
//         alert('Order placed successfully!');
//         console.log('Order placed:', order);
//       },
//       error: (error) => {
//         console.error('Failed to place order:', error);
//         alert('Failed to place order. Please try again.');
//       },
//       complete: () => {
//         this.isLoading = false;
//       }
//     });
//   }
//     logout() {
//     this.authService.logout();
//     alert('You have been logged out.');
//   }
// }


import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';
import { ShippingDetailsService, ShippingDetails } from '../../services/shipping-details.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatListModule, MatButtonModule, MatRadioModule]
})
export class OrderComponent implements OnInit {
  userId: number | null = null;
  shippingDetails: ShippingDetails[] = [];
  selectedShippingId: number | null = null;
  orderResult: Order | null = null;
  isLoading = false;
  singleOrder = {
  productId: null,
  quantity: 1,
  shippingDetailsId: null
};

  constructor(
    private orderService: OrderService,
    private shippingDetailsService: ShippingDetailsService,
    private authService: AuthService
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


  logout(): void {
    this.authService.logout();
  }
}
