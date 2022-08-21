import { WeatherApi } from "./pages/home/weather-api";
import '../src/App.scss'
import { createContext, useState } from "react";
import ReactSwitch from "react-switch";


export const ThemeContext = createContext({})

function App() {

  const [theme, setTheme] = useState<string>("light")

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <WeatherApi />
        <div className="switch">
          <label>{theme === "light" ? "Light mode" : "Dark mode"}</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"}/>
        </div>
      </div>
    </ThemeContext.Provider>
  )

}

export default App;
