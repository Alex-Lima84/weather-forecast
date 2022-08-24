import { useState, useEffect, ChangeEventHandler } from "react"
import Loader from 'react-ts-loaders'
import { WeatherApiVariables } from "../../../variables"
import './styles.scss'

export function WeatherApi() {

    const [cityName, setCityName] = useState<string>('')
    const [cityWeather, setCityWeather]: any = useState<{} | null>({})
    const [cityWeatherForecast, setCityWeatherForecast]: any = useState<[] | null>([])
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
        <section className="main-section">

            <div className="search-container">
                <form className="search-form">
                    <input
                        onChange={handleChange}
                        placeholder="Digite o nome da cidade"
                    />
                </form>
            </div>

            <div className="current-weather-section">
                {loading ?
                    <Loader
                        type="dotspinner"
                        color="#002B5B"
                        size={150}
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
            </div>


            {!cityWeatherForecast.forecast ? '' :
                <div className="weather-forecast-container">
                    <h2>Previsão para os próximos dias</h2>
                    {cityWeatherForecast.forecast.forecastday.map((item: any) => {
                        const dateUnix = ((item.date_epoch + 86400) * 1000)
                        const newDate = new Date(dateUnix)
                        const forecastWeekDay = newDate.toLocaleString("pt-BR", { weekday: "long" })
                        const forecastDay = newDate.toLocaleString("pt-BR", { day: "numeric" })

                        return (
                            <li>
                                <h2>{forecastWeekDay} - {forecastDay}</h2>
                                <h3>{item.day.condition.text}</h3>
                                <p>{item.day.daily_chance_of_rain} % - {item.day.totalprecip_mm} mm</p>
                                <img alt="ícone do clima" src={item.day.condition.icon} />
                                <p>🌡 {item.day.mintemp_c} °C</p>
                                <p>🌡 {item.day.maxtemp_c} °C</p>
                            </li>
                        )
                    }
                    )}
                </div>
            }

        </section>
    );
}