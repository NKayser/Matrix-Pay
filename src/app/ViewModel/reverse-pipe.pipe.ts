import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reversePipe',
  pure: false
})
export class ReversePipePipe implements PipeTransform {

  transform(value): any{
    return value.slice().reverse();
  }

}
