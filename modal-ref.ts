import { Injectable, ComponentRef } from '@angular/core';
import { ModalComponent } from './modal.component';

declare const jQuery: any;

export class ModalActive {
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

export class ModalRef {
  private _resolve: (result?: any) => void;
  private _reject: (reason?: any) => void;

  private modalId: string;
  public result: Promise<any>;

  constructor(
    private modalComponent: ComponentRef<ModalComponent>,
    private modalContent: ComponentRef<any>
  ) {
    this.modalId = this.modalComponent.instance.getModalId();
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  contentInstance(): any {
    return this.modalContent.instance;
  }

  close(result?: any) {
    jQuery(`#${this.modalId}`).modal('hide').on('hidden.bs.modal', (e) => {
      this._resolve(result);
      this.removeModal();
    });
  }

  dismiss(reason?: any) {
    jQuery(`#${this.modalId}`).modal('hide').on('hidden.bs.modal', (e) => {
      this._reject(reason);
      this.removeModal();
    });
  }

  private removeModal() {
    const componentNative: any = this.modalComponent.location.nativeElement;
    componentNative.parentNode.removeChild(componentNative);
    this.modalComponent.destroy();
    this.modalContent.destroy();
  }
}