export type StatutProject = 'PLANIFIE' | 'EN COURS' | 'EN RETARD' | 'SUSPENDU' | 'TERMINE' | 'ANNULE';
export type Priorite      = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';

export interface Project {
  _id?:           string;
  codeProject:    string;
  nom:            string;
  description?:   string;
  dateDebut:      string;
  dateFinPrevue:  string;//predicte with the machine learning with the help of the product mananger 
  dateFinReelle?: string;
  tempsPredict?:   number;//predicte with the machine learning with the help of the product mananger 
  budgetTotale:   number;
  budgetConsomme?: number;
  coordonnesGPS?: string;
  adresse?:       string;
  ville?:         string;
  codePostal?:    string;
  priorite:       Priorite;
  statut?:        StatutProject;
  idEquipe?:      string;
  idChefProject?: string;
  createdAt?:     string;
  updatedAt?:     string;
}
//ajoute le valeur de tempsPredict dans le interface de project 