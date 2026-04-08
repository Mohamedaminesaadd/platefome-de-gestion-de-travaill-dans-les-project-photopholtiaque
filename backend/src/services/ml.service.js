import axios from "axios";

const PYTHON_API = "http://127.0.0.1:8000/predict";

export async function predict(data) {
  try {
    const response = await axios.post(PYTHON_API, data);
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error.message);
    throw error;
  }
}