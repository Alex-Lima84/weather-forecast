import { useState, useEffect, ChangeEventHandler } from "react"
import Loader from 'react-ts-loaders'
import { WeatherApiVariables } from "../../../variables"

export function WeatherApi() {

    const [cityName, setCityName] = useState<string>('')
    const [cityWeather, setCityWeather]: any = useState<{} | null>({})
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: any): void => {
        const transformedText = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        setCityName(transformedText)
    }

    async function getCurrentWeather(cityName: string): Promise<any> {
        setLoading(true)
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}`)
        const data = await response.json()
        return data
    }

    useEffect(() => {
        async function fetchData() {
            const cityWeather = await getCurrentWeather(cityName)
            setCityWeather(cityWeather)
            setLoading(false);
        }
        fetchData()
    }, [cityName])

    return (
        <section>
            <div className="search-container">
                <form >
                    <input
                        onChange={handleChange}
                        placeholder="Digite o nome da cidade"
                    />
                </form>
            </div>

            {loading ?
                <Loader
                    type="dotspinner"
                    color="#0905a0"
                    size={150}
                    message="Buscando a cidade"
                />
                : <div className="weather-info-container">
                    {!cityWeather.location ? '' :
                        <div>
                            <h2> Previsão do tempo para: {cityWeather.location.name}, {cityWeather.location.region}</h2>
                            <img alt='ícone da condição do tempo' src={cityWeather.current.condition.icon}></img>
                            <p>Condições climáticas: {cityWeather.current.condition.text}</p>
                            <span>Temperatura atual: {cityWeather.current.temp_c}</span>
                            <span>Sensação térmica: {cityWeather.current.feelslike_c}</span>
                        </div>
                    }
                </div>}
        </section>
    );
}