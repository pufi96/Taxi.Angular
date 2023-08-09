import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ShiftTableComponent } from '../shared/components/shift-table/shift-table.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ProfileComponent,
    ShiftTableComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    DynamicDialogModule,
    CalendarModule,
    DatePipe
    
    // InputNumberModule,
  ]
})
export class UserModule { }
