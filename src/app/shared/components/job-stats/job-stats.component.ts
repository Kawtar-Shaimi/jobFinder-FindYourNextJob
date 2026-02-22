import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-8 py-4 px-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl" *ngIf="total > 0">
      <div class="flex flex-col">
        <span class="text-2xl font-black text-indigo-600 leading-none mb-1">{{ total }}</span>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offres trouvées</span>
      </div>
      
      <div class="w-px h-8 bg-indigo-200/50"></div>

      <div class="flex flex-col">
        <span class="text-xl font-bold text-slate-900 leading-none mb-1">{{ currentPage }}<span class="text-slate-400 font-medium"> / {{ totalPages }}</span></span>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Page</span>
      </div>
    </div>
  `,
  styles: []
})
export class JobStatsComponent {
  @Input() total = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
}
