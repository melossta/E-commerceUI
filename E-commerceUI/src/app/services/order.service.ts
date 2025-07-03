// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment/environment.component';

// export interface Order {
//   orderId: number;
//   userId: number;
//   orderDate: string;
//   totalAmount: number;
//   status: string;
//   shippingDetailsId: number;
//   items?: OrderItem[];
// }

// export interface OrderItem {
//   productId: number;
//   productName?: string;
//   quantity: number;
//   unitPrice: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private apiUrl = `${environment.apiUrl}/orders`;

//   constructor(private http: HttpClient) {}

//   // 🛒 Place single product order (using request body)
//   placeSingleProductOrder(
//     productId: number,
//     quantity: number,
//     shippingDetailsId: number
//   ): Observable<Order> {
//     const body = { productId, quantity, shippingDetailsId };
//     return this.http.post<Order>(`${this.apiUrl}/place-single`, body);
//   }

//   // 📦 Place full cart order (only needs shipping ID)
//   placeCartOrder(shippingDetailsId: number): Observable<Order> {
//     return this.http.post<Order>(`${this.apiUrl}/place-order`, { shippingDetailsId });
//   }

//   // 👤 Get orders for logged-in user
//   getUserOrders(): Observable<Order[]> {
//     return this.http.get<Order[]>(`${this.apiUrl}/user`);
//   }

//   // 📄 Get specific order by ID
//   getOrderById(orderId: number): Observable<Order> {
//     return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment/environment.component';
import { Order,SingleOrder } from '../interfaces/order.interface'; // Assuming you have this interface defined




@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  placeCartOrder(shippingDetailsId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/place-order`, { shippingDetailsId });
  }


  // placeSingleProductOrder(productId: number, quantity: number, shippingDetailsId: number): Observable<Order> {
  //   return this.http.post<Order>(`${this.apiUrl}/place-single`, { productId, quantity, shippingDetailsId });
  // }
      placeSingleProductOrder(singleOrderData: SingleOrder): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/place-single`, singleOrderData);
    }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  getOrdersByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${orderId}/status`, status);
  }
}
