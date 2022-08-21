import { createContext, useState, useEffect } from "react";

interface Ithemes {
    light: {
        name: string
        background: string
        fontColor1: string
        fontColor2: string
    }

    dark: {
        name: string
        background: string
        fontColor1: string
        fontColor2: string
    }
}

export const themes: Ithemes = {
    light: {
        name: 'light mode',
        background: '#00a6fb',
        fontColor1: '#003554',
        fontColor2: '#0d3b66'
    },

    dark: {
        name: 'dark mode',
        background: '#03045e',
        fontColor1: '#caf0f8',
        fontColor2: '#ade8f4'
    }
}

export const ThemeContext = createContext<{}>({})

export const ThemeProvider = (props: any) => {

    const [theme, setTheme]: any = useState<[]>([])

    useEffect(() => {        

        const localTheme = JSON.parse(localStorage.getItem("themes")!)

        if (!localTheme) {
            localStorage.setItem('themes', JSON.stringify(themes.light))
            setTheme(themes.light)
        }

        if (localTheme) {
            if (localTheme.name === 'light mode') {
                localStorage.setItem('themes', JSON.stringify(themes.light))
                setTheme(themes.light)
            }

            if (localTheme.name === 'dark mode') {
                localStorage.setItem('themes', JSON.stringify(themes.dark))
                setTheme(themes.dark)
            }
        }

    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}