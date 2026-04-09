import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Sidebar } from "../../../layout/sidbar/sidbar";
import { Topbar } from "../../../layout/topbar/topbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// ── INTERFACE ─────────────────────────────────────────────────
export interface Technician {
  _id:           string;
  username:      string;
  email:         string;
  role:          string;
  specialite?:   string;
  tachesEnCours: number;
  disponible:    boolean;
  efficacite:    number[];
}

@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    Sidebar,
    Topbar
  ],
  templateUrl: './technician-list.html',
  styleUrls:   ['./technician-list.css']
})
export class TechnicianList implements OnInit, AfterViewInit {

  searchTerm       = '';
  filterDisponible = 'all';

  technicians: Technician[] = [
    { _id:'t1', username:'Amine Sadda',    email:'amine@mail.com',  role:'technician', specialite:'Électricité',  tachesEnCours:2, disponible:true,  efficacite:[72,75,68,80,85,78,88] },
    { _id:'t2', username:'Sara Benmoussa', email:'sara@mail.com',   role:'technician', specialite:'Mécanique',    tachesEnCours:5, disponible:false, efficacite:[50,45,55,48,52,46,44] },
    { _id:'t3', username:'Karim Ouali',    email:'karim@mail.com',  role:'technician', specialite:'Informatique', tachesEnCours:1, disponible:true,  efficacite:[90,88,92,95,91,94,96] },
    { _id:'t4', username:'Nadia Ferhat',   email:'nadia@mail.com',  role:'technician', specialite:'Hydraulique',  tachesEnCours:4, disponible:false, efficacite:[60,55,62,58,65,60,57] },
    { _id:'t5', username:'Youcef Amrani',  email:'youcef@mail.com', role:'technician', specialite:'Électricité',  tachesEnCours:0, disponible:true,  efficacite:[82,80,85,88,84,90,87] },
    { _id:'t6', username:'Lina Hadjadj',   email:'lina@mail.com',   role:'technician', specialite:'Topographie',  tachesEnCours:3, disponible:true,  efficacite:[70,74,72,78,76,80,79] },
  ];

  filtered: Technician[] = [];

  private charts: Map<string, Chart> = new Map();

  // ── LIFECYCLE ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.filtered = [...this.technicians];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filtered.forEach(t => this.renderSparkline(t));
    }, 0);
  }

  // ── SPARKLINE ─────────────────────────────────────────────────
  private renderSparkline(t: Technician): void {
    const canvas = document.getElementById('spark-' + t._id) as HTMLCanvasElement;
    if (!canvas) return;

    const existing = this.charts.get(t._id);
    if (existing) {
      existing.destroy();
      this.charts.delete(t._id);
    }

    const avg   = this.effAvg(t.efficacite);
    const color = avg >= 80 ? '#10B981' : avg >= 60 ? '#F59E0B' : '#EF4444';
    const fill  = avg >= 80 ? 'rgba(16,185,129,0.12)' : avg >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        datasets: [{
          data: t.efficacite,
          borderColor: color,
          backgroundColor: fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.parsed.y}%` },
            backgroundColor: 'rgba(15,23,42,0.85)',
            titleFont: { size: 11 },
            bodyFont:  { size: 11 },
            padding: 6,
            cornerRadius: 6
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            min: Math.min(...t.efficacite) - 10,
            max: 100
          }
        }
      }
    });

    this.charts.set(t._id, chart);
  }

  private renderAllSparklines(): void {
    setTimeout(() => {
      this.filtered.forEach(t => this.renderSparkline(t));
    }, 0);
  }

  // ── EFFICACITÉ ────────────────────────────────────────────────
  effAvg(eff: number[]): number {
    return Math.round(eff.reduce((a, b) => a + b, 0) / eff.length);
  }

  effClass(eff: number[]): string {
    const avg = this.effAvg(eff);
    return avg >= 80 ? 'good' : avg >= 60 ? 'mid' : 'low';
  }

  // ── FILTRE ────────────────────────────────────────────────────
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = this.technicians.filter(t => {
      const matchSearch =
        t.username.toLowerCase().includes(term)              ||
        t.email.toLowerCase().includes(term)                 ||
        (t.specialite?.toLowerCase().includes(term) ?? false);

      const matchDispo =
        this.filterDisponible === 'all'        ? true         :
        this.filterDisponible === 'disponible' ? t.disponible :
                                                 !t.disponible;
      return matchSearch && matchDispo;
    });

    this.renderAllSparklines();
  }

  setFilter(val: string): void {
    this.filterDisponible = val;
    this.applyFilter();
  }

  // ── AVATAR ────────────────────────────────────────────────────
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563EB', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  // ── CHARGE ────────────────────────────────────────────────────
  chargeLabel(taches: number): string {
    if (taches === 0) return 'Libre';
    if (taches <= 2)  return 'Légère';
    if (taches <= 4)  return 'Modérée';
    return 'Élevée';
  }

  chargeClass(taches: number): string {
    if (taches === 0) return 'charge-libre';
    if (taches <= 2)  return 'charge-light';
    if (taches <= 4)  return 'charge-medium';
    return 'charge-high';
  }

  // ── ACTIONS ───────────────────────────────────────────────────
  onVoirTaches(tech: Technician): void {
    console.log('Voir tâches:', tech.username);
  }

  onAssignerTache(tech: Technician): void {
    console.log('Assigner tâche à:', tech.username);
  }

  onVoirProfil(tech: Technician): void {
    console.log('Profil:', tech.username);
  }

  trackById(index: number, tech: Technician): string {
    return tech._id;
  }
}