import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({ country }) => {
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(true)
    const api_key = import.meta.env.OPEN_WEATHER_API_KEY

    useEffect(() => {
        let capital_longitude = country.capitalInfo.latlng[1];
	    let capital_latitude = country.capitalInfo.latlng[0];
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${capital_latitude}&lon=${capital_longitude}&appid=${api_key}&units=metric`;
		axios.get(url).then(response => {
			console.log(response.data);
			setWeather(response.data);
            setLoading(false);
		});
	}, []);

    if (loading) {
        return (
            <div>
                Loading weather data...
            </div>
        )
    }

    return (
        <div>
            <h2>Weather in {country.capital}</h2>
            <div><b>temperature:</b> {weather.main.temp} Celsius</div>
            <img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt="weather icon"
			/>
            <div><b>wind:</b> {weather.wind.speed} m/s</div>
        </div>
    )
}

export default Weather