import { ModalSizes } from '../enum/modal-sizes';

export interface ModalOptions {
  backdrop?: boolean | 'static';
  backdropClass?: string;
  size?: ModalSizes;
  centered?: boolean;
  dialogClass?: string;
}
