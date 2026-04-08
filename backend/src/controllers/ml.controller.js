import { predict as mlPredict } from "../services/ml.service.js";

export const predict = async (req, res) => {
  try {
    const result = await mlPredict(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
};