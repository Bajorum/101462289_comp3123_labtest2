const fetchWeather = async (city) => {
  const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
};

export default fetchWeather;

