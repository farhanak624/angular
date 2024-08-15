import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/services/api.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  users: any[] = [];
  firstname: string = '';
  lastname: string = '';
  case_no: string = '';
  constructor(private apiService: ApiService) {}

  search() {
    this.apiService
      .searchUsers(this.firstname, this.lastname, this.case_no)
      .pipe(
        tap((response) => {
          console.log('res', response);
          this.users = response;
          console.log('Search successful', response);
        }),
        catchError((error) => {
          console.error('Search failed', error);
          return (this.users = []);
        })
      )
      .subscribe();
  }
  clear(){
    this.users = [];
    this.firstname = '';
    this.lastname = '';
    this.case_no = '';
  }
}
