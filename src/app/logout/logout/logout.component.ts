import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(
    private logoutService: AuthService,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.logoutService.deleteToken();
    this.router.navigateByUrl("/login");
  }
}
