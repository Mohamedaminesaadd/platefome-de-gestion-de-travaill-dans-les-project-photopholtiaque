import { Component, OnInit, AfterViewInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Sidebar } from "../../../layout/sidbar/sidbar";
import { Topbar } from "../../../layout/topbar/topbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';

import { Technician, TechnicienService } from '../../../services/technicien';

Chart.register(...registerables);

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
  isLoading        = true;

  technicians: Technician[] = [];
  filtered:    Technician[] = [];
  skeletonItems = Array(6);

  private charts: Map<string, Chart> = new Map();

  constructor(
    private technicienService: TechnicienService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object  // ✅
  ) {}

  ngOnInit(): void {
    // ✅ Exécute uniquement dans le navigateur, pas sur le serveur SSR
    if (isPlatformBrowser(this.platformId)) {
      this.loadTechniciens();
    }
  }

  private loadTechniciens(): void {
    this.technicienService.getTechniciens().subscribe({
      next: (data) => {
        this.technicians = data;
        this.filtered    = [...data];
        this.isLoading   = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.filtered.forEach(t => this.renderSparkline(t));
        }, 50);
      },
      error: (err) => {
        console.error('Erreur chargement techniciens:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {}

  private renderSparkline(t: Technician): void {
    const canvas = document.getElementById('spark-' + t._id) as HTMLCanvasElement;
    if (!canvas) return;

    const existing = this.charts.get(t._id);
    if (existing) {
      existing.destroy();
      this.charts.delete(t._id);
    }

    const eff = t.efficacite ?? [];
    if (eff.length === 0) return;

    const avg   = this.effAvg(eff);
    const color = avg >= 80 ? '#10B981' : avg >= 60 ? '#F59E0B' : '#EF4444';
    const fill  = avg >= 80 ? 'rgba(16,185,129,0.12)' : avg >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        datasets: [{
          data: eff,
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
            min: Math.min(...eff) - 10,
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

  effAvg(eff: number[]): number {
    if (!eff || eff.length === 0) return 0;
    return Math.round(eff.reduce((a, b) => a + b, 0) / eff.length);
  }

  effClass(eff: number[]): string {
    const avg = this.effAvg(eff ?? []);
    return avg >= 80 ? 'good' : avg >= 60 ? 'mid' : 'low';
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = this.technicians.filter(t => {
      const matchSearch =
        t.username.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term)    ||
        (t.specialite?.toLowerCase().includes(term) ?? false);

      const matchDispo =
        this.filterDisponible === 'all'        ? true         :
        this.filterDisponible === 'disponible' ? t.disponible :
                                                 !t.disponible;
      return matchSearch && matchDispo;
    });
    this.cdr.detectChanges();
    this.renderAllSparklines();
  }

  setFilter(val: string): void {
    this.filterDisponible = val;
    this.applyFilter();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563EB', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    return colors[name.charCodeAt(0) % colors.length];
  }

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