import { useState, useEffect, ChangeEventHandler, createContext } from "react";
import Loader from "react-ts-loaders";
import { WeatherApiVariables } from "../../../variables";
import styles from "./weather-api.module.scss";

export const ThemeContext = createContext({});

export function WeatherApi() {
  const [cityName, setCityName] = useState<string>("0");
  const [cityWeather, setCityWeather]: any = useState<{}>({});
  const [cityWeatherForecast, setCityWeatherForecast]: any = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  async function getCurrentWeather(cityName: string): Promise<any> {
    setLoading(true);
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  }

  async function getWeatherForecast(cityName: string): Promise<any> {
    setLoading(true);
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}&days=${WeatherApiVariables.forecastDays}`
    );
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function fetchData() {
      const currentWeather = await getCurrentWeather(cityName);
      const weatherForecast = await getWeatherForecast(cityName);
      setCityWeather(currentWeather);
      setCityWeatherForecast(weatherForecast);
      setLoading(false);
    }
    fetchData();
  }, [cityName]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const transformedText = event.target.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setCityName(transformedText);
  };

  return (
    <section className={styles.main} id={styles[theme]}>
      <div className={styles.search_container}>
        <h2>Busque por uma cidade</h2>
        <form className={styles.search_form}>
          <input
            onChange={handleChange}
            placeholder="Ex: Blumenau, Santa Catarina"
          />
        </form>
      </div>

      <section className={styles.current_weather_section}>
        {loading ? (
          <Loader
            className="loader"
            type="roller"
            size={150}
           
          />
        ) : (
          <>
            {!cityWeather.location ? (
              ""
            ) : (
              <div className={styles.current_weather_container}>
                <h2> Condição climática atual em:</h2>
                <h3>
                  {cityWeather.location.name}, {cityWeather.location.region}
                </h3>
                <div className={styles.condition_container}>
                  <span>{cityWeather.current.condition.text}</span>
                  <img
                    alt="ícone da condição atual do tempo"
                    src={cityWeather.current.condition.icon}
                  ></img>
                </div>
                <span>Temperatura atual: {cityWeather.current.temp_c}</span>
                <span>Sensação térmica: {cityWeather.current.feelslike_c}</span>
              </div>
            )}
          </>
        )}
      </section>

      {!cityWeatherForecast.forecast ? (
        ""
      ) : (
        <div className={styles.weather_forecast_container}>
          <h2>Previsão para os próximos dias</h2>
          {cityWeatherForecast.forecast.forecastday.map((item: any) => {
            const dateUnix = (item.date_epoch + 86400) * 1000;
            const newDate = new Date(dateUnix);
            const forecastWeekDay = newDate.toLocaleString("pt-BR", {
              weekday: "long",
            });
            const forecastDay = newDate.toLocaleString("pt-BR", {
              day: "numeric",
            });

            return (
              <ul className={styles.weatherForecastList}>
                <li>
                  <h2>
                    {forecastWeekDay} - {forecastDay}
                  </h2>
                  <h3>{item.day.condition.text}</h3>
                  <p>
                    {item.day.daily_chance_of_rain} % -{" "}
                    {item.day.totalprecip_mm} mm
                  </p>
                  <img alt="ícone do clima" src={item.day.condition.icon} />
                  <p>🌡 {item.day.mintemp_c} °C</p>
                  <p>🌡 {item.day.maxtemp_c} °C</p>
                </li>
              </ul>
            );
          })}
        </div>
      )}
    </section>
  );
}
