import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
getPrimaryImageUrl(images: any[]): string {
  if (!images || images.length === 0) return '';
  const primary = images.find(img => img.isPrimary);
  return primary ? primary.imageUrl : images[0].imageUrl;
}


}
