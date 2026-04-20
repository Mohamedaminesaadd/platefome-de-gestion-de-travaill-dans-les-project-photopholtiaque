from fastapi import FastAPI
import joblib
import numpy as np

# -------------------------------
# Charger le modèle UNE SEULE FOIS
# -------------------------------
path1 = "machineLearning/model_xgboost.pkl"
model = joblib.load(path1)
path="machineLearning/model_xgboost_tache1.pkl"
model_tache1 = joblib.load(path)

# -------------------------------
# Initialiser API
# -------------------------------
app = FastAPI()

# -------------------------------
# Endpoint de test
# -------------------------------
@app.get("/")
def home():
    return {"message": "API ML PV fonctionne 🚀"}

# -------------------------------
# Endpoint de prédiction
# -------------------------------
@app.post("/predict")
def predict(data: dict):

    # Transformer input en tableau
    features = np.array([[
        data["heure_estimee"],
        data["complexite"],
        data["priorite"],
        data["phase"],
        data["experience_technicien"],
        data["meteo"],
        data["saison"]
    ]])

    # Prédiction
    prediction = model.predict(features)[0]

    return {
        "valeurPredite": round(float(prediction), 2),
        "unite": "heures"
    }

# -------------------------------
# Endpoint de prédiction pour la tâche 1
# -------------------------------
@app.post("/predict_tache1")
def predict_tache1(data: dict):
    # Transformer input en tableau
    features = np.array([[
        data["heure_estimee"],
        data["complexite"],
        data["priorite"],
        data["tache"],
        data["experience_technicien"],
        data["meteo"],
        data["saison"]
    ]])

    # Prédiction
    prediction = model_tache1.predict(features)[0]

    return {
        "valeurPredite": round(float(prediction), 2),
        "unite": "heures"
    }