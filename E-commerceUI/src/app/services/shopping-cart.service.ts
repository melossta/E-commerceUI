import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment/environment.component';

export interface CartItem {
  cartItemId: number;
  productId: number;
  quantity: number;
  productName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = `${environment.apiUrl}/shopping-cart`;

  constructor(private http: HttpClient) { }

  getCartByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }


addToCart(productId: number, quantity: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/add`, { productId, quantity });
}


  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`);
  }   

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }
}
