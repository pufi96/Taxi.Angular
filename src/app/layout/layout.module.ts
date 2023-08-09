import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './layout/components/navigation/navigation.component';


@NgModule({
  declarations: [
    LayoutComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
