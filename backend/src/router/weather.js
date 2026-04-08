import express from "express";
import { fetchWeatherApi } from "openmeteo";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // ✅ récupérer query correctement
    const { latitude, longitude } = req.query;

    // ❌ validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "latitude et longitude sont obligatoires",
      });
    }

    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "rain",
        "snowfall",
        "dew_point_2m",
        "apparent_temperature",
        "precipitation_probability",
        "precipitation",
      ],
      forecast_days: 14,
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();

    const weatherData = {
      time: Array.from(
        {
          length:
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        },
        (_, i) =>
          new Date(
            (Number(hourly.time()) +
              i * hourly.interval() +
              utcOffsetSeconds) *
              1000
          )
      ),

      temperature: hourly.variables(0).valuesArray(),
      humidity: hourly.variables(1).valuesArray(),
      rain: hourly.variables(2).valuesArray(),
      wind: hourly.variables(3)?.valuesArray?.() || [],
    };

    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur météo",
      details: error.message,
    });
  }
});

export default router;