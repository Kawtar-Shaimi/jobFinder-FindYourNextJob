import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncate pipe: cuts text at maxLength and appends '...'
 * Usage: {{ text | truncate:120 }}
 */
@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, maxLength = 150): string {
        if (!value) return '';
        return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
    }
}
