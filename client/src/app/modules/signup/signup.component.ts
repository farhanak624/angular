import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/services/api.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) {}
  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('firstName:', this.firstname);
    console.log('lastname:', this.lastname);
    console.log('Username:', this.username);
    this.apiService
      .signup(
        this.firstname,
        this.lastname,
        this.email,
        this.username,
        this.password
      )
      .pipe(
        tap((response) => {
          console.log('Signup successful', response);
          return this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error('Signup failed', error);
          return this.router.navigate(['/signup']);
        })
      )
      .subscribe();
  }
}
