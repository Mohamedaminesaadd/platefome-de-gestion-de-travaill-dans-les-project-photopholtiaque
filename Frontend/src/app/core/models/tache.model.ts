export type StatutTache    = 'A FAIRE' | 'EN COURS' | 'EN REVUE' | 'ANNULEE' | 'BLOQUEE' | 'TERMINEE';
export type PrioriteTache  = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export type Complexite     = 'BASSE' | 'MOYENNE' | 'ELEVEE';

export interface Tache {
  _id?:           string;
  titre:          string;
  description?:   string;
  dateCreation?:  string;
  dateEcheance:   string;
  dateDebut?:     string;
  dateFin?:       string;
  heureEstimees:  number;
  heureRelles?:   number;
  statut?:        StatutTache;
  priorite?:      PrioriteTache;
  complexite?:    Complexite;
  cout?:          number;
  idPhase:        string;
  idUtilisateur?: string;
  createdAt?:     string;
  updatedAt?:     string;
}