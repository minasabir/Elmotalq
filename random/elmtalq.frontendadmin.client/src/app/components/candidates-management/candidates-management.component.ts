import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidates-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidates-management.component.html',
  styleUrl: './candidates-management.component.scss'
})
export class CandidatesManagementComponent {
  candidates = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+966 500 123456',
      location: 'Riyadh, Saudi Arabia',
      jobTitle: 'Software Engineer',
      experience: '5 years',
      skills: 'JavaScript, Angular, React, Node.js',
      status: 'active',
      appliedDate: '2024-01-15',
      resumeLink: '#'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      phone: '+966 500 789012',
      location: 'Jeddah, Saudi Arabia',
      jobTitle: 'Product Manager',
      experience: '3 years',
      skills: 'Product Strategy, Agile, Scrum, Analytics',
      status: 'active',
      appliedDate: '2024-01-14',
      resumeLink: '#'
    },
    {
      id: 3,
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+966 500 345678',
      location: 'Dammam, Saudi Arabia',
      jobTitle: 'UX Designer',
      experience: '4 years',
      skills: 'Figma, Adobe XD, User Research, Prototyping',
      status: 'inactive',
      appliedDate: '2024-01-13',
      resumeLink: '#'
    }
  ];

  searchTerm = '';
  selectedStatus = 'all';
  selectedCandidate: any = null;
  showDetails = false;

  get filteredCandidates() {
    return this.candidates.filter(candidate => {
      const matchesSearch = !this.searchTerm || 
        candidate.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || candidate.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  viewCandidateDetails(candidate: any) {
    this.selectedCandidate = candidate;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCandidate = null;
  }

  updateCandidateStatus(candidateId: number, newStatus: string) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.status = newStatus;
    }
  }

  deleteCandidate(candidateId: number) {
    if (confirm('Are you sure you want to delete this candidate?')) {
      this.candidates = this.candidates.filter(c => c.id !== candidateId);
      if (this.selectedCandidate?.id === candidateId) {
        this.closeDetails();
      }
    }
  }

  exportCandidates() {
    // Export functionality
    console.log('Exporting candidates...');
  }
}
