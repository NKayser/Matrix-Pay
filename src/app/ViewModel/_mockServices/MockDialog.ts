import {of} from 'rxjs';

export const MockDialog = { open: (i1: any, i2: any) => {
  console.log(i2.data);
  return {
    afterClosed(): any {
      return of(i2.data);
    }
  };
}
};
