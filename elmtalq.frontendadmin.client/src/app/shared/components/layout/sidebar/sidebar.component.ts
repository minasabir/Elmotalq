import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      route: '/dashboard',
      description: 'Overview & Statistics'
    },
    {
      icon: '👥',
      label: 'Candidates',
      route: '/candidates',
      description: 'Manage Candidates'
    },
    {
      icon: '🏢',
      label: 'Companies',
      route: '/companies',
      description: 'Manage Companies'
    },
    {
      icon: '👔',
      label: 'Employees',
      route: '/employees',
      description: 'Manage Employees'
    },
    {
      icon: '🔍',
      label: 'Search',
      route: '/search',
      description: 'Global Search'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      route: '/settings',
      description: 'System Settings'
    }
  ];
}
