import { Component } from '@angular/core';

@Component({
    selector: 'app-spinner',
    standalone: true,
    template: `
    <div class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `
})
export class SpinnerComponent { }
