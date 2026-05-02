import axios from "axios";

const PYTHON_API = "http://127.0.0.1:8000/predict";

/**
 * Fonction principale pour la prédiction ML
 * @param {Object} data - Données d'entrée pour la prédiction
 * @returns {Promise<number>} - Temps estimé en heures
 */
export async function predict(data) {
  try {
    const response = await axios.post(PYTHON_API, data);
    
    // Adapte selon le format de réponse de ton API FastAPI
    if (response.data.prediction !== undefined) {
      return response.data.prediction;
    }
    
    if (typeof response.data === 'number') {
      return response.data;
    }
    
    if (response.data.valeurPredite !== undefined) {
      return response.data.valeurPredite;
    }
    
    console.warn("Format de réponse inattendu:", response.data);
    return data.heure_estimee || 2;
    
  } catch (error) {
    console.error("❌ Erreur API ML:", error.message);
    return fallbackPrediction(data);
  }
}

/**
 * Fonction de fallback quand l'API ML n'est pas disponible
 */
function fallbackPrediction(data) {
  console.log("🔄 Utilisation du fallback ML");
  
  let baseHours = data.heure_estimee || 2;
  
  const complexityFactors = {
    'BASSE': 0.8,
    'MOYENNE': 1.0,
    'ELEVEE': 1.5
  };
  const complexityFactor = complexityFactors[data.complexite] || 1.0;
  
  const priorityFactors = {
    'BASSE': 0.9,
    'MOYENNE': 1.0,
    'HAUTE': 1.3
  };
  const priorityFactor = priorityFactors[data.priorite] || 1.0;
  
  const experienceFactor = Math.max(0.7, 1.0 - (data.experience_technicien || 0) * 0.05);
  
  const weatherFactors = {
    'SOLEIL': 1.0,
    'NUAGEUX': 1.1,
    'PLUIE': 1.3,
    'VENT_FORT': 1.2
  };
  const weatherFactor = weatherFactors[data.meteo] || 1.0;
  
  const seasonFactors = {
    'PRINTEMPS': 1.0,
    'ETE': 1.2,
    'AUTOMNE': 1.0,
    'HIVER': 1.1
  };
  const seasonFactor = seasonFactors[data.saison] || 1.0;
  
  let estimatedTime = baseHours * complexityFactor * priorityFactor * experienceFactor * weatherFactor * seasonFactor;
  estimatedTime = Math.round(estimatedTime * 2) / 2;
  
  return estimatedTime;
}

/**
 * Fonction predictTask pour la compatibilité
 */
export async function predictTask(data) {
  const prediction = await predict(data);
  return {
    valeurPredite: prediction,
    utilisateurIA: false,
    confiance: 0.60
  };
}

// ✅ AJOUT DE L'EXPORT PAR DÉFAUT
export default {
  predict,
  predictTask
};