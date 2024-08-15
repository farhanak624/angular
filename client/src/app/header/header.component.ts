import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { LogoutDialogComponent } from '../components/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  openLogOutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logOut();
      }
    });
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
