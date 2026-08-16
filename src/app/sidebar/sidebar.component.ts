import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenu, MatMenuModule } from "@angular/material/menu";



@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatListModule, MatSidenavModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, MatExpansionModule, MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;

  constructor(
    public authService: AuthService
  ) {}
}
