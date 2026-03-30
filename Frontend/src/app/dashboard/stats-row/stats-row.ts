
import {
  Component,
  
} from '@angular/core';
import { CommonModule } from '@angular/common';


// Angular Material

import { MatIcon}        from '@angular/material/icon';

export type Priority      = 'HIGH' | 'MEDIUM' | 'LOW';
export interface Task {
  id: string;
  name: string;
  time: string;
  duration: string;
  priority: Priority;
  done: boolean;
}

@Component({
  selector: 'app-stats-row',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './stats-row.html',
  styleUrl: './stats-row.css',
})
export class StatsRow {

   tasks: Task[] = [
    { id:'t1', name:'Site survey: Sector 4',  time:'09:00 AM', duration:'2h',   priority:'HIGH',   done:false },
    { id:'t2', name:'Inverter inspection',     time:'11:30 AM', duration:'1.5h', priority:'MEDIUM', done:false },
    { id:'t3', name:'Permit review meeting',   time:'02:00 PM', duration:'1h',   priority:'LOW',    done:false },
    { id:'t4', name:'Team safety briefing',    time:'04:30 PM', duration:'30m',  priority:'HIGH',   done:false },
  ];

  get pendingCount(): number {
    return this.tasks.filter(t => !t.done).length;
  }

    get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
  }

}
