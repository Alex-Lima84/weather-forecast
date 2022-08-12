import { useState, useEffect, ChangeEventHandler, FormEventHandler } from "react"
import Loader from 'react-ts-loaders'
import { ApiAdvisorVariables } from "../../../variables"

export function ApiAdvisor() {

    const [cityName, setCityName] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [cityWeather, setCityWeather]: any = useState<{} | null>([])
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: any): void => {
        setValue(event.target.value)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any): void => {
        event.preventDefault()
        console.log(value)
        setCityName(value)
    }

    async function getCurrentWeather(cityName: string): Promise<any> {
        setLoading(true)
        const response = await fetch(`http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${cityName}&token=${ApiAdvisorVariables.token}`)
        const data = await response.json()
        return data
    }

    useEffect(() => {
        async function fetchData() {
            const dataWeather = await getCurrentWeather(cityName)
            setCityWeather(dataWeather)
            setLoading(false);
        }
        fetchData()
    }, [cityName])

    return (
        <section>

            <div className="search-container">
                <form onClick={handleSubmit}>
                    <input
                        onChange={handleChange}
                        placeholder="Digite o nome da cidade"
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
                /> :
                <div className="weather-info-container">
                    {cityWeather ? cityWeather.map((index: any, key: string) => {
                        return (
                            <div>
                                <h2 key={key}> {index.name}, {index.state} </h2>
                            </div>
                        )
                    }) : ''}
                </div>}

        </section>
    );
}