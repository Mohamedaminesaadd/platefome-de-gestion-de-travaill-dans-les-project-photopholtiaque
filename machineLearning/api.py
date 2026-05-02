from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import os

# -------------------------------
# Chemins robustes
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ❌ SUPPRIMÉ model_xgboost.pkl (il n'existe pas)
path2 = os.path.join(BASE_DIR, "model_xgboost_tache1.pkl")

# -------------------------------
# API
# -------------------------------
app = FastAPI()

# -------------------------------
# Charger modèle
# -------------------------------
try:
    model_tache1 = joblib.load(path2)
except Exception as e:
    raise RuntimeError(f"Erreur chargement modèle: {e}")


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
# Lancement serveur
# -------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)