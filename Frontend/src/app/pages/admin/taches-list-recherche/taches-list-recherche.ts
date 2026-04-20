// src/app/pages/admin/taches-list-recherche/taches-list-recherche.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../../layout/sidbar/sidbar";
import { Topbar } from "../../../layout/topbar/topbar";

// ✅ chemin corrigé avec (phase-tache)
import { TaskManagementComponent } from "../../../(phase-tache)/task-management/task-management";

@Component({
  selector: 'app-taches-list-recherche',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    TaskManagementComponent
  ],
  templateUrl: './taches-list-recherche.html',
  styleUrl: './taches-list-recherche.css',
})
export class TachesListRecherche {}