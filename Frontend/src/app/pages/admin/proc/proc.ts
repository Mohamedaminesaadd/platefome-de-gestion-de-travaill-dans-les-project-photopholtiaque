import { Sidebar } from "../../../layout/sidbar/sidbar";
import { Topbar } from "../../../layout/topbar/topbar";
import { ListProject } from "../../../dashboard/list-project/list-project";
import { Timeline } from "../../../dashboard/timeline/timeline";

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  Input,
  Inject, 
  
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables  } from 'chart.js';

// Angular Material
import { MatCardModule }        from '@angular/material/card';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule }      from '@angular/material/core';
import { MatTooltipModule }     from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { IaDahsborad } from "../../../dashboard/ia-dahsborad/ia-dahsborad";

Chart.register(...registerables);

export type ProjectStatus = 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED';
export type Priority      = 'HIGH' | 'MEDIUM' | 'LOW';
export type Period        = 'week' | 'month' | 'quarter';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  daysRemaining?: number;
  daysOverdue?: number;
  dueToday?: boolean;
}

export interface Task {
  id: string;
  name: string;
  time: string;
  duration: string;
  priority: Priority;
  done: boolean;
}

export interface Deadline {
  id: string;
  month: string;
  day: number;
  name: string;
  project: string;
  color: string;
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  availability: number;
  avatarBg: string;
  avatarColor: string;
}

@Component({
  selector: 'app-proc',
  standalone: true,
  imports: [Sidebar, Topbar, ListProject, Timeline, IaDahsborad],
  templateUrl: './proc.html',
  styleUrl: './proc.css',
})
export class Proc implements OnInit, AfterViewInit, OnDestroy {

  @Input() opened = true;
  @ViewChild('timelineCanvas') timelineCanvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  activePeriod: Period = 'month';

  readonly chartDatasets: Record<Period, { labels: string[]; target: number[]; est: number[] }> = {
    week:    { labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], target: [2,3,4,6,5,2,1], est: [3,4,3,4,5,3,2] },
    month:   { labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], target: [4,7,5,8,6,3,2], est: [3,5,4,5,5,3,2] },
    quarter: { labels: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil'], target: [10,14,12,18,15,9,7], est: [8,12,10,14,13,8,6] },
  };

  // ── DATA ─────────────────────────────────────────────────────
  
  projects: Project[] = [
    { id:'p1', name:'West Side Solar Farm',  client:'Green Energy Co',  status:'IN_PROGRESS', progress:75, daysRemaining:12 },
    { id:'p2', name:'Residential Cluster A', client:'Horizon Homes',    status:'DELAYED',     progress:40, daysOverdue:3   },
    { id:'p3', name:'Downtown Tech Park',    client:'Urban Solutions',  status:'COMPLETED',   progress:100, dueToday:true  },
    { id:'p4', name:'Mountain Ridge Array',  client:'Peak Power',       status:'IN_PROGRESS', progress:15, daysRemaining:45 },
  ]

  tasks: Task[] = [
    { id:'t1', name:'Site survey: Sector 4',  time:'09:00 AM', duration:'2h',   priority:'HIGH',   done:false },
    { id:'t2', name:'Inverter inspection',     time:'11:30 AM', duration:'1.5h', priority:'MEDIUM', done:false },
    { id:'t3', name:'Permit review meeting',   time:'02:00 PM', duration:'1h',   priority:'LOW',    done:false },
    { id:'t4', name:'Team safety briefing',    time:'04:30 PM', duration:'30m',  priority:'HIGH',   done:false },
  ];

  deadlines: Deadline[] = [
    { id:'d1', month:'OCT', day:24, name:'Final Inspection', project:'West Side',           color:'#F59E0B' },
    { id:'d2', month:'OCT', day:26, name:'Grid Connection',  project:'Mountain Ridge',      color:'#3B82F6' },
    { id:'d3', month:'OCT', day:29, name:'Panel Delivery',   project:'Residential Cluster', color:'#EF4444' },
  ];

  team: TeamMember[] = [
    { id:'m1', initials:'JM', name:'J. Martin', availability:85, avatarBg:'#DBEAFE', avatarColor:'#1E40AF' },
    { id:'m2', initials:'SC', name:'S. Chen',   availability:60, avatarBg:'#D1FAE5', avatarColor:'#065F46' },
    { id:'m3', initials:'RK', name:'R. Kumar',  availability:30, avatarBg:'#FEE2E2', avatarColor:'#991B1B' },
    { id:'m4', initials:'LP', name:'L. Park',   availability:90, avatarBg:'#EDE9FE', avatarColor:'#5B21B6' },
  ];

  
    notifCount: any=1;


  // ── GETTERS ───────────────────────────────────────────────────
  get pendingCount(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
  }

  // ── LIFECYCLE ─────────────────────────────────────────────────
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
    this.buildChart();
  }
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }
  

  // ── CHART ─────────────────────────────────────────────────────
  private buildChart(): void {
    const canvas = this.timelineCanvas.nativeElement;
    const ctx    = canvas.getContext('2d')!;
    const d      = this.chartDatasets[this.activePeriod];

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(37,99,235,.85)');
    gradient.addColorStop(1, 'rgba(37,99,235,.45)');

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'Target Completed',
            data: d.target,
            backgroundColor: gradient,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: .55,
            categoryPercentage: .65,
          },
          {
            label: 'Estimated Completion',
            data: d.est,
            backgroundColor: 'rgba(203,213,225,.55)',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: .55,
            categoryPercentage: .65,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,.9)',
            titleFont: { family: 'DM Sans', size: 12, weight: 'bold' },
            bodyFont:  { family: 'DM Sans', size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (c) => ` ${c.dataset.label}: ${c.parsed.y} tâches`,
            },
          },
        },
        scales: {
          x: {
            grid:   { display: false },
            border: { display: false },
            ticks:  { font: { family: 'DM Sans', size: 12 }, color: '#94A3B8' },
          },
          y: {
            grid:   { color: '#F1F5F9', lineWidth: 1 },
            border: { display: false, dash: [4, 4] },
            ticks:  { font: { family: 'DM Sans', size: 11 }, color: '#94A3B8', stepSize: 2 },
          },
        },
      },
    });
  }

  switchPeriod(period: Period): void {
    this.activePeriod = period;
    const d = this.chartDatasets[period];
    this.chart.data.labels              = d.labels;
    this.chart.data.datasets[0].data   = d.target;
    this.chart.data.datasets[1].data   = d.est;
    this.chart.update('active');
  }

  // ── ACTIONS ───────────────────────────────────────────────────
  toggleTask(task: Task): void {
    task.done = !task.done;
    this.cdr.markForCheck();
  }

  startTask(task: Task, event: Event): void {
    event.stopPropagation();
    console.log('Start task:', task.name);
  }

  openProject(project: Project): void {
    console.log('Open project:', project.name);
  }

  addTask(): void {
    console.log('Add custom task');
  }

  newProject(): void {
    console.log('New project');
  }

  // ── HELPERS ───────────────────────────────────────────────────
  availabilityColor(pct: number): string {
    if (pct >= 75) return '#10B981';
    if (pct >= 45) return '#F59E0B';
    return '#EF4444';
  }

  statusLabel(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      IN_PROGRESS: 'In Progress',
      DELAYED:     'Delayed',
      COMPLETED:   'Completed',
    };
    return map[status];
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
} 
