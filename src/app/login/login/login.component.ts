import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { apis } from 'src/app/constants/api';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { AuthService } from 'src/app/shared/services/auth.services';
import { LoginFormService } from 'src/app/shared/services/loginServices/login-form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  errorMsg: string = "";


  constructor(
    public formService: LoginFormService,
    public authService: AuthService,
    public router: Router,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    LayoutComponent.setLog(false);
    if(this.authService.token){
      console.log(this.authService.token)
      this.router.navigateByUrl("/shift/" + apis.shift.start);
    }
    this.formService.initializeForm();
  }

  login() {
    this.formService.submit().subscribe({
      next: async (data: any) => {
        this.authService.saveToken(data.token);
        this.authService.authData();
        this.router.navigateByUrl("/shift/" + apis.shift.start);
      },
      error: (err:any) => {
        if(err.status == 401){
          this.errorMsg = "Wrong username and/or password.";
          this.messageService.add({
            severity: 'error',
            summary: 'Invalid login',
            detail: 'Wrong username and/or password.',
            life: 3000
          })
        }
      }
    });
    
  }
}
