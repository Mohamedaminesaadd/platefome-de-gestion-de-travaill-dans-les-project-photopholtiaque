// ============================================================
// mock-data.service.ts — 12 tâches + 5 techniciens
// ============================================================
import { Injectable } from '@angular/core';
import { Task, Technician } from '../core/models/task-filter.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  readonly technicians: Technician[] = [
    { id: 't1', name: 'Amir Belhaj',   avatar: 'AB', avatarColor: '#6366f1', role: 'Frontend Dev'   },
    { id: 't2', name: 'Sara Mansouri', avatar: 'SM', avatarColor: '#ec4899', role: 'Backend Dev'    },
    { id: 't3', name: 'Karim Dridi',   avatar: 'KD', avatarColor: '#f59e0b', role: 'DevOps Eng.'    },
    { id: 't4', name: 'Nour Chaabane', avatar: 'NC', avatarColor: '#10b981', role: 'QA Engineer'    },
    { id: 't5', name: 'Yassine Tlili', avatar: 'YT', avatarColor: '#3b82f6', role: 'Full Stack Dev' },
  ];

  readonly tasks: Task[] = [
    {
      id: 'task-01', title: 'Design login page wireframes',
      description: 'Create low-fi wireframes for the authentication flow.',
      status: 'done', priority: 'medium',
      deadline: new Date(Date.now() - 86400000 * 3),
      assignedTo: this.technicians[0],
      phaseId: 'ph1', phaseName: 'Design Phase', projectId: 'proj1',
    },
    {
      id: 'task-02', title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated builds and deploys.',
      status: 'in-progress', priority: 'high',
      deadline: new Date(Date.now() + 86400000 * 1),
      assignedTo: this.technicians[2],
      phaseId: 'ph2', phaseName: 'DevOps Phase', projectId: 'proj1',
    },
    {
      id: 'task-03', title: 'Implement JWT authentication',
      description: 'Secure API endpoints with JWT tokens and refresh logic.',
      status: 'in-progress', priority: 'high',
      deadline: new Date(Date.now() + 86400000 * 2),
      assignedTo: this.technicians[1],
      phaseId: 'ph2', phaseName: 'Backend Phase', projectId: 'proj1',
    },
    {
      id: 'task-04', title: 'Write unit tests for services',
      description: 'Achieve 80%+ coverage on all Angular services.',
      status: 'todo', priority: 'medium',
      deadline: new Date(Date.now() + 86400000 * 5),
      assignedTo: this.technicians[3],
      phaseId: 'ph3', phaseName: 'Testing Phase', projectId: 'proj1',
    },
    {
      id: 'task-05', title: 'Database schema migration',
      description: 'Apply v2 schema changes and test rollback procedures.',
      status: 'todo', priority: 'high',
      deadline: new Date(Date.now() - 86400000 * 1),
      assignedTo: null,
      phaseId: 'ph2', phaseName: 'Backend Phase', projectId: 'proj1',
    },
    {
      id: 'task-06', title: 'Build Kanban board component',
      description: 'Drag-and-drop Kanban with Angular CDK.',
      status: 'in-progress', priority: 'medium',
      deadline: new Date(Date.now() + 86400000 * 3),
      assignedTo: this.technicians[4],
      phaseId: 'ph1', phaseName: 'Design Phase', projectId: 'proj1',
    },
    {
      id: 'task-07', title: 'Integrate charting library',
      description: 'Add Chart.js for dashboard analytics views.',
      status: 'todo', priority: 'low',
      deadline: new Date(Date.now() + 86400000 * 7),
      assignedTo: null,
      phaseId: 'ph3', phaseName: 'Testing Phase', projectId: 'proj1',
    },
    {
      id: 'task-08', title: 'Performance audit & optimization',
      description: 'Lighthouse audit, lazy loading, bundle size reduction.',
      status: 'todo', priority: 'medium',
      deadline: new Date(Date.now() + 86400000 * 0.3),
      assignedTo: this.technicians[0],
      phaseId: 'ph4', phaseName: 'Optimization', projectId: 'proj1',
    },
    {
      id: 'task-09', title: 'API documentation (Swagger)',
      description: 'Document all REST endpoints with Swagger/OpenAPI.',
      status: 'done', priority: 'low',
      deadline: new Date(Date.now() - 86400000 * 7),
      assignedTo: this.technicians[1],
      phaseId: 'ph2', phaseName: 'Backend Phase', projectId: 'proj1',
    },
    {
      id: 'task-10', title: 'Responsive mobile layout',
      description: 'Ensure all pages are mobile-first and tested on devices.',
      status: 'todo', priority: 'high',
      deadline: new Date(Date.now() - 86400000 * 2),
      assignedTo: null,
      phaseId: 'ph1', phaseName: 'Design Phase', projectId: 'proj1',
    },
    {
      id: 'task-11', title: 'E2E tests with Cypress',
      description: 'Cover critical user journeys with end-to-end tests.',
      status: 'todo', priority: 'low',
      deadline: new Date(Date.now() + 86400000 * 6),
      assignedTo: this.technicians[3],
      phaseId: 'ph3', phaseName: 'Testing Phase', projectId: 'proj1',
    },
    {
      id: 'task-12', title: 'Role-based access control',
      description: 'Implement admin/manager/technician role guards.',
      status: 'in-progress', priority: 'high',
      deadline: new Date(Date.now() + 86400000 * 4),
      assignedTo: this.technicians[4],
      phaseId: 'ph2', phaseName: 'Backend Phase', projectId: 'proj1',
    },
  ];
}