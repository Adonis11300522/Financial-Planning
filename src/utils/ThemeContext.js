import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext('');


export function ThemeMode ({children}) {
    const [value, setValue] = useState('rtl')
    return(
        <ThemeContext.Provider value={{value, setValue}}>
            <html dir={value}>
                {children}
            </html>
        </ThemeContext.Provider>
    )
}

export function useThemeContext () {
    return useContext(ThemeContext);
}