import { Component, Input } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { ModalOptions } from './modal-options';
import { BackdropAnimation } from './modal-animations';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-modal-backdrop',
  template: '',
  host: {
    '[class]': 'backdropClass',
    '[id]': 'backdropId',
    '[style.z-index]': 'backdropIndex',
    '[@openClose]': 'isOpen ? "open" : "closed"',
    '(@openClose.start)': 'onAnimationEvent($event)',
    '(@openClose.done)': 'onAnimationEvent($event)'
  },
  animations: [BackdropAnimation]
})
export class ModalBackdropComponent {
  isOpen: boolean = false;

  @Input() options: ModalOptions;
  @Input() index: number = 0;

  private onOpened: Subject<AnimationEvent> = new Subject<AnimationEvent>();
  private onClosed: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  get backdropIndex(): number {
    return 1050 + this.index;
  }

  get backdropId(): string {
    return 'modalBackdrop' + this.index;
  }

  get backdropClass(): string {
    const { options } = this;
    const defaultClass = 'modal-backdrop';
    return options && options.backdropClass ? `${defaultClass} ${options.backdropClass}` : defaultClass;
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
}
