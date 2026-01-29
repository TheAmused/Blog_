import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true
})
export class PaginatePipe implements PipeTransform {
  

  transform(items: any[], page: number, perPage: number): any[] {
    if (!items) return [];
    

    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    return items.slice(start, end);
  }
}