import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseFormService } from "../base-form.service";
import { ShiftService } from "./shift.service";
import { Injectable, OnInit } from "@angular/core";
import { IShiftCreate, IShiftRideCar, IShiftUpdate } from "../../interfaces/i-shift";
import { Router } from "@angular/router";
import { apis } from "src/app/constants/api";
import { UpdateCarServices } from "../carServices/updateCar.services";
import { AuthService } from "../auth.services";
import { ICarBase } from "../../interfaces/i-car";

@Injectable({
  providedIn: 'root'
})

export class ShiftStartEndFormService extends BaseFormService implements OnInit {

  public form: FormGroup;
  public message: string;
  public messageColorClass: string;

  constructor(
    private shiftApi: ShiftService,
    private fb: FormBuilder,
    private router: Router,
    private carService: UpdateCarServices,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
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

  public submit(): void {
    let dataToSend = this.prepareDataToSend();
    let carDataToSend: ICarBase = {
      id: this.sForm.car.value.id,
      registration: this.sForm.car.value.registration,
      validityOfRegistration: this.sForm.car.value.validityOfRegistration,
      mileage: this.sForm.mileageStart.value,
      description: this.sForm.car.value.description,
      color: this.sForm.car.value.color,
      chassisNumber: this.sForm.car.value.chassisNumber,
      engineVolume: this.sForm.car.value.engineVolume,
      horsePower: this.sForm.car.value.horsePower,
      fuelTypeId: this.sForm.car.value.fuelType.id,
      carModelId: this.sForm.car.value.carModel.id,
      createdAt: this.sForm.car.value.createdAt,
      editedAt: this.sForm.car.value.editedAt,
      deletedAt: this.sForm.car.value.deletedAt,
      isActive: true
    };

    this.form.controls.mileageStart.reset();
    this.form.controls.car.reset();

    this.carService.update(carDataToSend).subscribe({
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
    this.shiftApi.create(dataToSend).subscribe({
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
    let dataToSend = this.prepareDataToUpdate();
    dataToSend.id = shift.id;
    dataToSend.userId = shift.user.id;
    dataToSend.carId = shift.car.id;

    let carDataToSend: ICarBase = {
      id: shift.car.id,
      registration: shift.car.registration,
      validityOfRegistration: shift.car.validityOfRegistration,
      mileage: this.sForm.mileageEnd.value,
      description: shift.car.description,
      color: shift.car.color,
      chassisNumber: shift.car.chassisNumber,
      engineVolume: shift.car.engineVolume,
      horsePower: shift.car.horsePower,
      fuelTypeId: shift.car.fuelTypeId,
      carModelId: shift.car.carModelId,
      createdAt: shift.car.createdAt,
      editedAt: shift.car.editedAt,
      deletedAt: shift.car.deletedAt,
      isActive: true
    };

    this.carService.update(carDataToSend).subscribe({
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
    this.shiftApi.update(dataToSend).subscribe({
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

  protected prepareDataToSend(): IShiftCreate {
    let shiftObj: IShiftCreate = {
      mileageStart: this.sForm.mileageStart.value,
      carId: this.sForm.car.value.id,
      userId: this.authService.tokenPars.Id
    }
    return shiftObj;
  }

  protected prepareDataToUpdate(): IShiftUpdate {

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
