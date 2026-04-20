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
  imports: [Sidebar, Topbar, ListProject],
  templateUrl: './proc.html',
  styleUrl: './proc.css',
})

export class Proc implements OnInit {


  ngOnInit(): void {}


} 
