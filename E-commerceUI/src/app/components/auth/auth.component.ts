import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [NgClass, FormsModule, MatFormFieldModule, MatSelectModule],
  standalone: true
})
export class AuthComponent {
  isLogin = true;

  // Login credentials
  loginEmail = '';
  loginPassword = '';

  // Register credentials
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerRole = 'customer';

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm(): void {
    this.isLogin = !this.isLogin;
  }

  // login(): void {
  //   this.authService.login(this.loginEmail, this.loginPassword).subscribe({
  //     next: (response) => {
  //       localStorage.setItem('authToken', response.token);
  //       localStorage.setItem('role', response.roles[0]);
  //       this.router.navigate(['/categories']);
  //       alert('Logged in successfully');
  //     },
  //     error: () => alert('Invalid email or password.')
  //   });
  // }
    login(): void {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe(
      (response) => {
        const token = response.token;
        const role = response.roles[0]; 
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role); // Save userId as a string    

        this.authService.decodeToken();
        alert(`Successfully logged in as ${role}.`);
        this.router.navigate(['/categories']); // Redirect to home page or dashboard
      },
      (error) => {
        
        // this.errorMessage = 'Invalid email or password. Please try again.';
        alert('Invalid email or password. Please try again.')
      }
    );
  }

  register(): void {
    this.authService.register(
      this.registerName,
      this.registerPassword,
      this.registerRole,
      this.registerEmail
    ).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.toggleForm();
      },
      error: () => alert('Registration failed.')
    });
  }
}
