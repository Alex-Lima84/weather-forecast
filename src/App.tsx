import { WeatherApi } from "./pages/home/weather-api";
import { createContext, useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import styles from './App.module.scss'
import sun from './assets/icons/sun.svg'
import moon from './assets/icons/moon.svg'

export const ThemeContext = createContext({})

function App() {

  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme: string) => (currentTheme === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={styles[theme]}>
        <div className={styles.switch}>
          <label>{theme === "light" ? "Light mode" : "Dark mode"}</label>
          <button onClick={toggleTheme}>
            {theme === "light" ? <img src={sun} alt='ícone do sol'/> : <img src={moon} alt='ícone da lua'/>}
          </button>
        </div>
        <WeatherApi />
      </div>
    </ThemeContext.Provider>
  )
}

export default App;
