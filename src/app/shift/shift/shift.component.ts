import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { apis } from 'src/app/constants/api';
import { CurrentRideTableComponent } from 'src/app/shared/components/ride/current-ride-table/current-ride-table.component';
import { IDebtorBase } from 'src/app/shared/interfaces/i-debrot';
import { ILocation } from 'src/app/shared/interfaces/i-location';
import { ILocationPrice } from 'src/app/shared/interfaces/i-locationPrice';
import { IRideBase } from 'src/app/shared/interfaces/i-ride';
import { IShiftRideCar } from 'src/app/shared/interfaces/i-shift';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DebtorServices } from 'src/app/shared/services/debtorServices/debtor.service';
import { LocationPriceServices } from 'src/app/shared/services/locationPriceService/locationPrice.service';
import { LocationServices } from 'src/app/shared/services/locationServices/location.services';
import { RideService } from 'src/app/shared/services/rideServices/ride.service';
import { ShiftRideFormService } from 'src/app/shared/services/shiftServices/shift-ride-form.service';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  @ViewChild('tabela') currentRideTableComponent: CurrentRideTableComponent;
  form: FormGroup;
  isLocal: boolean = false;
  locations: ILocation[];
  locationsFilter: ILocation[] = [];
  location: ILocation;
  locationPrices: ILocationPrice[];
  locationPricesFilter: ILocationPrice[] = [];
  locationPrice: ILocationPrice;
  locationPriceNameFiltered: string;
  isenableLocationPrice: boolean = false;
  isShiftStarted: boolean;
  shift: IShiftRideCar;
  rides: IRideBase[] = [];
  debtors: IDebtorBase[] = [];
  debtorsFilter: IDebtorBase[] = [];
  debtor: IDebtorBase;

  constructor(
    public formService: ShiftRideFormService,
    public authService: AuthService,
    public shiftService: ShiftService,
    public rideService: RideService,
    public locationService: LocationServices,
    public router: Router,
    public locationPriceService: LocationPriceServices,
    public debtorService: DebtorServices
  ) { }

  ngOnInit() {
    this.checkShift();
    this.formService.initializeForm();
    this.loadLocation();
    this.loadDebtors();
    this.enableLocationPrice(this.isenableLocationPrice);
    this.formService.sForm.ridePrice.disable();
    this.isItLocal();
  }

  isItLocal() {
    if (this.formService.sForm.isLocal.value == null) {
      this.isLocal = false
    } else {
      if (this.formService.sForm.isLocal.value[0] == "true") {
        this.isLocal = true
      } else {
        this.isLocal = false;
      }
    }
    if (this.isLocal) {
      this.enableRidePrice(this.isLocal);
      this.enableLocationPrice(!this.isLocal);
      this.enableLocation(!this.isLocal);
    } else {
      this.formService.initializeForm();
      this.enableLocationPrice(this.isLocal);
      this.enableRidePrice(this.isLocal);
      this.formService.sForm.location.setValidators([Validators.required]);
      this.formService.sForm.locationPrice.setValidators([Validators.required]);
    }
  }

  enableLocation(check: boolean) {
    if (check) {
      this.formService.sForm.location.enable();
    } else {
      this.formService.sForm.location.disable();
      this.formService.sForm.location.setValidators([Validators.required]);
    }
  }

  enableLocationPrice(check: boolean) {
    if (check) {
      this.formService.sForm.locationPrice.enable();
    } else {
      this.formService.sForm.locationPrice.disable();
      this.formService.sForm.locationPrice.setValidators([Validators.required]);

    }
  }

  enableRidePrice(check: boolean) {
    if (check) {
      this.formService.sForm.ridePrice.enable();
    } else {
      this.formService.sForm.ridePrice.disable();
    }
  }

  filterLocations(event): void {
    this.locationsFilter = this.locations.filter(x => x.locationName.toLowerCase().includes(event.query.toLowerCase()));
  }

  changeLocation(event) {
    this.location = this.formService.form.controls.location.value;
    this.enableLocationPrice(event);
    this.findFinishLocation(this.location.id);
  }

  filterLocationPrices(event): void {
    this.locationPricesFilter = this.locationPrices.filter(x =>
      x.locationStart == this.location.locationName ? x.locationPriceNameFiltered = x.locationEnd : x.locationPriceNameFiltered = x.locationStart
    );
  }

  changeLocationPrice(event) {
    this.locationPrice = this.formService.form.controls.locationPrice.value;
    this.formService.form.controls.ridePrice.setValue(this.locationPrice.price);
    this.enableRidePrice(event);
  }

  loadLocation(): ILocation[] {
    this.locationService.getAll().subscribe({
      next: res => {
        this.locations = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
      }
    });
    return this.locations;
  }

  filterDebtors(event): void {
    this.debtorsFilter = this.debtors.filter(x => x.debtorFirstName.toLowerCase().includes(event.query.toLowerCase()));
  }

  changeDebtors(event) {
    this.debtor = this.formService.form.controls.debtor.value;
  }

  loadDebtors(): IDebtorBase[] {
    this.debtorService.getAll().subscribe({
      next: res => {
        this.debtors = res;
        this.debtors.forEach(d => {
          d.debtorFullName = d.debtorFirstName + " " + d.debtorLastName
        });
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
      }
    });
    return this.debtors;
  }

  findFinishLocation(id: number) {
    this.locationPriceService.custom("find-finish", id).subscribe({
      next: (res: any) => {
        this.locationPrices = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
      }
    });
    return this.locationPrices;
  }

  checkShift(): void {
    this.shiftService.custom("find-unfinished", this.authService.tokenPars.Id).subscribe({
      next: (res: any) => {
        if (res != null) {
          if (res.shiftEnd.toLocaleDateString == null) {
            this.shift = res;
            this.isShiftStarted = true;
          } else {
            this.isShiftStarted = false;
          }
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        if (!this.isShiftStarted) {
          this.router.navigateByUrl("/shift/" + apis.shift.start);
        } else {
          this.getShiftRides(this.shift.id);
        }
      }
    });
  }
  getShiftRides(shiftId: number) {
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
        this.shift.rides = this.rides;
        this.currentRideTableComponent.newData(this.shift);
      }
    });
  }

  clearDebtor() {
    this.formService.sForm.debtor.setValue(null);
  }

  async addRide() {
    if (this.formService.form.valid) {
      this.formService.submit();
      this.checkShift();
      this.formService.initializeForm();
      this.isLocal = false;
      this.enableLocationPrice(false);
      this.enableRidePrice(false);
    }
  }
}
