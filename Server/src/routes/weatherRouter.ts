import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const API_KEY = 'a0d41dbe7fb50e63f3f8c6265b6590d6'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWeatherData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching weather data');
  }
};

const extractCurrentWeatherData = (data: any) => {
  return {
    date: new Date(data.dt * 1000).toISOString().split('T')[0],
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    weather: data.weather.map((w: any) => ({
      main: w.main,
      description: w.description,
      icon: `http://openweathermap.org/img/wn/${w.icon}.png`
    })),
    pop: 0  // 현재 날씨에서는 강수 확률 데이터가 없으므로 0으로 설정
  };
};

const extractDailyWeatherData = (data: any) => {
  const dailyData = data.list.filter((entry: any) => entry.dt_txt.includes('12:00:00'));

  return dailyData.slice(0, 5).map((day: any) => ({
    date: day.dt_txt.split(' ')[0],
    temp_min: day.main.temp_min,
    temp_max: day.main.temp_max,
    weather: day.weather.map((w: any) => ({
      main: w.main,
      description: w.description,
      icon: `http://openweathermap.org/img/wn/${w.icon}.png`
    })),
    pop: day.pop ?? 0
  }));
};

const getWeatherHandler = async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: '위도 및 경도 정보가 필요합니다.' });
  }

  const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
  const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  try {
    const currentData = await getWeatherData(currentUrl);
    const forecastData = await getWeatherData(forecastUrl);

    const currentWeather = extractCurrentWeatherData(currentData);
    const forecastWeather = extractDailyWeatherData(forecastData);

    const weatherData = [currentWeather, ...forecastWeather];

    res.json(weatherData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 6일간의 일별 날씨
router.get('/weather/6days', (req: Request, res: Response) => getWeatherHandler(req, res));

export default router;
