import { trigger, style, animate, transition, group, query, state } from '@angular/animations';

const WindowAnimation = trigger('openClose', [
  transition('* => open', group([
    query(':self', [
      style({
        opacity: 0,
      }),
      animate('150ms ease-out', style({
        opacity: 1,
      }))
    ]),
    query('.modal-dialog', [
      style({
        transform: 'translateY(-15%)'
      }),
      animate('300ms ease-out', style({
        transform: 'translateY(0%)'
      }))
    ])
  ])),
  transition('open => *', group([
    query(':self', [
      animate('150ms ease-in', style({
        opacity: 0,
      }))
    ]),
    query('.modal-dialog', [
      animate('300ms ease-in', style({
        transform: 'translateY(-15%)'
      }))
    ])
  ]))
]);

const BackdropAnimation = trigger('openClose', [
  state('void, closed', style({
    opacity: 0
  })),
  state('open', style({
    opacity: 0.5
  })),
  transition('* <=> *', [
    animate('150ms')
  ])
]);

export { WindowAnimation, BackdropAnimation }
