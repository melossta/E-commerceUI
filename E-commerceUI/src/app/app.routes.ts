import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./components/auth/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/auth/register/register.component').then(
                (m) => m.RegisterComponent
            ),
    },
    {
        path: 'admin-dashboard',
        loadComponent: () =>
            import('./components/admin-dashboard/admin-dashboard.component').then(
                (m) => m.AdminDashboardComponent
            ),
    },
    {
        path: 'categories',
        loadComponent: () =>
            import('./components/categories/categories.component').then(
                (m) => m.CategoryComponent
            ),
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./components/products.component/products.component').then(
                (m) => m.ProductsComponent
            ),
    },
    {
        path: 'shipping-details',
        loadComponent: () =>
            import('./components/shipping-details.component/shipping-details.component').then(
                (m) => m.ShippingDetailsComponent
            ),
    },
    {
        path: 'shopping-cart',
        loadComponent: () =>
            import('./components/shopping-cart.component/shopping-cart.component').then(
                (m) => m.ShoppingCartComponent
            ),
    },
        {
        path: 'authentication',
        loadComponent: () =>
            import('./components/auth/auth.component').then(
                (m) => m.AuthComponent
            ),
    },
            {
        path: 'order',
        loadComponent: () =>
            import('./components/order.component/order.component').then(
                (m) => m.OrderComponent
            ),
    },
                {
        path: 'product-list',
        loadComponent: () =>
            import('./components/product-list.component/product-list.component').then(
                (m) => m.ProductListComponent
            ),
    },
    {
        path: 'product/:id',
        loadComponent: () =>
            import('./components/product-detail.component/product-detail.component').then(m => m.ProductDetailComponent)
    },

    { path: '', redirectTo: '/authentication',pathMatch: 'full' },
];
