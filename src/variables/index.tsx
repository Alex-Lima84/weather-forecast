interface IWeatherApi {
  token: string;
  airQuality: string;
  dataLanguage: string;
  forecastDays: string;
}

export const WeatherApiVariables: IWeatherApi = {
  token: "7ebe7c2a03cd48c090a193437222905",
  airQuality: "aqi=no",
  dataLanguage: "lang=pt",
  forecastDays: "3",
};
interface IApiAdvisor {
  token: string;
}

export const ApiAdvisorVariables: IApiAdvisor = {
  token: "c0cfc378e6ab9243013c6900a5a3e55d",
};
