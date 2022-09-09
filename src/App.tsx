import { WeatherApi } from "./pages/home/weather-api";
import { createContext, useEffect, useState } from "react";
import styles from "./App.module.scss";
import sun from "./assets/icons/sun.svg";
import moon from "./assets/icons/moon.svg";

export const ThemeContext = createContext({});

function App() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme: string) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={styles[theme]}>
        <div className={styles.switch}>
          <h1>PREVISÃO DO TEMPO LIVRE DE ANÚNCIOS</h1>
          <button className={styles.switch_button} onClick={toggleTheme}>
            {theme === "light" ? (
              <img src={sun} alt="ícone do sol" />
            ) : (
              <img src={moon} alt="ícone da lua" />
            )}
          </button>
        </div>
        <WeatherApi />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
