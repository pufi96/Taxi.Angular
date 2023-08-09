import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { apis } from 'src/app/constants/api';
import { ICarBase } from 'src/app/shared/interfaces/i-car';
import { IShiftCreate, IShiftRideCar, IShiftUpdate } from 'src/app/shared/interfaces/i-shift';
import { IUserBase } from 'src/app/shared/interfaces/i-user';
import { AuthService } from 'src/app/shared/services/auth.services';
import { GetCarsServices } from 'src/app/shared/services/carServices/getCars.services';
import { ShiftService } from 'src/app/shared/services/shiftServices/shift.service';
import { GetUserServices } from 'src/app/shared/services/userServices/getUser.services';

@Component({
  selector: 'app-shift-start-end',
  templateUrl: './shift-start-end.component.html',
  styleUrls: ['./shift-start-end.component.scss'],
  providers: [MessageService]
})

export class ShiftStartEndComponent implements OnInit {

  message: string;
  messageColorClass: string;
  form: FormGroup;
  flag: any;
  user: IUserBase;
  carsFilter: ICarBase[] = [];
  cars: ICarBase[];
  car: ICarBase;
  isShiftStarted: boolean;
  button: string = "Start";
  mileageStart: number = 0;
  shift: IShiftRideCar;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: GetCarsServices,
    private userService: GetUserServices,
    public shiftService: ShiftService,
    public messageService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: param => {
        this.flag = param.get('flag');
      }
    });
    this.loadUser();
    this.initializeForm();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  loadUser(): void {
    let id = this.authService.tokenPars.Id;
    this.userService.get(id).subscribe({
      next: res => {
        this.user = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.checkShift();
        this.sForm.firstName.setValue(this.user.firstName);
        this.sForm.lastName.setValue(this.user.lastName);
      }
    });
  }

  loadCars(): ICarBase[] {
    this.carService.getAll().subscribe({
      next: res => {
        this.cars = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
      }
    });
    return this.cars;
  }

  loadCar(id: number): ICarBase[] {
    this.carService.get(id).subscribe({
      next: res => {
        this.car = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.ifFlagIsEnd();
      }
    });
    return this.cars;
  }

  checkShift(): void {
    this.shiftService.custom("find-unfinished", this.authService.tokenPars.Id).subscribe({
      next: (res: any) => {
        if (res != null) {
          if (res.shiftEnd.toLocaleDateString == null) {
            this.isShiftStarted = true;
            this.shift = res
          }
        } else {
          this.isShiftStarted = false;
        }
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        if (this.isShiftStarted) {
          this.loadCar(this.shift.carId)
          this.shift.user = this.user;
        } else {
          this.ifFlagIsStart();
        }
      }
    });
  }

  ifFlagIsStart() {
    this.flag == "end" ? this.router.navigateByUrl("/shift/" + apis.shift.start) : "";
    this.loadCars();
    this.sForm.car.setValidators([Validators.required]);
  }

  ifFlagIsEnd() {
    this.flag == "start" ? this.router.navigateByUrl("/shift/" + apis.shift.end) : "";
    this.form.controls.car.setValue(this.car.id);
    this.form.controls.mileageStart.setValue(this.shift.mileageStart);
    this.form.controls.mileageEnd.setValue(this.shift.mileageStart);
    this.sForm.mileageEnd.setValidators([Validators.required, Validators.min(this.sForm.mileageStart.value)]);
    this.sForm.mileageStart.disable();
    this.button = "End";
  }

  filterCars(event): void {
    this.carsFilter = this.cars.filter(x => x.registration.toLowerCase().includes(event.query.toLowerCase()));
  }

  changeMileage(event) {
    this.car = event;
    this.form.controls.mileageStart.setValue(event.mileage);
    this.sForm.mileageStart.clearValidators();
    this.sForm.mileageStart.addValidators([Validators.min(this.car.mileage)]);
  }

  submit(): void {
    this.flag == "start" ? this.start() : this.finish(this.shift);
  }

  public initializeForm(): void {
    this.form = this.fb.group({
      firstName: [{ value: null, disabled: true }, [Validators.required]],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
      mileageStart: [null, [Validators.required]],
      mileageEnd: [null],
      expenses: [null],
      description: [null],
      car: [null, [Validators.required]]
    })
  }

  get sForm() {
    return this.form.controls;
  }

  public start(): void {
    let dataToSend = this.prepareShiftDataToCreate();
    var prepareCarDataToUpdate: ICarBase = {
      id: this.car.id,
      registration: this.car.registration,
      validityOfRegistration: this.car.validityOfRegistration,
      mileage: this.sForm.mileageEnd.value? this.sForm.mileageEnd.value : this.sForm.mileageStart.value,
      description: this.car.description,
      color: this.car.color,
      chassisNumber: this.car.chassisNumber,
      engineVolume: this.car.engineVolume,
      horsePower: this.car.horsePower,
      fuelTypeId: this.car.fuelTypeId,
      carModelId: this.car.carModelId,
      createdAt: this.car.createdAt,
      editedAt: this.car.editedAt,
      deletedAt: this.car.deletedAt,
      isActive: true
    };

    this.form.controls.mileageStart.reset();
    this.form.controls.car.reset();

    this.carService.update(prepareCarDataToUpdate).subscribe({
      next: data => {
        this.messageColorClass = "text-success";
        this.message = "Car mileage is successfully changed.";
        setTimeout(() => this.message = "", 2500);
      },
      error: err => {
        console.log(err);
        this.messageColorClass = "text-danger";
        this.message = "Car mileage isn't successfully changed. " + (err.status ? `(${err.status})` : "");
        setTimeout(() => this.message = "", 2500);
      }
    });

    this.shiftService.create(dataToSend).subscribe({
      next: data => {
        this.messageColorClass = "text-success";
        this.message = "Shift has started successfully.";
        setTimeout(() => this.message = "", 2500);
        this.router.navigateByUrl("/shift/" + apis.shift.end);
      },
      error: err => {
        console.log(err);
        this.messageColorClass = "text-danger";
        this.message = "Shift hasn't started successfully. " + (err.status ? `(${err.status})` : "");
        setTimeout(() => this.message = "", 2500);
      },
      complete: () => {

      }
    });
  }

  public finish(shift: IShiftRideCar): void {
    let dataToSend = this.prepareShiftDataToUpdate();
    dataToSend.id = shift.id;
    dataToSend.userId = shift.user.id;
    dataToSend.carId = shift.carId;
    let prepareCarDataToUpdate: ICarBase = {
      id: this.car.id,
      registration: this.car.registration,
      validityOfRegistration: this.car.validityOfRegistration,
      mileage: this.sForm.mileageEnd.value,
      description: this.car.description,
      color: this.car.color,
      chassisNumber: this.car.chassisNumber,
      engineVolume: this.car.engineVolume,
      horsePower: this.car.horsePower,
      fuelTypeId: this.car.fuelTypeId,
      carModelId: this.car.carModelId,
      createdAt: this.car.createdAt,
      editedAt: this.car.editedAt,
      deletedAt: this.car.deletedAt,
      isActive: true
    };

    this.carService.update(prepareCarDataToUpdate).subscribe({
      next: data => {
        this.messageColorClass = "text-success";
        this.message = "Car mileage is successfully changed.";
        setTimeout(() => this.message = "", 2500);
      },
      error: err => {
        console.log(err);
        this.messageColorClass = "text-danger";
        this.message = "Car mileage isn't successfully changed. " + (err.status ? `(${err.status})` : "");
        setTimeout(() => this.message = "", 2500);
      }
    })
    this.shiftService.update(dataToSend).subscribe({
      next: data => {
        this.messageColorClass = "text-success";
        this.message = "Shift has ended successfully.";
        setTimeout(() => this.message = "", 2500);
        this.router.navigateByUrl("/shift/" + apis.shift.start);
      },
      error: err => {
        console.log(err);
        this.messageColorClass = "text-danger";
        this.message = "Shift hasn't ended successfully. " + (err.status ? `(${err.status})` : "");
        setTimeout(() => this.message = "", 2500);
      },
      complete: () => {
      }
    })
  }

  protected prepareShiftDataToCreate(): IShiftCreate {
    let shiftObj: IShiftCreate = {
      userId : this.authService.tokenPars.Id,
      mileageStart: this.sForm.mileageStart.value,
      carId: this.sForm.car.value.id
    }
    return shiftObj;
  }

  protected prepareShiftDataToUpdate(): IShiftUpdate {

    let shiftObj: IShiftUpdate = {
      id: 0,
      mileageStart: this.sForm.mileageStart.value,
      mileageEnd: this.sForm.mileageEnd.value,
      expenses: this.sForm.expenses.value ? this.sForm.expenses.value : 0,
      description: this.sForm.description.value,
      carId: 0,
      userId: 0
    }
    return shiftObj;
  }
}
