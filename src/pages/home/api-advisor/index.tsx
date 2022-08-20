import { useState, useEffect, ChangeEventHandler, FormEventHandler } from "react"
import { ApiAdvisorVariables } from "../../../variables"

export function ApiAdvisor() {

    const [cityName, setCityName] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [cityInfo, setCityInfo]: any = useState<{} | null>([])
    const [cityWeather, setCityWeather]: any = useState<{} | null>([])
    const [cityId, setCityId] = useState<any>('')

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: any): void => {
        setValue(event.target.value)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any): void => {
        event.preventDefault()
        setCityName(value)
    }

    const handleClick: FormEventHandler<HTMLFormElement> = (id): void => {
        setCityId(id)
        console.log(cityId)
    }

    async function getCityId(cityName: string): Promise<any> {

        const response = await fetch(`http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${cityName}&token=${ApiAdvisorVariables.token}`)
        const data = await response.json()
        return data
    }

    async function getCurrentWeather(cityId: string): Promise<any> {

        const response = await fetch(`http://apiadvisor.climatempo.com.br/api/v1/weather/locale/${cityId}/current?token=${ApiAdvisorVariables.token}`)
        const data = await response.json()
        console.log(data)
        return data
    }

    useEffect(() => {
        async function fetchData() {
            const idInfo = await getCityId(cityName)
            const weatherInfo = await getCurrentWeather(cityId)
            setCityInfo(idInfo)
            setCityWeather(weatherInfo)          
        }
        fetchData()

    }, [cityName, cityId])

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

            <div className="weather-info-container">
                {cityInfo ? cityInfo.map((element: any, index: string) => { 
                    return (
                        <form key={index} onClick={() => handleClick(element.id)}> 
                            <h2> {element.name}, {element.state} </h2>
                        </form>
                    )
                }) : ''}
            </div>
        </section>
    );
}