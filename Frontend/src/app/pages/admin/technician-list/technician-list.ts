import {
  Component, OnInit, AfterViewInit,
  ChangeDetectorRef, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Sidebar }   from '../../../layout/sidbar/sidbar';
import { Topbar }    from '../../../layout/topbar/topbar';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { MatIconModule }     from '@angular/material/icon';
import { MatRippleModule }   from '@angular/material/core';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { MatDialogModule }   from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

import { Technician, TechnicienService } from '../../../services/technicien';
import { TacheService } from '../../../services/tache-service';

Chart.register(...registerables);

// Interface enrichie avec les vrais compteurs de tâches
export interface TechnicianWithStats extends Technician {
  totalTaches    : number;   // toutes tâches assignées
  tachesTodo     : number;   // statut todo / a faire
  tachesEnCours  : number;   // statut in-progress / en cours
  tachesTerminees: number;   // statut done / terminee
  tachesEnRetard : number;   // deadline dépassée et non terminée
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
    Topbar,
  ],
  templateUrl: './technician-list.html',
  styleUrls:   ['./technician-list.css'],
})
export class TechnicianList implements OnInit, AfterViewInit {

  searchTerm       = '';
  filterDisponible = 'all';
  isLoading        = true;

  technicians: TechnicianWithStats[] = [];
  filtered:    TechnicianWithStats[] = [];
  skeletonItems = Array(6);

  private charts: Map<string, Chart> = new Map();

  constructor(
    private technicienService: TechnicienService,
    private tacheService     : TacheService,
    private cdr              : ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  // ── CHARGEMENT ─────────────────────────────────────────────────────────────
  private loadData(): void {
    forkJoin({
      techs : this.technicienService.getTechniciens(),
      taches: this.tacheService.getAll(),
    }).subscribe({
      next: ({ techs, taches }) => {

        const now = new Date();

        this.technicians = (techs as any[]).map(tech => {

          // Tâches assignées à ce technicien
          const myTasks = (taches as any[]).filter(t => {
            const assignedId = typeof t.assignedTo === 'object' && t.assignedTo !== null
              ? t.assignedTo._id ?? ''
              : t.assignedTo ?? '';
            return assignedId === tech._id;
          });

          const todo      = myTasks.filter(t => this.isTodo(t.status ?? t.statut)).length;
          const enCours   = myTasks.filter(t => this.isEnCours(t.status ?? t.statut)).length;
          const terminees = myTasks.filter(t => this.isDone(t.status ?? t.statut)).length;
          const enRetard  = myTasks.filter(t => {
            const dl = t.deadline ? new Date(t.deadline) : t.dateEcheance ? new Date(t.dateEcheance) : null;
            return dl && dl < now && !this.isDone(t.status ?? t.statut);
          }).length;

          return {
            ...tech,
            totalTaches    : myTasks.length,
            tachesTodo     : todo,
            tachesEnCours  : enCours,
            tachesTerminees: terminees,
            tachesEnRetard : enRetard,
            disponible     : enCours === 0,
            // ✅ Mock si le champ est absent ou vide
            efficacite     : (tech.efficacite && tech.efficacite.length > 0)
                               ? tech.efficacite
                               : this.mockEfficacite(),
          } as TechnicianWithStats;
        });

        this.filtered  = [...this.technicians];
        this.isLoading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.filtered.forEach(t => this.renderSparkline(t));
        }, 50);
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── MOCK EFFICACITE ────────────────────────────────────────────────────────
  /**
   * Génère 7 valeurs d'efficacité entre 30 et 100 avec une légère continuité,
   * simulant les données des 7 derniers jours.
   */
  private mockEfficacite(): number[] {
    const base = Math.floor(Math.random() * 40) + 50; // base entre 50 et 90
    return Array.from({ length: 7 }, (_, i) => {
      const delta = Math.floor(Math.random() * 20) - 10; // variation ±10
      return Math.min(100, Math.max(30, base + delta + i));
    });
  }

  // ── HELPERS STATUT ─────────────────────────────────────────────────────────
  private isTodo(s: string): boolean {
    return ['todo', 'a faire', 'a_faire'].includes((s ?? '').toLowerCase().trim());
  }
  private isEnCours(s: string): boolean {
    return ['in-progress', 'en cours', 'en_cours'].includes((s ?? '').toLowerCase().trim());
  }
  private isDone(s: string): boolean {
    return ['done', 'terminee', 'termine'].includes((s ?? '').toLowerCase().trim());
  }

  ngAfterViewInit(): void {}

  // ── SPARKLINE ──────────────────────────────────────────────────────────────
  private renderSparkline(t: TechnicianWithStats): void {
    const canvas = document.getElementById('spark-' + t._id) as HTMLCanvasElement;
    if (!canvas) return;

    const existing = this.charts.get(t._id);
    if (existing) { existing.destroy(); this.charts.delete(t._id); }

    const eff = t.efficacite ?? [];
    if (eff.length === 0) return;

    const avg   = this.effAvg(eff);
    const color = avg >= 80 ? '#10B981' : avg >= 60 ? '#F59E0B' : '#EF4444';
    const fill  = avg >= 80 ? 'rgba(16,185,129,0.12)'
                : avg >= 60 ? 'rgba(245,158,11,0.12)'
                :             'rgba(239,68,68,0.12)';

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        datasets: [{
          data            : eff,
          borderColor     : color,
          backgroundColor : fill,
          borderWidth     : 2,
          pointRadius     : 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
          fill   : true,
          tension: 0.4,
        }],
      },
      options: {
        responsive          : true,
        maintainAspectRatio : false,
        plugins: {
          legend : { display: false },
          tooltip: {
            callbacks       : { label: ctx => ` ${ctx.parsed.y}%` },
            backgroundColor : 'rgba(15,23,42,0.85)',
            titleFont       : { size: 11 },
            bodyFont        : { size: 11 },
            padding         : 6,
            cornerRadius    : 6,
          },
        },
        scales: {
          x: { display: false },
          y: { display: false, min: Math.min(...eff) - 10, max: 100 },
        },
      },
    });

    this.charts.set(t._id, chart);
  }

  private renderAllSparklines(): void {
    setTimeout(() => { this.filtered.forEach(t => this.renderSparkline(t)); }, 0);
  }

  // ── HELPERS UI ─────────────────────────────────────────────────────────────
  effAvg(eff: number[]): number {
    if (!eff || eff.length === 0) return 0;
    return Math.round(eff.reduce((a, b) => a + b, 0) / eff.length);
  }

  effClass(eff: number[]): string {
    const avg = this.effAvg(eff ?? []);
    return avg >= 80 ? 'good' : avg >= 60 ? 'mid' : 'low';
  }

  chargeLabel(t: TechnicianWithStats): string {
    const n = t.tachesEnCours;
    if (n === 0) return 'Libre';
    if (n <= 2)  return 'Légère';
    if (n <= 4)  return 'Modérée';
    return 'Élevée';
  }

  chargeClass(t: TechnicianWithStats): string {
    const n = t.tachesEnCours;
    if (n === 0) return 'charge-libre';
    if (n <= 2)  return 'charge-light';
    if (n <= 4)  return 'charge-medium';
    return 'charge-high';
  }

  chargePct(t: TechnicianWithStats): number {
    return Math.min(Math.round((t.tachesEnCours / 6) * 100), 100);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563EB', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  // ── FILTRE ─────────────────────────────────────────────────────────────────
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = this.technicians.filter(t => {
      const matchSearch =
        t.username.toLowerCase().includes(term)            ||
        t.email.toLowerCase().includes(term)               ||
        (t.specialite?.toLowerCase().includes(term) ?? false);

      const matchDispo =
        this.filterDisponible === 'all'         ? true          :
        this.filterDisponible === 'disponible'  ? t.disponible! :
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

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  onVoirTaches(tech: TechnicianWithStats) : void { console.log('Tâches:', tech.username); }
  onAssignerTache(tech: TechnicianWithStats): void { console.log('Assigner:', tech.username); }
  onVoirProfil(tech: TechnicianWithStats) : void { console.log('Profil:', tech.username); }

  trackById(_: number, tech: TechnicianWithStats): string { return tech._id; }
}