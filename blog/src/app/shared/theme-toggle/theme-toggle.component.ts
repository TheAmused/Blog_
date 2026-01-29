import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-outline-secondary rounded-circle" (click)="toggle()">
      <i class="fa" 
         [ngClass]="(isDark$ | async) ? 'fa-sun-o' : 'fa-moon-o'">
      </i>
    </button>
  `
})
export class ThemeToggleComponent {

  isDark$: Observable<boolean>;

  constructor(private themeService: ThemeService) {

    this.isDark$ = this.themeService.darkMode$;
  }

  toggle() {
    this.themeService.toggleTheme();
  }
}