import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.services';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';
import { NavigationComponent } from './components/navigation/navigation.component';

var isLoggedIn: boolean = false;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {

  constructor( 
    public authService: AuthService,
    public shiftApi: ShiftService
  ) { }

  static setLog(value: boolean): void {
    isLoggedIn = value;
  }

  getLog(): boolean {
    return isLoggedIn;
  }
}
