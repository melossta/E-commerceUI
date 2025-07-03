import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { OrderService } from '../../services/order.service';
import { ShippingDetailsService } from '../../services/shipping-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Order, SingleOrder } from '../../interfaces/order.interface';
import { AuthService } from '../../services/auth-service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class ProductDetailComponent implements OnInit {
  userId: number | null = null;

  product: any;
  quantity = 1;
  shippingDetails: any[] = [];
  orderResult: Order | null = null;
  selectedShippingId: number | null = null;
  isLoading = false;
quantities: { [key: number]: number } = {};
  singleOrder: SingleOrder = {
  productId: null,
  quantity: 1,
  shippingDetailsId: null
  
};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private orderService: OrderService,
    private shippingDetailsService: ShippingDetailsService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}

ngOnInit(): void {
  const productIdStr = this.route.snapshot.paramMap.get('id');
  const productId = productIdStr ? +productIdStr : null;

  if (productId !== null) {
    this.loadProduct(productId);
    this.singleOrder.productId = productId;
  } else {
    console.error('No product ID found in route.');
  }

  // Load shipping details as before
  const userIdStr = localStorage.getItem('userId');
  this.userId = userIdStr ? +userIdStr : null;

  if (this.userId !== null) {
    this.loadShippingDetailsByUserId(this.userId);
  } else {
    alert('User not logged in.');
  }
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

  loadProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => this.product = product,
      error: (err) => console.error('Product not found:', err)
    });
  }

placeSingleOrder(): void {
  // Assign the selected shipping id from radio group to singleOrder
  this.singleOrder.shippingDetailsId = this.selectedShippingId;

  if (!this.singleOrder.productId || !this.singleOrder.shippingDetailsId || this.singleOrder.quantity < 1) {
    alert('Please select a product, shipping address, and a valid quantity.');
    return;
  }

  this.isLoading = true;

  this.orderService.placeSingleProductOrder(this.singleOrder).subscribe({
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
resetSingleOrderForm(): void {
  this.singleOrder = {
    productId: null,
    quantity: 1,
    shippingDetailsId: null
  };
}
// addToCart(productId: number) {
//     const quantity = this.quantities[productId];
//     if (!quantity || quantity <= 0) {
//       alert('Quantity must be greater than zero.');
//       return;
//     }

//     this.shoppingCartService.addToCart(productId, quantity).subscribe({
//       next: () => {
//         alert(`Added product ${productId} with quantity ${quantity} to cart.`);
//       },
//       error: (err) => {
//         alert('Error adding product to cart.');
//         console.error(err);
//       }
//     });
//   }
addToCart() {
  if (!this.singleOrder.productId) {
    alert('Product ID is missing.');
    return;
  }
  
  if (!this.quantity || this.quantity <= 0) {
    alert('Quantity must be greater than zero.');
    return;
  }

  this.shoppingCartService.addToCart(this.singleOrder.productId, this.quantity).subscribe({
    next: () => {
      alert(`Added product ${this.singleOrder.productId} with quantity ${this.quantity} to cart.`);
    },
    error: (err) => {
      alert('Error adding product to cart.');
      console.error(err);
    }
  });
}

  goToProductList() {
    window.location.href = '/product-list';
  }


}
