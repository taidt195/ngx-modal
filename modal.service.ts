import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Inject,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';

import { ModalWindowComponent } from './modal-window.component';
import { ModalActive, ModalRef } from './modal-ref';
import { ModalOptions } from './modal-options';
import { ModalBackdropComponent } from './modal-backdrop.component';

@Injectable()
export class ModalService {
  private modalRefs: ModalRef[] = [];

  private get modalIndex(): number {
    return this.modalRefs.length;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  public open(content: any, options?: ModalOptions): ModalRef {
    const revertPaddingScrollBar: () => void = this.revertPaddingScrollBar(this.getScrollBarWidth());

    const modalActive = new ModalActive();

    const contentComponentRef = this.getContentComponent(content, modalActive);
    const backdropComponentRef = this.attachBackdrop(options);
    const modalWindowComponentRef = this.attachModalWindow(contentComponentRef, modalActive, options);

    this.appendModal(this.document.body, modalWindowComponentRef, backdropComponentRef);

    const modalRef = new ModalRef(contentComponentRef, modalWindowComponentRef, backdropComponentRef);
    modalActive.close = (result?: any) => {
      modalRef.close(result)
    };
    modalActive.dismiss = (reason?: any) => {
      modalRef.dismiss(reason)
    };
    this.registerModalRef(modalRef);
    this.attachBodyClass(modalRef, revertPaddingScrollBar);

    return modalRef;
  }

  private getContentComponent(contentComponent: any, modalActive: ModalActive): ComponentRef<any> {
    const contentFactory = this.componentFactoryResolver.resolveComponentFactory(contentComponent);
    const contentInject = Injector.create([{ provide: ModalActive, useValue: modalActive }], this.injector);
    const contentComponentRef = contentFactory.create(contentInject);
    this.applicationRef.attachView(contentComponentRef.hostView);
    return contentComponentRef;
  }

  private attachBackdrop(options: ModalOptions): ComponentRef<ModalBackdropComponent> {
    if (options && options.backdrop === false) {
      return null;
    }

    const backdropFactory = this.componentFactoryResolver.resolveComponentFactory(ModalBackdropComponent);
    const backdropComponentRef = backdropFactory.create(this.injector);
    backdropComponentRef.instance.options = options;
    backdropComponentRef.instance.index = this.modalIndex;
    this.applicationRef.attachView(backdropComponentRef.hostView);
    return backdropComponentRef;
  }

  private attachModalWindow(contentComponentRef: ComponentRef<any>, modalActive: ModalActive, options: ModalOptions): ComponentRef<ModalWindowComponent> {
    const modalWindowFactory = this.componentFactoryResolver.resolveComponentFactory(ModalWindowComponent);
    const modalWindowInject = Injector.create([{ provide: ModalActive, useValue: modalActive }], this.injector);
    const modalWindowComponentRef = modalWindowFactory.create(modalWindowInject, [[contentComponentRef.location.nativeElement]]);
    modalWindowComponentRef.instance.options = options;
    modalWindowComponentRef.instance.index = this.modalIndex;
    this.applicationRef.attachView(modalWindowComponentRef.hostView);
    return modalWindowComponentRef;
  }

  private appendModal(container: HTMLElement, modalWindowComponentRef: ComponentRef<ModalWindowComponent>, backdropComponentRef: ComponentRef<ModalBackdropComponent>): void {
    if (backdropComponentRef) {
      container.appendChild(backdropComponentRef.location.nativeElement);
    }
    container.appendChild(modalWindowComponentRef.location.nativeElement);
  }

  private registerModalRef(modalRef: ModalRef) {
    const unRegister = () => {
      const index = this.modalRefs.indexOf(modalRef);
      if (index > -1) {
        this.modalRefs.splice(index, 1);
      }
    }

    this.modalRefs.push(modalRef);

    modalRef.result.subscribe(unRegister);
  }

  private attachBodyClass(modalRef: ModalRef, revertPaddingScrollBar: () => void) {
    const removeBodyClass = () => {
      if (!this.modalRefs.length) {
        this.document.body.classList.remove('modal-open');
        revertPaddingScrollBar();
      }
    };

    if (this.modalRefs.length === 1) {
      this.document.body.classList.add('modal-open');
    }

    modalRef.result.subscribe(removeBodyClass);
  }

  private revertPaddingScrollBar(scrollBarWidth: number): () => void {
    const body = this.document.body;
    const bodyRect = body.getBoundingClientRect();
    const userSetPadding = body.style.paddingRight || '0px';
    if (bodyRect.left + bodyRect.right < window.outerWidth) {
      const paddingAmount = parseFloat(userSetPadding);
      body.style.paddingRight = `${paddingAmount + scrollBarWidth}px`;
    }
    return () => {
      body.style.paddingRight = userSetPadding;
    }
  }

  private getScrollBarWidth(): number {
    const measurer = this.document.createElement('div');
    measurer.className = 'modal-scrollbar-measure';

    const body = this.document.body;
    body.appendChild(measurer);
    const width = measurer.getBoundingClientRect().width - measurer.clientWidth;
    body.removeChild(measurer);

    return width;
  }
}
