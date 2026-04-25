from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import os

# -------------------------------
# Chemins robustes (important)
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

path1 = os.path.join(BASE_DIR, "model_xgboost.pkl")
path2 = os.path.join(BASE_DIR, "model_xgboost_tache1.pkl")

# -------------------------------
# Charger les modèles UNE SEULE FOIS
# -------------------------------
try:
    model = joblib.load(path1)
    model_tache1 = joblib.load(path2)
except Exception as e:
    raise RuntimeError(f"Erreur chargement modèles: {e}")

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
# Endpoint de prédiction principal
# -------------------------------
@app.post("/predict")
def predict(data: dict):
    try:
        features = np.array([[
            data["heure_estimee"],
            data["complexite"],
            data["priorite"],
            data["phase"],
            data["experience_technicien"],
            data["meteo"],
            data["saison"]
        ]])

        prediction = model.predict(features)[0]

        return {
            "valeurPredite": round(float(prediction), 2),
            "unite": "heures"
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Champ manquant: {e}")

# -------------------------------
# Endpoint de prédiction tâche 1
# -------------------------------
@app.post("/predict_tache1")
def predict_tache1(data: dict):
    try:
        features = np.array([[
            data["heure_estimee"],
            data["complexite"],
            data["priorite"],
            data["tache"],
            data["experience_technicien"],
            data["meteo"],
            data["saison"]
        ]])

        prediction = model_tache1.predict(features)[0]

        return {
            "valeurPredite": round(float(prediction), 2),
            "unite": "heures"
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Champ manquant: {e}")

# -------------------------------
# Lancement serveur (optionnel)
# -------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)