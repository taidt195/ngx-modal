import { Component, Input, AfterViewInit } from '@angular/core';

declare const jQuery: any;

@Component({
  selector: 'app-modal',
  host: {
    'class': 'modal fade',
    '[id]': 'getModalId()'
  },
  template: `<div class="modal-dialog">
                <div class="modal-content">
                  <ng-content></ng-content>
                </div>
              </div>`
})
export class ModalComponent implements AfterViewInit {
  private modalId: string = `modal-${Date.now()}`;

  ngAfterViewInit(): void {
    jQuery(`#${this.modalId}`).modal({ backdrop: 'static', show: true });
  }

  getModalId(): string {
    return this.modalId;
  }
}