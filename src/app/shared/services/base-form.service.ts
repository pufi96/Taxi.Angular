import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseFormService {

  public abstract form: UntypedFormGroup;
  public abstract submit(): void;

  protected abstract initializeForm(): void;
  protected abstract prepareDataToSend(): any;

  constructor() { }
}