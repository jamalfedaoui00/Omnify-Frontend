import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from "./pages/sidebar/sidebar";
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('omnify-frontend');
    showSidebar = false;

  private hideSidebarRoutes = ['/signin', '/signup', '/activate-account'];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSidebar = !this.hideSidebarRoutes.includes(event.urlAfterRedirects);
    });
  }
}
