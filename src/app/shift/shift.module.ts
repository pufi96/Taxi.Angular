import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftRoutingModule } from './shift-routing.module';
import { ShiftComponent } from './shift/shift.component';
import { ShiftStartEndComponent } from './shift-start-end/shift-start-end.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { RideTableComponent } from '../shared/components/ride/ride-table/ride-table.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CurrentRideTableComponent } from '../shared/components/ride/current-ride-table/current-ride-table.component';

@NgModule({
  declarations: [
    ShiftComponent,
    ShiftStartEndComponent,
    RideTableComponent,
    CurrentRideTableComponent

  ],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    CheckboxModule,
    InputNumberModule,
    TableModule,
    DynamicDialogModule 
  ],
  exports: [RideTableComponent],
})
export class ShiftModule { }
