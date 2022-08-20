import { useState, useEffect, ChangeEventHandler } from "react"
import Loader from 'react-ts-loaders'
import { WeatherApiVariables } from "../../../variables"

export function WeatherApi() {

    const [cityName, setCityName] = useState<string>('')
    const [cityWeather, setCityWeather]: any = useState<{} | null>({})
    const [cityWeatherForecast, setCityWeatherForecast]: any = useState<{} | null>([])
    const [loading, setLoading] = useState<boolean>(false);

    async function getCurrentWeather(cityName: string): Promise<any> {
        setLoading(true)
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}`)
        const data = await response.json()
        return data
    }

    async function getWeatherForecast(cityName: string): Promise<any> {
        setLoading(true)
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}&days=${WeatherApiVariables.forecastDays}`)
        const data = await response.json()
        console.log(data.forecast)
        return data
    }

    useEffect(() => {
        async function fetchData() {
            const currentWeather = await getCurrentWeather(cityName)
            const weatherForecast = await getWeatherForecast(cityName)
            setCityWeather(currentWeather)
            setCityWeatherForecast(weatherForecast)
            setLoading(false);
        }
        fetchData()
    }, [cityName])

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: any): void => {
        const transformedText = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        setCityName(transformedText)
    }

    return (
        <>
            <section className="search-section">
                <div className="search-container">
                    <form className="search-form">
                        <input
                            onChange={handleChange}
                            placeholder="Digite o nome da cidade"
                        />
                    </form>
                </div>
            </section>

            <section className="current-weather-section">
                {loading ?
                    <Loader
                        type="dotspinner"
                        color="#0905a0"
                        size={150}
                        message="Buscando a cidade"
                    />
                    :
                    <>
                        {!cityWeather.location ? '' :
                            <div className="current-weather-container">
                                <h2> Condição climática atual em: {cityWeather.location.name}, {cityWeather.location.region}</h2>
                                <img alt='ícone da condição atual do tempo' src={cityWeather.current.condition.icon}></img>
                                <p>Condições climáticas: {cityWeather.current.condition.text}</p>
                                <span>Temperatura atual: {cityWeather.current.temp_c}</span>
                                <span>Sensação térmica: {cityWeather.current.feelslike_c}</span>
                            </div>}
                    </>
                }
            </section>

            <section className="weather-forecast-section">
                <>
                    {!cityWeatherForecast.forecast ? '' :
                        <div className="weather-forecast-container">
                            <h2>Previsão para os próximos dias</h2>
                            {cityWeatherForecast.forecast.forecastday.map((item: any) =>

                                <ul >
                                    <li>{item.date}</li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            )}
                        </div>
                    }
                </>

            </section>
        </>
    );
}