import joblib
import numpy as np

# -------------------------------
# Charger le modèle
# -------------------------------
model = joblib.load("model_xgboost.pkl")

# -------------------------------
# Exemple nouvelle tâche
# (IMPORTANT : même ordre que training)
# -------------------------------
nouvelle_tache = np.array([[
    10,  # heure_estimee
    3,   # complexite
    4,   # priorite
    2,   # phase
    1.2, # experience_technicien
    2,   # meteo (PLUIE)
    3    # saison (HIVER)
]])

# -------------------------------
# Prédiction
# -------------------------------
prediction = model.predict(nouvelle_tache)

print("Durée prédite :", round(prediction[0], 2), "heures")