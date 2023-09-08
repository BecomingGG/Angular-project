import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initFullname',
})
export class InitFullnamePipe implements PipeTransform {
  transform(value: string | null): string {
    return (
      value
        ?.split(' ')
        .map((text) => text[0])
        .join('.') || ''
    );
  }
}
