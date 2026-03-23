export enum EnumTypeRapport {
  PERFORMANCE = 'PERFORMANCE',
  INCIDENT = 'INCIDENT',
  FINANCIER = 'FINANCIER',
  AVANCEMENT = 'AVANCEMENT'
}

export interface Rapport {
  id: string;
  titre: string;
  type: EnumTypeRapport;
  periodeDebut: Date;
  periodeFin: Date;
  dateGeneration: Date;
  format: 'PDF' | 'EXCEL' | 'JSON';
  
  // Le contenu brut ou lien vers le fichier
  donnees: any; 
  
  // Relation
  idProject: string;
  genereParId: string; // ID du Directeur ou Chef de projet
}