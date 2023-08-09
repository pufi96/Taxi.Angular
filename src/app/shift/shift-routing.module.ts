import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftComponent } from './shift/shift.component';
import { ShiftStartEndComponent } from './shift-start-end/shift-start-end.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  
  {
    path: ":flag",
    component: ShiftStartEndComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    component: ShiftComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRoutingModule { }
