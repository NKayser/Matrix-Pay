import {of} from 'rxjs';

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
