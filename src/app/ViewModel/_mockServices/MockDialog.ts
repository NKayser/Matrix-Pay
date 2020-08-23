import {of} from 'rxjs';
import {ConfirmPaybackModalComponent} from '../confirm-payback-modal/confirm-payback-modal.component';

export const MockDialogCancel = { open: (i1: any, i2: any) => {
 return {
      afterClosed(): any {
        return of(undefined);
      }
    };
}
};

export const MockDialog = { open: (i1: any, i2: any) => {
  return {
          afterClosed(): any {
            return of(i2.data);
          }
        };
      }
};
