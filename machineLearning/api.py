from fastapi import FastAPI
import joblib
import numpy as np

# -------------------------------
# Charger le modèle UNE SEULE FOIS
# -------------------------------
model = joblib.load("model_xgboost.pkl")

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