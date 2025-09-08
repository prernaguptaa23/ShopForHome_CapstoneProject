import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number, currencySymbol: string = '₹', decimalLength: number = 2): string {
    if (value == null) return '';
    return currencySymbol + ' ' + value.toFixed(decimalLength).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
