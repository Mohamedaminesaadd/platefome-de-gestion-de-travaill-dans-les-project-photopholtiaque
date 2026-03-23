export enum EnumTypePrediction {
  DUREE = 'DUREE',
  COUT = 'COUT',
  RISQUE = 'RISQUE',
  RESSOURCE = 'RESSOURCE'
}

export interface Prediction {
  id: string;
  type: EnumTypePrediction;
  
  // La valeur centrale (ex: "45 days" sur l'Image 7)
  valeurPredite: number; 
  
  // L'intervalle de confiance (ex: "40 - 52 days")
  intervalleConfianceMin: number;
  intervalleConfianceMax: number;
  
  // Le pourcentage de certitude (ex: "85% Confidence")
  scoreConfiance: number;
  
  datePrediction: Date;
  
  // Facteurs d'influence (ex: Météo, Complexité du site)
  // On utilise 'any' ou un objet JSON pour stocker les raisons du retard
  facteursInfluents: any; 
  
  modelVersion: string;
  
  // Relation
  idProject: string;
}