import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRideBase } from 'src/app/shared/interfaces/i-ride';
import { IShiftRideCar } from 'src/app/shared/interfaces/i-shift';
import { IUserShiftRide } from 'src/app/shared/interfaces/i-user';
import { AuthService } from 'src/app/shared/services/auth.services';
import { RideService } from 'src/app/shared/services/rideServices/ride.service';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';
import { GetUserServices } from 'src/app/shared/services/userServices/getUser.services';

@Component({
  selector: 'app-user',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})

export class ProfileComponent implements OnInit {
  form: FormGroup;
  user: IUserShiftRide;
  shifts: IShiftRideCar[] = [];
  rides: IRideBase[] = [];

  constructor(
    public userService: GetUserServices,
    public authService: AuthService,
    public shiftService: ShiftService,
    public rideService: RideService,
    private fb: FormBuilder,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadUser()
    this.initializeForm();
  }

  public initializeForm(): void {
    this.form = this.fb.group({
      firstName: [{ value: null, disabled: true }, [Validators.required]],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
    })
  }

  get sForm() {
    return this.form.controls;
  }
  loadUser() {
    let id = this.authService.tokenPars.Id;
    this.userService.get(id).subscribe({
      next: res => {
        this.user = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.sForm.firstName.setValue(this.user.firstName);
        this.sForm.lastName.setValue(this.user.lastName);
        this.getUserShifts(this.user.id);
      }
    });
  }

  getUserShifts(id: number): void {
    this.shiftService.custom("find-user-shifts",id).subscribe({
      next: (res: any) => {
        this.shifts = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        if(this.shifts != null){
          this.shifts.forEach((element, index) => {
            this.getShiftRides(element.id, index);
          });
        }
        this.user.shifts = this.shifts;
      }
    });
  }
  getShiftRides(shiftId: number, index: number) : any{
    this.rideService.custom("findShiftRides", shiftId).subscribe({
      next: (res: any) => {
        if (res != null) {
          this.rides = res;
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.shifts[index].rides = this.rides;
      }
    });
  }

}
