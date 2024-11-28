import React, { useState } from "react";
import fetchWeather from "./api/weather"; 
import fetchForecast from "./api/forecast"; 
import "./App.css";

const App = () => {
    const [city, setCity] = useState("Toronto");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!city.trim()) {
            setError("City name cannot be empty.");
            setWeather(null);
            setForecast([]);
            return;
        }

        try {
            
            const currentWeather = await fetchWeather(city);

            
            const forecastData = await fetchForecast(city);

            if (currentWeather.cod !== 200 || forecastData.cod !== "200") {
                setError("City not found. Please try again.");
                setWeather(null);
                setForecast([]);
            } else {
                setWeather(currentWeather);
                setForecast(processForecast(forecastData.list));
                setError(null);
            }
        } catch (err) {
            setError("Error fetching weather data. Please try again.");
            setWeather(null);
            setForecast([]);
        }
    };

  
    const processForecast = (data) => {
        const dailyForecast = [];
        const seenDates = new Set();

        data.forEach((item) => {
            const date = item.dt_txt.split(" ")[0]; 
            if (!seenDates.has(date)) {
                dailyForecast.push(item); 
                seenDates.add(date);
            }
        });

        return dailyForecast;
    };

    return (
        <div className="app-container">
            <div className="weather-card">
                <div className="search-container">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name"
                        className="search-bar"
                    />
                    <button onClick={handleSearch} className="search-button">
                        Search
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {weather && (
                    <div className="main-weather-info">
                        <h2>{weather.name}, {weather.sys.country}</h2>
                        <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</p>
                        <h1>{Math.round(weather.main.temp)}°C</h1>
                        <p>{weather.weather[0]?.description}</p>
                    </div>
                )}
                {forecast.length > 0 && (
                    <div className="forecast-container">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-item">
                                <p>
                                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })}
                                </p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${day.weather[0]?.icon}@2x.png`}
                                    alt={day.weather[0]?.description || "Weather icon"}
                                />
                                <p>{Math.round(day.main.temp)}°C</p>
                            </div>
                        ))}
                    </div>
                )}
                {weather && (
                    <div className="additional-info">
                        <p>UV Index: 8 (Very High)</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Wind: {weather.wind.speed} km/h</p>
                        <p>Population: 23,355,000</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
