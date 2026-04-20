import {} from "../services/ml.service.js"

export const mlpredict = async (req, res) => {
  try {
    const result = await Predict(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
};