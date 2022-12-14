import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "react-ts-loaders";

import { WeatherApiVariables } from "../../../variables";
import { inputSchema } from "../../../validations/schema";
import { ISearch } from "../../../Interfaces";

import lowTemperature from "../../../assets/icons/low-temperature-icon.svg";
import highTemperature from "../../../assets/icons/high-temperature-icon.svg";
import styles from "./weather-api.module.scss";

export function WeatherApi() {
  const [cityName, setCityName] = useState<string>("");
  const [cityWeather, setCityWeather]: any = useState<{}>({});
  const [cityWeatherForecast, setCityWeatherForecast]: any = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  }: any = useForm({
    resolver: yupResolver(inputSchema),
  });

  async function getCurrentWeather(cityName: string): Promise<any> {
    setLoading(true);
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WeatherApiVariables.token}&q=${cityName}&${WeatherApiVariables.airQuality}&${WeatherApiVariables.dataLanguage}`
    );
    const data = await response.json();
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

  const handleSearch = (data: ISearch) => {
    const transformedText = data.searchField
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    setCityName(transformedText);
    resetField("searchField");
  };

  return (
    <section className={styles.main}>
      <div className={styles.search_container}>
        <h2>Busque por uma cidade</h2>
        <form
          onSubmit={handleSubmit(handleSearch)}
          className={styles.search_form}
        >
          <input
            type="text"
            name="searchField"
            placeholder="Ex: Blumenau, Santa Catarina"
            {...register("searchField")}
          />
          <p>{errors.searchField?.message}</p>
          <input
            type="submit"
            className={styles.search_btn}
            value="Pesquisar"
          />
        </form>
      </div>

      <div className={styles.current_weather_section}>
        {loading ? (
          <Loader className="loader" type="roller" size={150} />
        ) : (
          <>
            {!cityWeather.location ? (
              ""
            ) : (
              <div className={styles.current_weather_container}>
                <h2> Condi????o clim??tica atual em:</h2>
                <h3>
                  {cityWeather.location.name}, {cityWeather.location.region}
                </h3>
                <div className={styles.condition_container}>
                  <span>{cityWeather.current.condition.text}</span>
                  <img
                    alt="??cone da condi????o atual do tempo"
                    src={cityWeather.current.condition.icon}
                  ></img>
                </div>
                <span>Temperatura atual: {cityWeather.current.temp_c} ??C</span>
                <span>
                  Sensa????o t??rmica: {cityWeather.current.feelslike_c} ??C
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {!cityWeatherForecast.forecast ? (
        ""
      ) : (
        <>
          <h2>Previs??o para os pr??ximos dias</h2>
          <section className={styles.weather_forecast_section}>
            {cityWeatherForecast.forecast.forecastday.map(
              (item: any, key: string) => {
                const dateUnix = (item.date_epoch + 86400) * 1000;
                const newDate = new Date(dateUnix);
                const forecastWeekDay = newDate.toLocaleString("pt-BR", {
                  weekday: "long",
                });
                const forecastDay = newDate.toLocaleString("pt-BR", {
                  day: "numeric",
                });
                return (
                  <ul key={key} className={styles.weather_forecast_list}>
                    <li>
                      <h2>
                        {forecastWeekDay} - {forecastDay}
                      </h2>
                      <div className={styles.forecast_condition_container}>
                        <span>{item.day.condition.text}</span>
                        <img
                          alt="??cone do clima"
                          src={item.day.condition.icon}
                        />
                      </div>
                      <p>
                        Prob. chuva: {item.day.daily_chance_of_rain} % -{" "}
                        {item.day.totalprecip_mm} mm
                      </p>
                      <p>
                        <img
                          src={lowTemperature}
                          alt="term??metro - Temperatura baixa"
                        />
                        {item.day.mintemp_c} ??C
                      </p>
                      <p>
                        <img
                          src={highTemperature}
                          alt="term??metro - Temperatura alta"
                        />
                        {item.day.maxtemp_c} ??C
                      </p>
                    </li>
                  </ul>
                );
              }
            )}
          </section>
        </>
      )}
    </section>
  );
}
