import { Injectable, OnInit } from "@angular/core";
import { BaseFormService } from "../base-form.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class UserFormService extends BaseFormService implements OnInit {

    public form: FormGroup;
    public message: string;
    public messageColorClass: string;

    constructor(
        public fb: FormBuilder
    ) {
        super()
    }

    ngOnInit(): void {
    }

    public initializeForm(): void {
        this.form = this.fb.group({
            firstName: [{ value: null, disabled: true }],
            lastName: [{ value: null, disabled: true }],
        });
    }
    get sForm() {
        return this.form.controls;
    }
    public submit(): void {
    }
    protected prepareDataToSend() {
    }
}