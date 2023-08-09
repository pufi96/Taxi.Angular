import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.services';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IUserShiftRide } from '../../interfaces/i-user';
import { IShiftRideCar } from '../../interfaces/i-shift';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RideTableComponent } from '../ride/ride-table/ride-table.component';
import { Table } from 'primeng/table';
import { RideService } from '../../services/rideServices/ride.service';
import { IRideBase } from '../../interfaces/i-ride';
import { DebtorServices } from '../../services/debtorServices/debtor.service';


@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class ShiftTableComponent implements OnInit {

  @Input() user: IUserShiftRide;
  @Input() shifts: IShiftRideCar[];
  @ViewChild('shiftTable') shiftTable: Table;

  isShiftStarted: boolean = false;
  ref: DynamicDialogRef | undefined;
  shift: IShiftRideCar;
  rides: IRideBase[] = [];
  shiftStart: Date;
  shiftEnd: Date;
  turnover: number = 0;
  expenses: number = 0;
  earnings: number = 0;

  filtered: any;
  startDateFilter: Date;

  first = 0;
  rows = 10;

  constructor(
    public shiftService: ShiftService,
    public authService: AuthService,
    public router: Router,
    public messageService: MessageService,
    public dialogService: DialogService,
    public rideService: RideService,
    public debtorService: DebtorServices
  ) { }

  ngOnInit() {
  }

  applyFilters() {
    this.turnover = 0;
    this.expenses = 0;
    this.earnings = 0;
    if (this.shiftTable.filteredValue) {
      this.shiftTable.filteredValue.forEach((s,index) => {
        this.turnover += s.turnover;
        this.earnings += s.earnings;
        this.expenses += s.expenses;
        s.index = index + 1;
        s.shiftStart = new Date(s.shiftStart);
        s.shiftEnd = new Date(s.shiftEnd);
      });
    } else {
      this.shifts.forEach((s,index) => {
        this.turnover += s.turnover;
        this.earnings += s.earnings;
        this.expenses += s.expenses;
        s.index = index + 1;
        s.shiftStart = new Date(s.shiftStart);
        s.shiftEnd = new Date(s.shiftEnd);
      });
    }
  }

  show(int: number) {
    this.shiftService.get(int).subscribe({
      next: (res: any) => {
        if (res != null) {
          if (res.shiftEnd.toLocaleDateString == null) {
            this.shift = res;
          }
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.getShiftRides(this.shift.id);
        this.ref = this.dialogService.open(RideTableComponent, {
          header: 'Rides in shift',
          width: '70%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          data: this.shift
        });
      }
    });
  }

  getShiftRides(shiftId: number){
    this.rideService.custom("findShiftRides", shiftId).subscribe({
      next: (res: any) => {
        if (res != null) {
          this.rides = res;
          this.rides.forEach(r => {
            if (r.debtorId != null || r.debtorId == 0) {
              this.getDebtor(r);
            }
          });
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.shift.rides = this.rides;
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
    return this.user ? this.first === this.shifts.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.user ? this.first === 0 : true;
  }
}
