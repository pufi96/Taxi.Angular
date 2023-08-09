import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthService } from './shared/services/auth.services';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
      },
      {
        path: "login",
        loadChildren: () => import("./login/login.module").then(m => m.LoginModule)
      },
      {
        path: "logout",
        loadChildren: () => import("./logout/logout.module").then(m => m.LogoutModule)
      },
      {
        path: "shift",
        loadChildren: () => import("./shift/shift.module").then(m => m.ShiftModule),
        canActivate: [AuthGuard]
      },
      {
        path: "profile",
        loadChildren: () => import("./user/user.module").then(m => m.UserModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
