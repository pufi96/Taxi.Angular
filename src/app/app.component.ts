import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.services';
// import { DialogService } from 'primeng/dynamicdialog';
// import { LoginComponent } from './login/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Taxi';
  constructor(){}

  // otvori(){
  //   const ref = this.dialogService.open(LoginComponent,{
  //     width: '90%',
  //     header: 'Login',
  //     data:{
  //       nesto: 123
  //     }
  //   })

  //   ref.onClose.subscribe(
  //     (data) => {
  //       console.log(data)
  //     }
  //   )
  // }
}
