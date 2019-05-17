import { ComponentRef } from '@angular/core';
import { ModalWindowComponent } from './modal-window.component';
import { ModalBackdropComponent } from './modal-backdrop.component';
import { Observable, Subject, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface ModalResult {
  action: 'close' | 'dismiss';
  data?: any;
}

export class ModalActive {
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

export class ModalRef {
  private _result: Subject<ModalResult> = new Subject<ModalResult>();

  public get result(): Observable<ModalResult> {
    return this._result.asObservable();
  };

  constructor(
    private modalContent: ComponentRef<any>,
    private modalWindow: ComponentRef<ModalWindowComponent>,
    private modalBackdrop: ComponentRef<ModalBackdropComponent>
  ) {
    if (modalBackdrop) {
      modalBackdrop.instance.open();
    }
    modalWindow.instance.open();
  }

  public get contentInstance(): any {
    return this.modalContent.instance;
  }

  public close(result?: any) {
    this.closeModalInstances().subscribe(() => {
      this.returnResult({ action: 'close', data: result });
    });
  }

  public dismiss(reason?: any) {
    this.closeModalInstances().subscribe(() => {
      this.returnResult({ action: 'dismiss', data: reason });
    });
  }

  private returnResult(result: ModalResult) {
    this._result.next(result);
    this._result.complete();
  }

  private closeModalInstances(): Observable<any> {
    const { modalWindow, modalBackdrop } = this;
    const closeInstances: Observable<any>[] = [];
    if (modalBackdrop && modalBackdrop.instance) {
      closeInstances.push(modalBackdrop.instance.close());
    }
    closeInstances.push(modalWindow.instance.close());
    return forkJoin(closeInstances).pipe(
      finalize(() => {
        this.removeModalInstances();
      })
    );
  }

  private removeModalInstances() {
    const { modalContent, modalWindow, modalBackdrop } = this;
    const backdropNative: HTMLElement = modalBackdrop ? modalBackdrop.location.nativeElement : null;
    const modalNative: HTMLElement = modalWindow.location.nativeElement;

    if (backdropNative && backdropNative.parentNode) {
      backdropNative.parentNode.removeChild(backdropNative);
    }

    if (modalNative.parentNode) {
      modalNative.parentNode.removeChild(modalNative);
    }

    if (modalBackdrop) {
      modalBackdrop.destroy();
    }
    modalContent.destroy();
    modalWindow.destroy();
  }
}
