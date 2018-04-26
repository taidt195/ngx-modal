# Ngx-Modal
Custom bootstrap modal for angular application
### Installation
- Download and extract
- Copy folder to project
- Import module for project
```
import { ModalModule } from './ngx-modal/modal.module';
@NgModule({
  imports: [
    ...
    ModalModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### How to use
Example show a confirmation modal
- app.component.ts
```
import { Component } from '@angular/core';

import { ModalService } from './ngx-modal/modal.service';
import { ConfirmComponent } from './confirm.component';

@Component({
  selector: 'app-root',
  template: `<div>
                <h1>{{title}}</h1>
                <button (click)="openModal()">Open confirm</button>
            </div>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private modalService: ModalService) { }

  openModal(): void {
    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.contentInstance().title = 'Confirm title';
    modalRef.result.then(result => {
      console.log('result', result);
    }).catch(reason => {
      console.log('reason', reason);
    });
  }
}
```
- confirm.component.ts
```
import { Component } from '@angular/core';
import { ModalActive } from './ngx-modal/modal-ref';

@Component({
  selector: 'confirm',
  template: `
      <div class="modal-header">
        <h5 class="modal-title">{{title}}</h5>
        <button type="button" class="close" (click)="dismiss()">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Woohoo, you're reading this text in a modal!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="close('cancel')">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="close('ok')">Ok</button>
      </div>`
})
export class ConfirmComponent {
  title: string = '';
  constructor(private modalActive: ModalActive) { }

  close(type: string) {
    this.modalActive.close(type);
  }

  dismiss() {
    this.modalActive.dismiss('close modal');
  }
}
```