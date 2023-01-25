import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'naFilter'
})
export class NaFilterPipe implements PipeTransform {

  transform(value: any | null ): any {
    if(value == 0)
      return value
    else if( value == null || value === undefined || value == "" || value == "null" || value == "Invalid date") 
      return 'NA';
    else return value;
  }

}
