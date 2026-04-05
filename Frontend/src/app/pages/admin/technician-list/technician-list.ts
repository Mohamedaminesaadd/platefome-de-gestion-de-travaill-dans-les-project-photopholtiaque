import { Component, OnInit } from '@angular/core';
import { Sidebar } from "../../../layout/sidbar/sidbar";
import { Topbar } from "../../../layout/topbar/topbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

// ── MODEL LOCAL ───────────────────────────────────────────────
export interface Technician {
  _id:           string;
  username:      string;
  email:         string;
  role:          string;
  specialite?:   string;
  tachesEnCours: number;
  disponible:    boolean;
}

@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [
    CommonModule, // ✅ *ngIf, *ngFor, ngClass
    FormsModule, // ✅ [(ngModel)]
    MatIconModule, // ✅ <mat-icon>
    MatRippleModule, // ✅ matRipple
    MatTooltipModule, // ✅ matTooltip
    MatDialogModule,
    Sidebar,
    Topbar
],
  templateUrl: './technician-list.html',
  styleUrls:   ['./technician-list.css']
})
export class TechnicianList implements OnInit {

  searchTerm       = '';
  filterDisponible = 'all'; // 'all' | 'disponible' | 'occupe'

  technicians: Technician[] = [
    { _id:'t1', username:'Amine Sadda',    email:'amine@mail.com',  role:'technician', specialite:'Électricité',  tachesEnCours:2, disponible:true  },
    { _id:'t2', username:'Sara Benmoussa', email:'sara@mail.com',   role:'technician', specialite:'Mécanique',    tachesEnCours:5, disponible:false },
    { _id:'t3', username:'Karim Ouali',    email:'karim@mail.com',  role:'technician', specialite:'Informatique', tachesEnCours:1, disponible:true  },
    { _id:'t4', username:'Nadia Ferhat',   email:'nadia@mail.com',  role:'technician', specialite:'Hydraulique',  tachesEnCours:4, disponible:false },
    { _id:'t5', username:'Youcef Amrani',  email:'youcef@mail.com', role:'technician', specialite:'Électricité',  tachesEnCours:0, disponible:true  },
    { _id:'t6', username:'Lina Hadjadj',   email:'lina@mail.com',   role:'technician', specialite:'Topographie',  tachesEnCours:3, disponible:true  },
  ];

  filtered: Technician[] = [];

  // ── INIT ──────────────────────────────────────────────────────
  ngOnInit(): void {
    this.filtered = [...this.technicians];
  }

  // ── FILTRE ────────────────────────────────────────────────────
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = this.technicians.filter(t => {
      const matchSearch =
        t.username.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term)    ||
        (t.specialite?.toLowerCase().includes(term) ?? false);

      const matchDispo =
        this.filterDisponible === 'all'        ? true :
        this.filterDisponible === 'disponible' ? t.disponible :
                                                 !t.disponible;
      return matchSearch && matchDispo;
    });
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