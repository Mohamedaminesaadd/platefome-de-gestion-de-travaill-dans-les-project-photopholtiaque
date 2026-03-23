export enum EnumTypeCommentaire {
  NOTE = 'NOTE',
  ALERTE = 'ALERTE',
  UPDATE = 'UPDATE'
}

export interface Commentaire {
  id: string;
  contenu: string;
  dateCreation: Date;
  dateModification?: Date;
  type: EnumTypeCommentaire;
  
  // Relations
  idUtilisateur: string; // Qui a écrit ?
  idTache?: string;      // Lié à une tâche précise ?
  idProject?: string;    // Ou au projet global ?
}