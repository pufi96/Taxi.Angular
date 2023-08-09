import { Component, Input, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRideBase } from 'src/app/shared/interfaces/i-ride';
import { IShiftRideCar } from 'src/app/shared/interfaces/i-shift';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DebtorServices } from 'src/app/shared/services/debtorServices/debtor.service';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';
import { GetUserServices } from 'src/app/shared/services/userServices/getUser.services';

@Component({
  selector: 'app-ride-table',
  templateUrl: './ride-table.component.html',
  styleUrls: ['./ride-table.component.scss']
})
export class RideTableComponent implements OnInit {

  @Input() shift: IShiftRideCar;
  turnover: number = 0;
  expenses: number = 0;
  earnings: number = 0;
  uEarnings: number = 0;
  rides: IRideBase[] = [];
  isShiftStarted: boolean = false;
  firstName: string;

  first = 0;

  rows = 10;

  constructor(
    public shiftService: ShiftService,
    public authService: AuthService,
    public router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public userService: GetUserServices,
    public debtorService: DebtorServices
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser(): void {
    let id = this.authService.tokenPars.Id;
    this.userService.get(id).subscribe({
      next: res => {
        this.firstName = res.firstName;
        this.uEarnings = res.earnings;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.shift = this.config.data;
        this.rides = this.shift.rides;
        this.rides.forEach((r, index) => {
          if(r.debtorId != null){
            if(r.debtorId != 0){
              this.getDebtor(r);
            }
          }
          r.index = index + 1;
        });
        this.turnover += this.shift.turnover;
        this.earnings += this.shift.earnings;
        this.expenses += this.shift.expenses;
      }
    });
  }

  getDebtor(ride: IRideBase) {
    this.debtorService.get(ride.debtorId).subscribe({
      next: (res: any) => {
        ride.debtor = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        ride.debtor.debtorFullName = ride.debtor.debtorFirstName +  " " + ride.debtor.debtorLastName;
      }
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.shift ? this.first === this.rides.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.shift ? this.first === 0 : true;
  }
}
