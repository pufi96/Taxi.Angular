import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { BaseFormService } from "../base-form.service";

@Injectable({
  providedIn: 'root'
})

export class LoginFormService extends BaseFormService {

  public form: UntypedFormGroup;

  constructor(private loginService: LoginService) {
    super();
  }

  public initializeForm(): void {
    this.form = new UntypedFormGroup({
      username: new UntypedFormControl("", [Validators.required]),
      password: new UntypedFormControl("", [Validators.required])
    });
  }

  protected prepareDataToSend(): any {
    return this.form.value;
  }

  public submit(): Observable<any> {
    let data: any = this.prepareDataToSend();
    return this.loginService.create(data);
  }

}
