import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalBackdropComponent } from './modal-backdrop.component';
import { ModalWindowComponent } from './modal-window.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalBackdropComponent,
    ModalWindowComponent
  ],
  entryComponents: [
    ModalBackdropComponent,
    ModalWindowComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule {
}
