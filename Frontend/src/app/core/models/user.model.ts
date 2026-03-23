export enum UserRole {
  ADMIN = 'Administrateur',
  DIRECTOR = 'Directeru', // Gardé tel quel selon ton diagramme
  TECHNICIAN = 'Technicien',
  PROJECT_MANAGER = 'ChefsProject'
}

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  motDepasse: string; // À ne pas afficher côté front en temps normal
  telephone: number;
  dateEmbauche: Date;
  photo: string; // URL de l'image (Image 2 - Avatar)
  actif: boolean;
  derniereConnexion: Date;
  role: UserRole;
  
  // Champs spécifiques du diagramme
  specialite?: string;      // Pour le Technicien
  certifications?: string;  // Pour le Technicien
}