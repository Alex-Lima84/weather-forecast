import { useState, useEffect, FormEventHandler, ChangeEventHandler } from "react"
import Loader from 'react-ts-loaders'

const token: string = '7ebe7c2a03cd48c090a193437222905'
const airQuality = 'aqi=no'
const dataLanguage = 'lang=pt'

export function WeatherInfo() {

    const [cityName, setCityName] = useState<string>('')
    const [cityWeather, setCityWeather]: any = useState<{} | null>({})
    const [value, setValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: any): void => {
        setValue(event.target.value)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any): void => {
        event.preventDefault()
        const transformedText = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        setCityName(transformedText)
    }

    async function getCurrentWeather(cityName: string): Promise<any> {
        setLoading(true)
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${token}&q=${cityName}&${airQuality}&${dataLanguage}`)
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
        <>
            <div>
                <form onSubmit={handleSubmit} >
                    <input
                        onChange={handleChange}
                        placeholder="Type here"
                    />
                    <button>Search</button>
                </form>
            </div>

            {loading ?
                <Loader
                    type="dotspinner"
                    color="#0905a0"
                    size={150}
                    message="Buscando a cidade"
                />
                : <div>
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
        </>
    );

}