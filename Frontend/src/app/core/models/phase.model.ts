export type StatutPhase = 'NON COMMENCEE' | 'EN COURS' | 'TERMINE' | 'BLOQUE' | 'EN ATTENTE';

export interface Phase {
  _id?:              string;
  nom:               string;
  description:       string;
  order:             number;
  dateDebutPrevue:   string;
  dateFinPrevue:     string;
  dateDebutReelle?:  string;
  dateFinReelle?:    string;
  dureeEstimee:      number;
  dureeReelle?:      number;
  avancement?:       number;
  statut?:           StatutPhase;
  idProject:         string;
  createdAt?:        string;
  updatedAt?:        string;
}