import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';

  // Mock user for UI purposes - could be replaced with an Auth Service later
  user = {
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@elmtalq.com'
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  menuItems = [
    {
      icon: '📊',
      label: 'لوحة التحكم',
      route: '/dashboard',
      description: 'نظرة عامة وإحصائيات'
    },
    {
      icon: '👥',
      label: 'المرشحين',
      route: '/candidates',
      description: 'إدارة طلبات التوظيف'
    },
    {
      icon: '🏢',
      label: 'الشركات',
      route: '/companies',
      description: 'إدارة طلبات الشركات'
    },
    {
      icon: '👔',
      label: 'فريق العمل',
      route: '/employees',
      description: 'إدارة الموظفين'
    }
  ];
}
