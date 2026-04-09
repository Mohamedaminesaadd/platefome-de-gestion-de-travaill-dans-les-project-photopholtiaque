export enum EnumTypePrediction {
  DUREE = 'DUREE',
  COUT = 'COUT',
  RISQUE = 'RISQUE',
  RESSOURCE = 'RESSOURCE'
}

export interface Prediction {
  id: string;
  type: EnumTypePrediction;
  valeurPredite: number; 
  intervalleConfianceMin: number;
  intervalleConfianceMax: number;
  scoreConfiance: number;
  datePrediction: Date;
  raisonsRetard: string; 
  facteursInfluents: any; 
  modelVersion: string;
  idProject: string;
} 