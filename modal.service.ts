import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Injector, ApplicationRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ModalComponent } from './modal.component';
import { ModalActive, ModalRef } from './modal-ref';

@Injectable()
export class ModalService {
  private _document: any;

  constructor(
    @Inject(DOCUMENT) document,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this._document = document;
  }

  public open(content: any, options?: any): ModalRef {
    const modalCFR = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    const modalActive = new ModalActive();

    const contentComponentRef = this.getContent(content, modalActive);

    const modalComponentRef = modalCFR.create(this.injector, [[contentComponentRef.location.nativeElement]]);
    this.applicationRef.attachView(modalComponentRef.hostView);

    const modalRef = new ModalRef(modalComponentRef, contentComponentRef);
    modalActive.close = modalRef.close.bind(modalRef);
    modalActive.dismiss = modalRef.dismiss.bind(modalRef);

    this._document.body.appendChild(modalComponentRef.location.nativeElement);
    return modalRef;
  }

  private getContent(content: any, modalActive: ModalActive): ComponentRef<any> {
    const contentCFR = this.componentFactoryResolver.resolveComponentFactory(content);
    const contentInject = Injector.create([{ provide: ModalActive, useValue: modalActive }], this.injector);
    const contentComponentRef = contentCFR.create(contentInject);
    this.applicationRef.attachView(contentComponentRef.hostView);
    return contentComponentRef;
  }
}