import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule} from '@angular/forms';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [NgClass, FormsModule],
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

  login(): void {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('role', response.roles[0]);
        this.router.navigate(['/categories']);
        alert('Logged in successfully');
      },
      error: () => alert('Invalid email or password.')
    });
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
