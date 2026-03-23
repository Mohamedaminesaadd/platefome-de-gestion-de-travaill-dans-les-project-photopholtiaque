export interface Equipe {
  id: string;
  nom: string; // ex: "Team North", "Team South" (Image 2)
  description: string;
  dateCreation: Date;
  specialite: string; // ex: "Installation Photovoltaïque", "Maintenance"
  
  // Relations
  idChefEquipe: string; // ID d'un Utilisateur
  membresIds: string[]; // Liste des IDs des techniciens
}