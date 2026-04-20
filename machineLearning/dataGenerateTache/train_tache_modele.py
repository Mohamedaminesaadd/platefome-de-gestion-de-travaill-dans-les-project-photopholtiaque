import joblib
import pandas as pd
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor


#-------------------------------
# 1. Charger dataset
#-------------------------------
path_relative = "machineLearning/dataset_pv_meteo.csv"
df = pd.read_csv(path_relative)


#-------------------------------
# 2. Séparer X et y
#-------------------------------
X = df.drop("duree_reelle",axis=1)
y = df["duree_reelle"]

#-------------------------------
# 3. Split (train / test)
#-------------------------------
X_train, X_test, y_train, y_test = train_test_split(X,y, test_size=0.2, random_state=42)

#-------------------------------
# 4. Créer modèle XGBoost
#-------------------------------
model = XGBRegressor(
    n_estimators=100,
    learning_rate= 0.1,
    max_depth=5 
)

#-------------------------------
# 5. Entraînement
#-------------------------------
model.fit(X_train, y_train)

#-------------------------------
# 6. Prédiction
#-------------------------------
y_pred = model.predict(X_test)

#-------------------------------
# 7. Évaluation
#-------------------------------

mae = mean_absolute_error(y_test, y_pred)
print("Erreur MAE :", round(mae,2), "heures")

#-------------------------------
# 8. Sauvegarde modèle
#-------------------------------
joblib.dump(model, "model_xgboost_tache1.pkl")