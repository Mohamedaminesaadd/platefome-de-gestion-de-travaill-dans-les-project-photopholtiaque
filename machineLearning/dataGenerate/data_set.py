import random
import pandas as pd

# -------------------------------
# CONFIGURATION
# -------------------------------
N = 1000

complexite_map = {"BASSE": 1, "MOYENNE": 2, "ELEVEE": 3}
priorite_map = {"BASSE": 1, "MOYENNE": 2, "HAUTE": 3, "CRITIQUE": 4}

phases = ["ETUDE", "DEVIS", "INSTALLATION", "CONTROLE", "MISE_SERVICE"]

meteo_types = ["SOLEIL", "NUAGEUX", "PLUIE", "VENT_FORT"]
saisons = ["PRINTEMPS", "ETE", "AUTOMNE", "HIVER"]

# -------------------------------
# IMPACT METEO (IMPORTANT)
# -------------------------------
impact_meteo = {
    "SOLEIL": -1.0,
    "NUAGEUX": 0.0,
    "PLUIE": +2.0,
    "VENT_FORT": +3.0
}

impact_saison = {
    "PRINTEMPS": 0.0,
    "ETE": -1.0,
    "AUTOMNE": +1.0,
    "HIVER": +2.0
}

# -------------------------------
# GENERATION
# -------------------------------
data = []

for i in range(N):
    complexite = random.choice(list(complexite_map.keys()))
    priorite = random.choice(list(priorite_map.keys()))
    phase = random.choice(phases)
    meteo = random.choice(meteo_types)
    saison = random.choice(saisons)

    heure_estimee = random.randint(2, 20)
    experience_tech = round(random.uniform(0.5, 2.0), 2)

    # -------------------------------
    # FORMULE REALISTE
    # -------------------------------
    base = heure_estimee

    facteur_complexite = complexite_map[complexite] * 0.7
    facteur_priorite = -0.3 * priorite_map[priorite]
    facteur_experience = -0.6 * experience_tech

    facteur_meteo = impact_meteo[meteo]
    facteur_saison = impact_saison[saison]

    bruit = random.uniform(-1.5, 1.5)

    duree_reelle = (
        base
        + facteur_complexite
        + facteur_priorite
        + facteur_experience
        + facteur_meteo
        + facteur_saison
        + bruit
    )

    duree_reelle = max(1, round(duree_reelle, 2))

    data.append({
        "heure_estimee": heure_estimee,
        "complexite": complexite_map[complexite],
        "priorite": priorite_map[priorite],
        "phase": phases.index(phase),
        "experience_technicien": experience_tech,
        "meteo": meteo_types.index(meteo),
        "saison": saisons.index(saison),
        "duree_reelle": duree_reelle
    })

# -------------------------------
# DATAFRAME
# -------------------------------
df = pd.DataFrame(data)

df.to_csv("dataset_pv_meteo.csv", index=False)

print("Dataset avec météo et saison généré !")
print(df.head())