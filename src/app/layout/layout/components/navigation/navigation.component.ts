import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { NAV } from 'src/app/constants/nav';
import { AuthService } from 'src/app/shared/services/auth.services';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {
  isShiftStarted;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  isStarted: boolean = false;
  resShift: any;

  constructor(
    public authService: AuthService,
    public shiftService: ShiftService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.items = [];
    if (this.authService.tokenPars != null) {
      this.checkShift();
    }
  }

  checkShift(): void {
    this.shiftService.custom("find-unfinished", this.authService.tokenPars.Id).subscribe({
      next: (res: any) => {
        this.resShift = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.items = NAV;
        if (this.resShift != null) {
          if (this.resShift.shiftEnd.toLocaleDateString == null) {
            this.items.shift();
            this.items.unshift(
              {
                label: 'End',
                routerLink: 'shift/end',
                routerLinkActiveOptions: { exact: true }
              });
          }
        } else {
          this.items.shift();
          this.items.unshift(
            {
              label: 'Start',
              routerLink: 'shift/start',
              routerLinkActiveOptions: { exact: true }
            })
        }
      }
    });
  }
}