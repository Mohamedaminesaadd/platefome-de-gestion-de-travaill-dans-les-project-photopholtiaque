// On définit d'abord les énumérations pour sécuriser les données
export enum EnumStatutProject {
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'EN COURS',
  EN_RETARD = 'EN RETARD',
  SUSPENDU = 'SUSPENDU',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export enum EnumPriorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  CRITIQUE = 'CRITIQUE'
}

export interface Project {
  // Informations d'identification
  id: string;
  codeProject: string; // Ex: PV-2024-001 (vu sur l'Image 5)
  nom: string;
  description: string;

  // Dates (Utilise le type Date d'Angular/JS)
  dateDebut: Date;
  dateFinPrevue: Date;
  dateFinReelle?: Date; // Optionnel car vide au début

  // Données financières (Image 2 & 5)
  budgetTotale: number;
  budgetConsomme: number;

  // Localisation
  coordonnesGPS: string;
  adresse: string;
  ville: string;
  codePostal: string;

  // État du projet
  priorite: EnumPriorite;
  statut: EnumStatutProject;

  // Relations (Liens vers les autres modèles que nous créerons après)
  // On les met en optionnel (?) pour que le modèle fonctionne même si les données ne sont pas chargées
  idEquipe?: string; 
  idChefProject?: string;
}