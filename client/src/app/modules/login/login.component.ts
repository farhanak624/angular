import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/services/api.service';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    console.log('Login Form Submitted');
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.apiService
      .login(this.email, this.password)
      .pipe(
        tap((response) => {
          console.log('Login successful', response);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.user.accessToken);
          return this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          console.error('Login failed', error);
          alert("Invalid Credentials");
          return this.router.navigate(['/login']);
        })
      )
      .subscribe();
  }
}
