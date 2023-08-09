import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDebtorBase } from 'src/app/shared/interfaces/i-debrot';
import { IRideBase } from 'src/app/shared/interfaces/i-ride';
import { IShiftRideCar } from 'src/app/shared/interfaces/i-shift';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DebtorServices } from 'src/app/shared/services/debtorServices/debtor.service';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';

@Component({
  selector: 'app-current-ride-table',
  templateUrl: './current-ride-table.component.html',
  styleUrls: ['./current-ride-table.component.scss']
})
export class CurrentRideTableComponent implements OnInit {
  @Input() shift: IShiftRideCar;
  turnover: number = 0;
  expenses: number = 0;
  earnings: number = 0;
  debtor: IDebtorBase;
  rides: IRideBase[] = [];
  isShiftStarted: boolean = false;

  first = 0;

  rows = 10;

  constructor(
    public shiftService: ShiftService,
    public authService: AuthService,
    public router: Router,
    public debtorService: DebtorServices
  ) { }

  ngOnInit() {
    this.rides = this.shift.rides;
    if (this.rides != null) {
      this.rides.forEach((r, index) => {
        r.index = index + 1;
      });
    }
  }

  newData(newData: IShiftRideCar) {
    this.rides = newData.rides;
    if (this.rides != null) {
      this.rides.forEach((r, index) => {
        if (r.debtorId != null ) {
          if(r.debtorId != 0){
            this.getDebtor(r);
          }
        }
        r.index = index + 1;
      });
    }
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
