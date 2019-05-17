import { Component, Input } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Observable, Subject } from 'rxjs';
import { ModalOptions } from './modal-options';
import { ModalSizes } from '../enum/modal-sizes';
import { ModalActive } from './modal-ref';
import { WindowAnimation } from './modal-animations';

@Component({
  selector: 'app-modal',
  host: {
    '[class]': 'modalClass',
    '[id]': 'modalId',
    '[style.z-index]': 'modalIndex',
    '(click)': 'handleBackdropClick()',
    '[@openClose]': 'isOpen ? "open" : "closed"',
    '(@openClose.start)': 'onAnimationEvent($event)',
    '(@openClose.done)': 'onAnimationEvent($event)'
  },
  template: `
    <div [class]="dialogClass" (click)="$event.stopPropagation()">
      <div class="modal-content">
        <ng-content></ng-content>
      </div>
    </div>`,
  animations: [WindowAnimation]
})
export class ModalWindowComponent {
  modalClass: string = 'modal d-block';
  isOpen: boolean = false;

  @Input() options: ModalOptions;
  @Input() index: number = 0;

  private onOpened: Subject<AnimationEvent> = new Subject<AnimationEvent>();
  private onClosed: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  get modalIndex(): number {
    return 1050 + this.index;
  };

  get modalId(): string {
    return 'modalWindow' + this.index;
  }

  get dialogClass(): string {
    const { options } = this;
    const centerClass = options && options.centered ? ' modal-dialog-centered' : '';
    const sizeClass = options && options.size ? ' modal-' + options.size : ' modal-' + ModalSizes.md;
    const customClass = options && options.dialogClass ? ' ' + options.dialogClass : '';
    return 'modal-dialog' + centerClass + sizeClass + customClass;
  }

  constructor(private modalActive: ModalActive) {
  }

  open(): Observable<AnimationEvent> {
    this.isOpen = true;
    return this.onOpened.asObservable();
  }

  close(): Observable<AnimationEvent> {
    this.isOpen = false;
    return this.onClosed.asObservable();
  }

  onAnimationEvent(e: AnimationEvent) {
    if (e.toState === 'open' && (e.fromState === 'void' || e.fromState === 'closed') && e.phaseName === 'done') {
      this.onOpened.next(e);
      this.onOpened.complete();
    }
    if (e.fromState === 'open' && (e.toState === 'void' || e.toState === 'closed') && e.phaseName === 'done') {
      this.onClosed.next(e);
      this.onClosed.complete();
    }
  }

  handleBackdropClick() {
    const { options } = this;
    if (options && (options.backdrop === 'static' || options.backdrop === false)) {
      return;
    }
    this.modalActive.dismiss({ backdropClick: true });
  }
}
