import { EnumPriorite } from "./project.model";

export enum EnumStatutTache {
  A_FAIRE = 'A FAIRE',
  EN_COURS = 'EN COURS',
  EN_REVUE = 'EN REVUE',
  ANNULEE = 'ANNULEE',
  BLOQUEE = 'BLOQUEE',
  TERMINEE = 'TERMINEE'
}

export interface Tache {
  id: string;
  titre: string;
  description: string;
  
  // Dates et Temps (Image 4 & 10)
  dateCreation: Date;
  dateEcheance: Date; // La "Due Date" sur le Kanban
  dateDebut?: Date;
  dateFin?: Date;
  
  // Suivi du temps (Vu sur le Dashboard Technicien)
  heureEstimees: number; // ex: 2h
  heureRelles: number;    // Le temps vraiment passé
  
  // État et Importance
  statut: EnumStatutTache;
  priorite: EnumPriorite; // Réutilise l'EnumPriorite du modèle Project
  complexite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
  
  // Financier
  cout: number;

  // Relations
  idPhase: string;       // La phase parente
  idUtilisateur?: string; // Le technicien assigné (Image 10 - petit avatar)
}