import { Injectable, Input, OnInit } from "@angular/core";
import { BaseFormService } from "../base-form.service";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { IRideBase, IRideCreate } from "../../interfaces/i-ride";
import { RideService } from "../rideServices/ride.service";
import { Router } from "@angular/router";
import { apis } from "src/app/constants/api";
import { ShiftService } from "./shift.service";
import { AuthService } from "../auth.services";
import { IShiftRideCar } from "../../interfaces/i-shift";
import { IDebtorBase } from "../../interfaces/i-debrot";

@Injectable({
    providedIn: 'root'
})

export class ShiftRideFormService extends BaseFormService implements OnInit {

    public form: FormGroup;
    public message: string;
    public messageColorClass: string;
    shiftId: number;
    isShiftStarted: boolean;
    isLocal: boolean;
    shift: IShiftRideCar;
    debtor: IDebtorBase;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private rideService: RideService,
        private shiftService: ShiftService,
        private authService: AuthService
    ) {
        super();
        this.checkShift();
    }

    ngOnInit(): void {
    }

    public initializeForm(): void {
        this.form = this.fb.group({
            location: [null, [Validators.required]],
            isLocal: [null],
            locationPrice: [null, [Validators.required]],
            ridePrice: [null, [Validators.required]],
            debtor: [null]
        })
    }

    get sForm() {
        return this.form.controls;
    }

    public submit(): void {
        this.checkShift();
        let dataToSend = this.prepareDataToSend();
        this.form.reset();
        this.rideService.create(dataToSend).subscribe({
            next: data => {
                this.messageColorClass = "text-success";
                this.message = "Shift has started successfully.";
                setTimeout(() => this.message = "", 2500);
            },
            error: err => {
                console.log(err);
                this.messageColorClass = "text-danger";
                this.message = "Shift hasn't started successfully. " + (err.status ? `(${err.status})` : "");
                setTimeout(() => this.message = "", 2500);
            },
            complete: () => {
                this.checkShift();
            }
        })
        this.sForm.isLocal.setValue(false);
    }

    protected prepareDataToSend(): IRideCreate {
        this.checkShift();
        let rideObj: IRideCreate
        rideObj = {
            isLocal: true,
            ridePrice: this.sForm.ridePrice.value,
            locationPriceId: null,
            shiftId: this.shiftId,
            debtorId: this.sForm.debtor.value?.id? this.sForm.debtor.value.id : null
        }
        if (this.sForm.isLocal.value == false || this.sForm.isLocal.value == null) {
            rideObj.isLocal = false;
            rideObj.locationPriceId = this.sForm.locationPrice.value.id
        }

        return rideObj;
    }

    checkShift(): void {
        this.shiftService.custom("find-unfinished", this.authService.tokenPars.Id).subscribe({
            next: (res: any) => {
                if (res != null) {
                    if (res.shiftEnd.toLocaleDateString == null) {
                        this.shiftId = res.id;
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
                }
            }
        });
    }

}