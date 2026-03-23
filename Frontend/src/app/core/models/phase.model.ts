export enum EnumStatutPhase {
  NOM_COMMENCEE = 'NOM COMMENCEE',
  EN_COURS = 'EN COURS',
  TERMINE = 'TERMINE',
  BLOQUE = 'BLOQUE',
  EN_ATTENTE = 'EN ATTENTE'
}

export interface Phase {
  id: string;
  nom: string;
  description: string;
  order: number; // Pour l'ordre d'affichage dans le Gantt
  
  // Dates issues de ton diagramme
  dateDebutPrevenue: Date;
  dateFinPrevue: Date;
  dateDebutRelle?: Date;
  dateFinReelle?: Date;
  
  // Calculs
  dureeEstimee: number; // en jours
  dureeRelle?: number;
  avancement: number; // Pour la barre de progression (ex: "85% Complete" sur l'Image 6)
  
  statut: EnumStatutPhase;
  
  // Relation
  idProject: string;
}