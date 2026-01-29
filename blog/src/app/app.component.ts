import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { ThemeService } from './services/theme.service';
import { NavbarComponent } from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public counter: number = 0;

  constructor(private themeService: ThemeService) {}

  add() {
    this.counter++;
  }

  remove() {
    this.counter--;
  }
}