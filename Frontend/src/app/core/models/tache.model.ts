// ── src/app/core/models/tache.model.ts ──────────────────────────────────────

export type StatutTache   = 'A FAIRE' | 'EN COURS' | 'TERMINEE';
export type PrioriteTache = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export type Complexite    = 'BASSE' | 'MOYENNE' | 'ELEVEE';

export interface TimeTracking {
  startTime?:   string;
  pauseTotal?:  number;
  pauseHistory?: { debut: string; fin: string }[];
}
export interface Tache {
  _id:            string;
  titre:          string;
  description?:   string;
  dateCreation?:  string;
  dateEcheance?:  string;
  dateDebut?:     string;
  dateFin?:       string;
  heureEstimees:  number;
  heureRelles?:   number;
  statut:         StatutTache;
  priorite:       PrioriteTache;
  complexite?:    Complexite;
  cout?:          number;
  idPhase:        string;
  idProject?:     string;
  idUtilisateur?: string;
  assigneNom?:    string;
  assigneEmail?:  string;
  createdAt?:     string;
  updatedAt?:     string;
}

